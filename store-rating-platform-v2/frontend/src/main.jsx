import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Stores from "./pages/Stores.jsx";
import Admin from "./pages/Admin.jsx";
import Owner from "./pages/Owner.jsx";

function AppLayout() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Stores</Link>
        {!token && <Link to="/login">Login</Link>}
        {!token && <Link to="/signup">Signup</Link>}
        {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
        {user?.role === "OWNER" && <Link to="/owner">Owner</Link>}
        {token && <button onClick={logout}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/" element={<Stores />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            user?.role === "ADMIN" ? <Admin /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/owner"
          element={
            user?.role === "OWNER" ? <Owner /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);
