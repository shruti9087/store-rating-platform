import React, { useState } from "react";
import API from "../api";
import Login from "./pages/login.jsx";
import Login from "./pages/Login.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch (e) {
      setError(e.response?.data?.error || "Failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
