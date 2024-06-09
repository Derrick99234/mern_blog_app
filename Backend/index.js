const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Post = require("./models/post");
require("dotenv").config();
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const path = require("path");

const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
const { authenticateToken } = require("./middleware/verifyJWT");

app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  "mongodb+srv://ola:test1234@cluster0.yecx6sf.mongodb.net/mern_blog_app?retryWrites=true&w=majority&appName=Cluster0"
);

const salt = bcrypt.genSaltSync(10);

// Example route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid Credentials" });
    }
    const isPassOk = bcrypt.compareSync(password, userDoc.password);
    if (isPassOk) {
      const accessToken = jwt.sign(
        { username },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: "1h" }
      );
      res.cookie("jwt", accessToken, { httpOnly: true }).json({
        error: false,
        accessToken,
        user: userDoc,
        message: "Login successful",
      });
    } else {
      res.status(400).json({ error: true, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

app.get("/get_user", authenticateToken, async (req, res) => {
  const username = req.username;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).json({
        error: false,
        user,
        message: "User data fetched successfully",
      });
    } else {
      res.status(400).json({ error: true, message: "User not found" });
    }
  } catch (error) {
    console.error("Get user error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" });
  }
});

app.post(
  "/create_post",
  authenticateToken,
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      const { originalname, path } = req.file;
      const ext = originalname.split(".").pop();
      const newPath = `${path}.${ext}`;
      fs.renameSync(path, newPath);

      const { title, value, summary } = req.body;
      const userDoc = await User.findOne({ username: req.username });
      const postDoc = await Post.create({
        title,
        content: value,
        summary,
        cover: newPath,
        author: userDoc._id,
      });

      res.json(postDoc);
    } catch (error) {
      console.error("Create post error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the post" });
    }
  }
);

app.put(
  "/update_post",
  authenticateToken,
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const ext = originalname.split(".").pop();
        newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
      }

      const userDoc = await User.findOne({ username: req.username });
      const { id, title, value, summary } = req.body;
      const postDoc = await Post.findById(id);

      if (!postDoc.author.equals(userDoc._id)) {
        return res.status(400).json("You are not the author");
      }

      postDoc.title = title;
      postDoc.content = value;
      postDoc.summary = summary;
      if (newPath) {
        postDoc.cover = newPath;
      }

      await postDoc.save();
      res.json(postDoc);
    } catch (error) {
      console.error("Update post error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the post" });
    }
  }
);

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error);
    res.status(500).json({ error: "An error occurred while fetching posts" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    res.json(postDoc);
  } catch (error) {
    console.error("Fetch post error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the post" });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("jwt", "", { httpOnly: true }).json("ok");
});

app.listen(4500, () => console.log("Listening on port 4500"));
