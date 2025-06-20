import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import loginIllustration from "../assets/login.webp";

const roles = [
  { key: "Employee", label: "Employee", color: "text-yellow-500", bg: "bg-yellow-500", gradientFrom: "from-yellow-500" },
  { key: "admin", label: "Admin", color: "text-orange-500", bg: "bg-orange-500", gradientFrom: "from-orange-500" },
  { key: "hr", label: "HR", color: "text-green-500", bg: "bg-green-500", gradientFrom: "from-green-500" },
];

const Home = () => {
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const currentRole = roles.find((r) => r.key === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Logging in as ${currentRole.label}`, { email, password });

    try {
      if (selectedRole === "admin") {
        const response = await axios.post("http://localhost:9000/admin/login", {
          email,
          password,
        });

        console.log("Admin login successful", response.data);
        localStorage.setItem("admin_token", response.data.token); // optional if token returned in body
        navigate("/AdminDashboard");

      } else if (selectedRole === "Employee") {
        const response = await axios.post("http://localhost:9000/employee/login", {
          assignedEmail: email,
          password,
        });

        // Check for status success without requiring token
        if (response.data?.status === "success") {
          console.log("Employee login successful");
          // If token is returned, store it (optional)
          if (response.data.token) {
            localStorage.setItem("employee_token", response.data.token);
          }
          navigate("/EmployeeDashboard");
        } else if (response.data?.requires2FA) {
          alert("2FA is required. Please check your email for OTP.");
        } else {
          alert("Employee login failed. Please check your credentials.");
        }

      } else {
        alert(`${currentRole.label} login not implemented yet.`);
      }
    } catch (error) {
      console.error(`${currentRole.label} login failed`, error.response?.data || error.message);
      alert(`${currentRole.label} login failed. Please check your credentials.`);
    }
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Left Side */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-16 relative shadow-lg">
        <h3 className="absolute top-6 left-10 text-2xl font-extrabold text-gray-700 select-none tracking-wide">
          Transmogrify
        </h3>

        <h1
          className={`text-5xl font-extrabold mb-8 ${currentRole.color} drop-shadow-md`}
          style={{ textShadow: `0 2px 8px rgba(0,0,0,0.15)` }}
        >
          HRMS
        </h1>

        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 mb-8 shadow-md">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-4xl font-semibold mb-6 text-gray-800">Log In</h2>

        {/* Role Selection Buttons */}
        <div className="mb-8 flex space-x-4 text-base">
          {roles.map(({ key, label, bg }) => (
            <button
              key={key}
              onClick={() => {
                setSelectedRole(key);
                setEmail("");
                setPassword("");
              }}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedRole === key
                  ? `${bg} text-gray-900 shadow-lg`
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-96 space-y-6">
          {/* Email Input */}
          <div className="relative">
            <FaEnvelope
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${currentRole.color}`}
            />
            <input
              type="email"
              placeholder={`${currentRole.label.toLowerCase()}@email.com`}
              className="w-full pl-14 pr-4 py-4 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none transition shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${currentRole.color}`}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-14 pr-4 py-4 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none transition shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl bg-gradient-to-r ${currentRole.gradientFrom} to-yellow-400 text-white font-bold hover:brightness-110 transition shadow-lg`}
          >
            Login
          </button>
        </form>

        <div className="absolute bottom-10">
          <button className="text-sm text-yellow-600 bg-yellow-50 px-6 py-3 rounded-full border border-yellow-400 hover:bg-yellow-100 transition font-medium shadow-sm">
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-yellow-50 flex items-center justify-center">
        <img
          src={loginIllustration}
          alt="HRMS Illustration"
          className="w-4/5 rounded-lg shadow-lg"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Home;
