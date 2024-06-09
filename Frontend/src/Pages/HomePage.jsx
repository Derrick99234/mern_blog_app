import React, { useEffect, useState } from "react";
import Post from "../components/Post";

function HomePage() {
  const [post, setPost] = useState([]);
  useEffect(() => {
    async function getPost() {
      const res = await fetch("https://mern-blog-app-api-iota.vercel.app/posts");

      if (res.ok) {
        const data = await res.json();
        setPost(data);
        console.log(data);
      }
    }

    getPost();
  }, []);
  return <>{post.length > 0 && post.map((post) => <Post {...post} />)}</>;
}

export default HomePage;
