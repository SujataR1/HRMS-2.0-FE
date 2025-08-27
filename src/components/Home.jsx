import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import loginIllustration from "../assets/login.webp";

// Role definitions
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
  const [timer, setTimer] = useState(60); // 60 seconds countdown for OTP resend
  const navigate = useNavigate();

  const currentRole = roles.find((r) => r.key === selectedRole);

  // Timer functionality for OTP resend countdown
  useEffect(() => {
    let interval;
    if (requires2FA && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendVisible(true);
    }
    return () => clearInterval(interval);
  }, [requires2FA, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Regular login logic with OTP flow
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole === "admin") {
        const { data } = await axios.post(
          "https://backend.hrms.transev.site/admin/login",
          { email, password },
          { withCredentials: true }
        );
        const authHeader = data.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          localStorage.setItem("admin_token", authHeader.split(" ")[1]);
        }
        navigate("/AdminDashboard");

      } else if (selectedRole === "Employee") {
        const { data } = await axios.post(
          "https://backend.hrms.transev.site/employee/login",
          { assignedEmail: email, password }
        );
        if (data?.status === "success") {
          const authHeader = data.authorization;
          if (authHeader?.startsWith("Bearer ")) {
            localStorage.setItem("employee_token", authHeader.split(" ")[1]);
          }
          navigate("/EmployeeDashboard");
        } else if (data?.requires2FA) {
          alert("2FA is required. Please check your email for OTP.");
        } else {
          alert("Employee login failed. Check credentials.");
        }

      } else if (selectedRole === "hr") {
        const { data } = await axios.post(
          "https://backend.hrms.transev.site/hr/login",
          { email, password },
          { withCredentials: true }
        );
        if (data?.status === "success") {
          if (data.requires2FA) {
            setRequires2FA(true);
            setTimer(60);
            setResendVisible(false);
            setOtp("");
          } else if (data.token) {
            localStorage.setItem("hr_token", data.token);
            navigate("/HRDashboard");
          } else {
            alert("Token missing in login response.");
          }
        } else {
          alert("HR login failed. Check credentials.");
        }
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Login failed. Please try again.");
    }
  };
  // OTP verification logic
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }
    try {
      const { data } = await axios.post(
        "https://backend.hrms.transev.site/hr/login/2fa",
        { email, password, otp },
        { withCredentials: true }
      );
      if (data?.status === "success") {
        const authHeader = data.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          localStorage.setItem("hr_token", authHeader.split(" ")[1]);
          alert("Login successful!");
          navigate("/HRDashboard");
        } else {
          alert("Token missing after OTP verification.");
        }
      } else {
        alert(data?.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error("OTP verify error:", err.response?.data || err.message);
      alert("OTP verification failed.");
    }
  };

  // OTP resend logic
  const handleResendOtp = async () => {
    try {
      const { data } = await axios.post("https://backend.hrms.transev.site/hr/resend-otp", { email });
      if (data?.status === "success") {
        alert("OTP resent to your email.");
        setResendVisible(false);
        setTimer(60);
        setOtp("");
      } else {
        alert(data?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err.response?.data || err.message);
      alert("Failed to resend OTP.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen font-sans bg-gradient-to-tr from-gray-50 via-white to-gray-100">
      {/* Left-side form area */}
      <div className="sm:w-1/2 w-full bg-white flex flex-col justify-center items-center p-10 sm:p-16 relative shadow-2xl rounded-tr-3xl rounded-br-3xl">
        <h3 className="absolute top-6 left-6 sm:left-10 text-xl sm:text-2xl font-extrabold text-gray-700">
          Transmogrify
        </h3>
        <h1 className={`text-4xl sm:text-5xl font-extrabold mb-8 tracking-tight ${currentRole.color} drop-shadow-md`}>
          HRMS
        </h1>
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-gray-300 mb-8 shadow-lg">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="avatar"
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-gray-900">
          {requires2FA ? "Verify OTP" : "Log In"}
        </h2>

        {/* Role selector */}
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
              className={`px-5 py-2 rounded-full font-semibold shadow-md transform hover:scale-105 active:scale-95 transition
                ${selectedRole === key
                  ? `${bg} text-gray-900 shadow-lg`
                  : `text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${color.replace("text-", "")}-400`
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Login or OTP form */}
        {!requires2FA ? (
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-7 px-4">
            <div className="relative">
              <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${currentRole.color}`} />
              <input
                type="email"
                placeholder={`${currentRole.label.toLowerCase()}@email.com`}
                className="w-full pl-14 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-sm transition"
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
                className="w-full pl-14 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-sm transition"
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
          <form onSubmit={handleVerifyOtp} className="w-full max-w-md space-y-7 px-4 text-center">
            <p className="text-lg text-gray-700 font-medium mb-4">Enter the 6-digit OTP sent to your email</p>

            {/* OTP input boxes */}
            <div className="flex justify-center space-x-3 mb-4">
              {[...Array(6)].map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[idx] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    if (!val) return; // prevent non-numeric
                    const otpArr = otp.split("");
                    otpArr[idx] = val;
                    setOtp(otpArr.join("").slice(0, 6));
                    // Focus next input
                    const nextInput = document.getElementById(`otp-${idx + 1}`);
                    if (nextInput) nextInput.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      e.preventDefault();
                      const otpArr = otp.split("");

                      if (otp[idx]) {
                        otpArr[idx] = ""; // Clear current box
                        setOtp(otpArr.join("").slice(0, 6));
                      } else if (idx > 0) {
                        otpArr[idx - 1] = ""; // Clear previous box
                        setOtp(otpArr.join("").slice(0, 6));
                        const prevInput = document.getElementById(`otp-${idx - 1}`);
                        if (prevInput) prevInput.focus();
                      }
                    }
                  }}
                  id={`otp-${idx}`}
                  className="w-12 h-12 rounded-full border-2 border-yellow-400 bg-yellow-100 text-center text-2xl font-bold text-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition"
                  autoComplete="one-time-code"
                  required
                />
              ))}
            </div>

            {/* Timer and Resend */}
            {!resendVisible ? (
              <p className="text-sm text-yellow-700">
                Resend OTP in <span className="font-semibold">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="mt-2 text-yellow-700 underline font-semibold hover:text-yellow-900"
              >
                Resend OTP
              </button>
            )}

            <button
              type="submit"
              disabled={otp.length < 6}
              className={`w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-extrabold shadow-lg hover:brightness-110 active:brightness-90 transition ${otp.length < 6 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              Verify OTP
            </button>
          </form>
        )}

        <div className="mt-6 w-full max-w-md flex justify-center">
          <button
            onClick={() =>
              navigate(`/forgot-password/${selectedRole.toLowerCase()}`)
            }
            className="text-sm text-yellow-600 bg-yellow-50 px-7 py-3 rounded-full border border-yellow-400 hover:bg-yellow-100 transition shadow-sm"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Right-side illustration */}
      <div className="sm:w-1/2 w-full bg-yellow-50 flex items-center justify-center p-6 min-h-screen">
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
