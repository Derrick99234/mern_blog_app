import React from "react";
import { Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";

function Post({ _id, title, summary, cover, author, createdAt }) {
  return (
    <div className="post">
      <div class="image">
        <Link to={`/post/${_id}`}>
          <img src={`https://mern-blog-app-api-iota.vercel.app/` + cover} alt="" />
        </Link>
      </div>
      <div class="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a href="h" className="author">
            {author?.username}
          </a>
          <time>{formatISO9075(createdAt)}</time>
        </p>
        <p className="summary">
          {/* Your conversations are processed by human reviewers to improve the
          technologies powering Gemini Apps. Don't enter anything that you
          wouldn't want to be reviewed or used. */}
          {summary}
        </p>
      </div>
    </div>
  );
}

export default Post;
