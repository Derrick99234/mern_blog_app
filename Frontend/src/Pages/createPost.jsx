import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

function CreatePost() {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [redirect, setRedirect] = useState(false);

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
  ];
  const createNewPost = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.set("title", title);
    data.set("summary", summary);
    data.set("value", value);
    data.set("file", files[0]);

    const res = await fetch("https://mern-blog-app-api-iota.vercel.app/create_post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (res.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      {/* <textarea name="" id="" cols={30} rows={10}></textarea> */}
      <ReactQuill
        value={value}
        formats={formats}
        onChange={(newValue) => setValue(newValue)}
      />
      <button style={{ marginTop: "15px" }}>Create Post</button>
    </form>
  );
}

export default CreatePost;
