/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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

function EditPost() {
  const { id } = useParams();
  const [value, setValue] = useState("");
  const [files, setFiles] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch("https://mern-blog-app-api-iota.vercel.app/post/" + id).then((res) =>
      res.json().then((post) => {
        setValue(post.content);
        setTitle(post.title);
        setSummary(post.summary);
      })
    );
  }, []);

  const updatePost = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.set("title", title);
    data.set("summary", summary);
    data.set("value", value);
    data.set("id", id);
    files?.[0] && data.set("file", files?.[0]);

    const res = await fetch("https://mern-blog-app-api-iota.vercel.app/update_post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (res.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    <Navigate to={`/post/${id}`} />;
  }
  return (
    <form onSubmit={updatePost}>
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
      <button style={{ marginTop: "15px" }}>Update Post</button>
    </form>
  );
}

export default EditPost;
