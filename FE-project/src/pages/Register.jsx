import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// For the axios instance and all APIs
import api, { authAPI, projectAPI, expenseAPI, taskAPI, contractorAPI } from '../services/api';import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.register(formData);

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.log("Register Error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"   // ✅ VERY IMPORTANT
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;