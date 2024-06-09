import React, { useContext, useEffect, useState } from "react";
import { formatISO9075 } from "date-fns";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";

function PostPage() {
  const [post, setPost] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`https://mern-blog-app-api-iota.vercel.app/post/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((postInfo) => setPost(postInfo))
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  let formattedDate = "Invalid date";
  if (post.createdAt) {
    const date = new Date(post.createdAt);
    if (!isNaN(date)) {
      formattedDate = formatISO9075(date);
    } else {
      console.error("Invalid createdAt value:", post.createdAt);
    }
  }

  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      <time>{formattedDate}</time>
      <div className="author">by @{post.author?.username}</div>
      {userInfo._id === post.author?._id && (
        <>
          <div className="edit-row">
            <Link to={`/edit/${post._id}`} className="edit-btn">
              Edit Post
            </Link>
          </div>
        </>
      )}
      <div className="post-image">
        <img src={`https://mern-blog-app-api-iota.vercel.app/${post.cover}`} alt="" />
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export default PostPage;
