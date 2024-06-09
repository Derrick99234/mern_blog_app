const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const cookies = req.cookies;

  const cookie = cookies.jwt;

  if (!cookie) return res.sendStatus(401);

  jwt.verify(cookie, process.env.ACCESS_SECRET_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.username = decoded.username;
    next();
  });
};

module.exports = { authenticateToken };
