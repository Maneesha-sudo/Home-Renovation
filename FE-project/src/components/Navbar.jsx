import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-l from-red-200 to-pink-800 p-4 text-white flex justify-between">
      <h1 className="text-2xl font-extrabold cursor-pointer" onClick={() => navigate("/")}>
        Home Improvement Tracker
      </h1>
      <div className="space-x-4 text-xl font-bold">
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}