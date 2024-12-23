import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [role, setRole] = useState("candidate"); // Default role
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";
      const response = await axios.post(
        endpoint,
        { ...formData, role },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      // Navigate to respective dashboard
      if (role === "candidate") navigate("/candidate-dashboard");
      else navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 text-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"} as{" "}
          <span className="capitalize">{role}</span>
        </h2>

        {/* Role Toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setRole("candidate")}
            className={`px-4 py-2 rounded-l-lg ${
              role === "candidate"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Candidate
          </button>
          {/* Admin toggle button is only available for login */}
          {isLogin && (
            <button
              onClick={() => setRole("admin")}
              className={`px-4 py-2 rounded-r-lg ${
                role === "admin"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Admin
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-blue-500 underline"
        >
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;
