import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("http://localhost:4500/get_user", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUserInfo(data.user);
      }
    };
    return () => getUser();
  }, [setUserInfo]);

  const logout = () => {
    fetch("http://localhost:4500/logout", {
      credentials: "include",
      method: "POST",
    });

    setUserInfo(null);
  };
  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {userInfo && (
          <>
            <Link to="/create">create new post</Link>
            <span onClick={logout}>{userInfo?.username} (logout)</span>
          </>
        )}

        {!userInfo && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
