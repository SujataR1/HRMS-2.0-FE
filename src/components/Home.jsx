import React, { useState, useEffect } from "react";
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
  const [resendVisible, setResendVisible] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const navigate = useNavigate();

  const currentRole = roles.find((r) => r.key === selectedRole);

  useEffect(() => {
    if (requires2FA) {
      const id = setTimeout(() => {
        setResendVisible(true);
      }, 60000); // 1 minute
      setTimerId(id);
    } else {
      clearTimeout(timerId);
      setResendVisible(false);
    }
    return () => clearTimeout(timerId);
  }, [requires2FA]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole === "admin") {
        const response = await axios.post(
          "http://192.168.0.100:9000/admin/login",
          { email, password },
          { withCredentials: true }
        );
        const authHeader = response.data.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          const token = authHeader.split(" ")[1];
          localStorage.setItem("admin_token", token);
        }
        navigate("/AdminDashboard");

    } else if (selectedRole === "Employee") {
  try {
    const response = await axios.post(
      "http://192.168.0.100:9000/employee/login",
      { assignedEmail: email, password }
    );

    if (response.data?.status === "success") {
      // Extract token from headers
      const authHeader = response.data.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix
        localStorage.setItem("employee_token", token);
      }

      navigate("/EmployeeDashboard");
    } else if (response.data?.requires2FA) {
      alert("2FA is required. Please check your email for OTP.");
    } else {
      alert("Employee login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login.");
  }

      } else if (selectedRole === "hr") {
        const response = await axios.post(
          "http://192.168.0.100:9000/hr/login",
          { email, password },
          { withCredentials: true }
        );

        if (response.data?.status === "success") {
          if (response.data.requires2FA) {
            setRequires2FA(true);
          } else if (response.data.token) {
            localStorage.setItem("admin_token", response.data.token);
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
        "http://192.168.0.100:9000/hr/login/2fa",
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

  const handleResendOtp = async () => {
    try {
      const response = await axios.post("http://192.168.0.100:9000/hr/resend-otp", {
        email,
      });
      if (response.data?.status === "success") {
        alert("OTP resent to your email.");
        setResendVisible(false);
        const id = setTimeout(() => setResendVisible(true), 60000);
        setTimerId(id);
      } else {
        alert(response.data?.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP failed:", error.response?.data || error.message);
      alert("Failed to resend OTP.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen font-sans bg-gradient-to-tr from-gray-50 via-white to-gray-100">
      {/* Left side: form */}
      <div className="sm:w-1/2 w-full bg-white flex flex-col justify-center items-center p-10 sm:p-16 relative shadow-2xl rounded-tr-3xl rounded-br-3xl">
        <h3 className="absolute top-6 left-6 sm:left-10 text-xl sm:text-2xl font-extrabold text-gray-700 tracking-wide select-none">
          Transmogrify
        </h3>

        <h1 className={`text-4xl sm:text-5xl font-extrabold mb-6 sm:mb-8 tracking-tight ${currentRole.color} drop-shadow-md`}>
          HRMS
        </h1>

        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-gray-300 mb-6 sm:mb-8 shadow-lg shadow-yellow-300/30">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="avatar"
            className="object-cover w-full h-full"
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-gray-900 tracking-wide">
          Log In
        </h2>

        <div className="mb-8 flex space-x-3 sm:space-x-6 text-sm sm:text-base">
          {roles.map(({ key, label, bg, color }) => (
            <button
              key={key}
              onClick={() => {
                setSelectedRole(key);
                setEmail("");
                setPassword("");
                setOtp("");
                setRequires2FA(false);
              }}
              className={`px-5 py-2 rounded-full font-semibold shadow-md transition-transform transform hover:scale-105 active:scale-95
                ${selectedRole === key
                  ? `${bg} text-gray-900 shadow-lg`
                  : `text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${color.replace("text-", "")}-400`
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {!requires2FA ? (
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-7 px-4 sm:px-0">
            <div className="relative">
              <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${currentRole.color}`} />
              <input
                type="email"
                placeholder={`${currentRole.label.toLowerCase()}@email.com`}
                className="w-full pl-14 pr-4 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 shadow-sm transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${currentRole.color}`} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-14 pr-4 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 shadow-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl bg-gradient-to-r ${currentRole.gradientFrom} to-yellow-400 text-white font-extrabold shadow-lg hover:brightness-110 active:brightness-90 transition`}
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="w-full max-w-md space-y-7 px-4 sm:px-0">
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-green-500" />
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full pl-14 pr-4 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 shadow-sm transition"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoComplete="one-time-code"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 text-white font-extrabold shadow-lg hover:brightness-110 active:brightness-90 transition"
            >
              Verify OTP
            </button>
            {resendVisible && (
              <button
                type="button"
                onClick={handleResendOtp}
                className="block mx-auto text-sm text-blue-600 underline hover:text-blue-800 mt-2 focus:outline-none"
              >
                Resend OTP
              </button>
            )}
          </form>
        )}

        <div className="mt-6 sm:mt-10 w-full max-w-md flex justify-center">
         <button
  onClick={() => {
    if (selectedRole === "admin") {
      navigate("/forgot-password/admin");
    } else if (selectedRole === "hr") {
      navigate("/forgot-password/hr");
    } else {
      navigate("/forgot-password/employee");
    }
  }}
  className="text-sm text-yellow-600 bg-yellow-50 px-7 py-3 rounded-full border border-yellow-400 hover:bg-yellow-100 transition whitespace-nowrap shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
>
  Forgot Password?
</button>

        </div>
      </div>

      {/* Right side: illustration */}
      <div className="sm:w-1/2 w-full bg-yellow-50 flex items-center justify-center p-6 sm:p-0 min-h-screen h-screen flex-grow">
        <img
          src={loginIllustration}
          alt="HRMS Illustration"
          className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Home;
