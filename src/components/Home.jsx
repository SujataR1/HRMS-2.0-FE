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

const RESEND_DELAY = 60; // seconds (1 minute)

const Home = () => {
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill("")); // array of 6 digits
  const [requires2FA, setRequires2FA] = useState(false);
  const [resendVisible, setResendVisible] = useState(false);
  const [timer, setTimer] = useState(RESEND_DELAY);
  const navigate = useNavigate();

  const currentRole = roles.find((r) => r.key === selectedRole);

  // Timer for resend OTP
  useEffect(() => {
    if (!requires2FA) {
      setResendVisible(false);
      setTimer(RESEND_DELAY);
      return;
    }

    setResendVisible(false);
    setTimer(RESEND_DELAY);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setResendVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [requires2FA]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Handle OTP input change
  const handleOtpChange = (element, index) => {
    if (/^[0-9]?$/.test(element.value)) { // allow only single digit number or empty
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      // Move focus to next input
      if (element.value !== "" && element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  // Handle backspace to go to previous input
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = e.target.previousSibling;
      if (prevInput) prevInput.focus();
    }
  };

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
            const authHeader = response.data.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
              const token = authHeader.split(" ")[1];
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

    if (otp.some((d) => d === "")) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }

    const otpCode = otp.join("");

    try {
      const verifyResponse = await axios.post(
        "http://192.168.0.100:9000/hr/login/2fa",
        { email, password, otp: otpCode },
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
        setTimer(RESEND_DELAY);
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
                setOtp(new Array(6).fill(""));
                setRequires2FA(false);
              }}
              className={`px-5 py-2 rounded-full font-semibold shadow-md transition-transform transform hover:scale-105 active:scale-95 
                ${selectedRole === key ? `bg-gradient-to-r ${bg} to-yellow-300 text-white shadow-${color}` : "bg-gray-200 text-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          className="w-full max-w-md"
          onSubmit={requires2FA ? handleVerifyOtp : handleSubmit}
          autoComplete="off"
        >
          <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
            Email address
          </label>
          <div className="relative mb-4">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              disabled={requires2FA}
            />
          </div>

          {!requires2FA && (
            <>
              <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">
                Password
              </label>
              <div className="relative mb-6">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </>
          )}

          {/* OTP inputs for 2FA */}
          {requires2FA && (
            <>
              <label className="block mb-2 text-gray-700 font-medium">
                Enter 6-digit OTP
              </label>
              <div className="flex justify-center space-x-3 mb-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className="w-12 h-12 text-center text-xl rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
              >
                Verify OTP
              </button>

              <div className="text-center mt-4 text-gray-600">
                {resendVisible ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="underline text-green-600 hover:text-green-800 font-medium"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p>Resend OTP available in {formatTime(timer)}</p>
                )}
              </div>
            </>
          )}

          {!requires2FA && (
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
            >
              Log In
            </button>
          )}
        </form>
      </div>

      {/* Right side: Illustration */}
      <div className="sm:w-1/2 w-full flex items-center justify-center bg-yellow-200 rounded-tl-3xl rounded-bl-3xl shadow-lg">
        <img
          src={loginIllustration}
          alt="Login Illustration"
          className="object-contain max-h-full max-w-full"
        />
      </div>
    </div>
  );
};

export default Home;
