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
  const [otp, setOtp] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const navigate = useNavigate();

  const currentRole = roles.find((r) => r.key === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole === "admin") {
        const response = await axios.post(
          "http://localhost:9000/admin/login",
          { email, password },
          { withCredentials: true }
        );
        console.log("get response", response)
        const authHeader = response.data.authorization;
        console.log("auth header",authHeader)
        if (authHeader?.startsWith("Bearer ")) {
          const token = authHeader.split(" ")[1];
          localStorage.setItem("admin_token", token);
        } else {
          console.warn("Authorization header missing or malformed");
        }
        navigate("/AdminDashboard");

      } else if (selectedRole === "Employee") {
        const response = await axios.post(
          "http://localhost:9000/employee/login",
          {
            assignedEmail: email,
            password,
          }
        );

        if (response.data?.status === "success") {
          const token = response?.data?.token || response?.data?.data?.token;
          if (token) {
            localStorage.setItem("employee_token", token);
          }
          navigate("/EmployeeDashboard");
        } else if (response.data?.requires2FA) {
          alert("2FA is required. Please check your email for OTP.");
        } else {
          alert("Employee login failed. Please check your credentials.");
        }

      } else if (selectedRole === "hr") {
        // HR Login logic
        const response = await axios.post(
          "http://localhost:9000/hr/login",
          { email, password },
          { withCredentials: true }
        );

        if (response.data?.status === "success") {
          if (response.data.requires2FA) {
            // Show OTP input form
            setRequires2FA(true);
          } else if (response.data.token) {
            localStorage.setItem("admin_token", token); // ✅ storing as admin_token
            navigate("/HRDashboard");
          } else {
            alert("Token missing in login response.");
          }
        } else {
          alert("HR login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

const handleVerifyOtp = async (e) => {
  e.preventDefault();
  if (!otp) {
    alert("Please enter the OTP.");
    return;
  }

  try {
    const verifyResponse = await axios.post(
      "http://localhost:9000/hr/login/2fa",
      { email, password, otp },
      { withCredentials: true }
    );

    if (verifyResponse.data?.status === "success") {
      const authHeader = verifyResponse.data.authorization;
      const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

      if (token) {
        localStorage.setItem("hr_token", token);
        alert("Login successful!");
        navigate("/HRDashboard");
      } else {
        alert("Token missing after OTP verification.");
      }
    } else {
      alert(verifyResponse.data?.message || "OTP verification failed.");
    }
  } catch (error) {
    console.error("OTP verification failed:", error.response?.data || error.message);
    alert("OTP verification failed.");
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
                setOtp("");
                setRequires2FA(false);
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

        {/* Login Form or OTP Form */}
        {!requires2FA ? (
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
        ) : (
          <form onSubmit={handleVerifyOtp} className="w-96 space-y-6">
            <div className="relative">
              <FaLock
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${currentRole.color}`}
              />
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full pl-14 pr-4 py-4 rounded-xl border border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-300 focus:outline-none transition shadow-sm"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoComplete="one-time-code"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white font-bold hover:brightness-110 transition shadow-lg`}
            >
              Verify OTP
            </button>
          </form>
        )}

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
