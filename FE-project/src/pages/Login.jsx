import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// For the axios instance and all APIs
import api, { authAPI, projectAPI, expenseAPI, taskAPI, contractorAPI } from '../services/api';import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ moved inside component

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authAPI.login(formData);

      // ✅ Use context login
      login(data.token, data.user);

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Home Tracker
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;