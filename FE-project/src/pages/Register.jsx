import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/api/auth/register", { name, email, password });

      // Clear form after success
      setName("");
      setEmail("");
      setPassword("");

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* 👇 autoComplete OFF added */}
        <form onSubmit={handleRegister} className="flex flex-col" autoComplete="off">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            className="p-2 border mb-4 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border mb-4 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border mb-4 rounded"
            required
          />

          <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Register
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}