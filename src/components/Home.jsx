// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEnvelope, FaLock } from "react-icons/fa";
// import axios from "axios";
// import loginIllustration from "../assets/login.webp";

// // Role definitions
// const roles = [
//   { key: "Employee", label: "Employee", color: "text-yellow-500", bg: "bg-yellow-500", gradientFrom: "from-yellow-500" },
//   { key: "admin", label: "Admin", color: "text-orange-500", bg: "bg-orange-500", gradientFrom: "from-orange-500" },
//   { key: "hr", label: "HR", color: "text-green-500", bg: "bg-green-500", gradientFrom: "from-green-500" },
// ];

// const Home = () => {
//   const [selectedRole, setSelectedRole] = useState("Employee");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [requires2FA, setRequires2FA] = useState(false);
//   const [resendVisible, setResendVisible] = useState(false);
//   const [timer, setTimer] = useState(60); // 60 seconds countdown for OTP resend
//   const navigate = useNavigate();

//   const currentRole = roles.find((r) => r.key === selectedRole);
//   const [loginError, setLoginError] = useState("");

//   // Timer functionality for OTP resend countdown
//   useEffect(() => {
//     let interval;
//     if (requires2FA && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       setResendVisible(true);
//     }
//     return () => clearInterval(interval);
//   }, [requires2FA, timer]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   // Regular login logic with OTP flow
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (selectedRole === "admin") {
//         const { data } = await axios.post(
//           "https://backend.hrms.transev.site/admin/login",
//           { email, password },
//           { withCredentials: true }
//         );
//         const authHeader = data.authorization;
//         if (authHeader?.startsWith("Bearer ")) {
//           localStorage.setItem("admin_token", authHeader.split(" ")[1]);
//         }
//         navigate("/AdminDashboard");

//       } else if (selectedRole === "Employee") {
//         const { data } = await axios.post(
//           "https://backend.hrms.transev.site/employee/login",
//           { assignedEmail: email, password }
//         );
//         if (data?.status === "success") {
//           const authHeader = data.authorization;
//           if (authHeader?.startsWith("Bearer ")) {
//             localStorage.setItem("employee_token", authHeader.split(" ")[1]);
//           }
//           navigate("/EmployeeDashboard");
//         } else if (data?.requires2FA) {
//           alert("2FA is required. Please check your email for OTP.");
//         } else {
//           setLoginError(data?.message || "Employee login failed.");
//         }

//       } else if (selectedRole === "hr") {
//         const { data } = await axios.post(
//           "https://backend.hrms.transev.site/hr/login",
//           { email, password },
//           { withCredentials: true }
//         );
//         if (data?.status === "success") {
//           if (data.requires2FA) {
//             setRequires2FA(true);
//             setTimer(60);
//             setResendVisible(false);
//             setOtp("");
//           } else if (data.token) {
//             localStorage.setItem("hr_token", data.token);
//             navigate("/HRDashboard");
//           } else {
//             alert("Token missing in login response.");
//           }
//         } else {
//           setLoginError(data?.message || "HR login failed.");
//         }
//       }
//     } catch (err) {
//       const backendMessage =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         "Login failed. Please try again.";

//       console.error("Login error:", err.response?.data || err.message);
//       setLoginError(backendMessage);
//     }


//   };
//   // OTP verification logic
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (otp.length < 6) {
//       alert("Please enter the 6-digit OTP.");
//       return;
//     }
//     try {
//       const { data } = await axios.post(
//         "https://backend.hrms.transev.site/hr/login/2fa",
//         { email, password, otp },
//         { withCredentials: true }
//       );
//       if (data?.status === "success") {
//         const authHeader = data.authorization;
//         if (authHeader?.startsWith("Bearer ")) {
//           localStorage.setItem("hr_token", authHeader.split(" ")[1]);
//           alert("Login successful!");
//           navigate("/HRDashboard");
//         } else {
//           alert("Token missing after OTP verification.");
//         }
//       } else {
//         alert(data?.message || "OTP verification failed.");
//       }
//     } catch (err) {
//       console.error("OTP verify error:", err.response?.data || err.message);
//       alert("OTP verification failed.");
//     }
//   };

//   // OTP resend logic
//   const handleResendOtp = async () => {
//     try {
//       const { data } = await axios.post("https://backend.hrms.transev.site/hr/resend-otp", { email });
//       if (data?.status === "success") {
//         alert("OTP resent to your email.");
//         setResendVisible(false);
//         setTimer(60);
//         setOtp("");
//       } else {
//         alert(data?.message || "Failed to resend OTP.");
//       }
//     } catch (err) {
//       console.error("Resend OTP error:", err.response?.data || err.message);
//       alert("Failed to resend OTP.");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50 font-sans">
//       {/* Left-side form area */}
//       <div className="sm:w-1/2 w-full bg-white flex flex-col justify-center items-center p-10 sm:p-16 relative shadow-2xl rounded-tr-3xl rounded-br-3xl">
//         <h3 className="absolute top-6 left-6 sm:left-10 text-xl sm:text-2xl font-extrabold text-gray-700">
//           Transmogrify
//         </h3>
//         <h1 className={`text-4xl sm:text-5xl font-extrabold mb-8 tracking-tight ${currentRole.color} drop-shadow-md`}>
//           HRMS
//         </h1>
//         <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-gray-300 mb-8 shadow-lg">
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
//             alt="avatar"
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-gray-900">
//           {requires2FA ? "Verify OTP" : "Log In"}
//         </h2>

//         {/* Role selector */}
//         <div className="mb-8 flex space-x-3 sm:space-x-6 text-sm sm:text-base">
//           {roles.map(({ key, label, bg, color }) => (
//             <button
//               key={key}
//               onClick={() => {
//                 setSelectedRole(key);
//                 setEmail("");
//                 setPassword("");
//                 setOtp("");
//                 setRequires2FA(false);
//                 setLoginError("");
//               }}

//               className={`px-5 py-2 rounded-full font-semibold shadow-md transform hover:scale-105 active:scale-95 transition
//                 ${selectedRole === key
//                   ? `${bg} text-gray-900 shadow-lg`
//                   : `text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${color.replace("text-", "")}-400`
//                 }`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* Login or OTP form */}
//         {!requires2FA ? (
//           <form onSubmit={handleSubmit} className="w-full max-w-md space-y-7 px-4">
//             <div className="relative">
//               <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${currentRole.color}`} />
//               <input
//                 type="email"
//                 placeholder={`${currentRole.label.toLowerCase()}@email.com`}
//                 className="w-full pl-14 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-sm transition"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 autoComplete="email"
//               />
//             </div>
//             <div className="relative">
//               <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${currentRole.color}`} />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full pl-14 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-sm transition"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 autoComplete="current-password"
//               />
//             </div>
//             {loginError && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center font-semibold">
//                 {loginError}
//               </div>
//             )}

//             <button
//               type="submit"
//               className={`w-full py-4 rounded-2xl bg-gradient-to-r ${currentRole.gradientFrom} to-yellow-400 text-white font-extrabold shadow-lg hover:brightness-110 active:brightness-90 transition`}
//             >
//               Login
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleVerifyOtp} className="w-full max-w-md space-y-7 px-4 text-center">
//             <p className="text-lg text-gray-700 font-medium mb-4">Enter the 6-digit OTP sent to your email</p>

//             {/* OTP input boxes */}
//             <div className="flex justify-center space-x-3 mb-4">
//               {[...Array(6)].map((_, idx) => (
//                 <input
//                   key={idx}
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={1}
//                   value={otp[idx] || ""}
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     setLoginError("");
//                     const val = e.target.value.replace(/\D/, "");
//                     if (!val) return; // prevent non-numeric
//                     const otpArr = otp.split("");
//                     otpArr[idx] = val;
//                     setOtp(otpArr.join("").slice(0, 6));
//                     // Focus next input
//                     const nextInput = document.getElementById(`otp-${idx + 1}`);
//                     if (nextInput) nextInput.focus();
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Backspace") {
//                       e.preventDefault();
//                       const otpArr = otp.split("");

//                       if (otp[idx]) {
//                         otpArr[idx] = ""; // Clear current box
//                         setOtp(otpArr.join("").slice(0, 6));
//                       } else if (idx > 0) {
//                         otpArr[idx - 1] = ""; // Clear previous box
//                         setOtp(otpArr.join("").slice(0, 6));
//                         const prevInput = document.getElementById(`otp-${idx - 1}`);
//                         if (prevInput) prevInput.focus();
//                       }
//                     }
//                   }}
//                   id={`otp-${idx}`}
//                   className="w-12 h-12 rounded-full border-2 border-yellow-400 bg-yellow-100 text-center text-2xl font-bold text-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition"
//                   autoComplete="one-time-code"
//                   required
//                 />
//               ))}
//             </div>

//             {/* Timer and Resend */}
//             {!resendVisible ? (
//               <p className="text-sm text-yellow-700">
//                 Resend OTP in <span className="font-semibold">{timer}s</span>
//               </p>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 className="mt-2 text-yellow-700 underline font-semibold hover:text-yellow-900"
//               >
//                 Resend OTP
//               </button>
//             )}

//             <button
//               type="submit"
//               disabled={otp.length < 6}
//               className={`w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-extrabold shadow-lg hover:brightness-110 active:brightness-90 transition ${otp.length < 6 ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//             >
//               Verify OTP
//             </button>
//           </form>
//         )}

//         <div className="mt-6 w-full max-w-md flex justify-center">
//           <button
//             onClick={() =>
//               navigate(`/forgot-password/${selectedRole.toLowerCase()}`)
//             }
//             className="text-sm text-yellow-600 bg-yellow-50 px-7 py-3 rounded-full border border-yellow-400 hover:bg-yellow-100 transition shadow-sm"
//           >
//             Forgot Password?
//           </button>
//         </div>
//       </div>

//       {/* Right-side illustration */}
//       <div className="sm:w-1/2 w-full bg-yellow-50 flex items-center justify-center p-6 min-h-screen">
//         <img
//           src={loginIllustration}
//           alt="HRMS Illustration"
//           className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
//           loading="lazy"
//         />
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import loginIllustration from "../assets/hrms.webp";

const roles = [
  { key: "Employee", label: "Employee", color: "from-yellow-400 to-orange-400" },
  { key: "admin", label: "Admin", color: "from-purple-500 to-indigo-500" },
  { key: "hr", label: "HR", color: "from-emerald-400 to-teal-500" },
];

const Home = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("Employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [requires2FA, setRequires2FA] = useState(false);
  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(60);
  const [resendVisible, setResendVisible] = useState(false);

  const [loginError, setLoginError] = useState("");

  const currentRole = roles.find(r => r.key === selectedRole) || roles[0];

  /* =========================
     OTP TIMER (SAFE)
  ========================== */
  useEffect(() => {
    if (!requires2FA) return;

    if (timer === 0) {
      setResendVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [requires2FA, timer]);

  /* =========================
     LOGIN SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const urlMap = {
        Employee: "employee/login",
        admin: "admin/login",
        hr: "hr/login",
      };

      const payload =
        selectedRole === "Employee"
          ? { assignedEmail: email, password }
          : { email, password };

      const { data } = await axios.post(
        `https://backend.hrms.transev.site/${urlMap[selectedRole]}`,
        payload,
        { withCredentials: true }
      );

      /* ===== HR LOGIN ===== */
      if (selectedRole === "hr") {
        if (data?.status === "success" && data?.requires2FA) {
          setRequires2FA(true);
          setOtp("");
          setTimer(60);
          setResendVisible(false);
          return;
        }

        if (data?.status === "success" && data?.token) {
          localStorage.setItem("hr_token", data.token);
          navigate("/HRDashboard");
          return;
        }

        setLoginError(data?.message || "HR login failed");
        return;
      }

      /* ===== EMPLOYEE ===== */
      if (selectedRole === "Employee") {
        if (data?.status === "success" && data?.authorization) {
          localStorage.setItem(
            "employee_token",
            data.authorization.split(" ")[1]
          );
          navigate("/EmployeeDashboard");
          return;
        }
        setLoginError(data?.message || "Employee login failed");
        return;
      }

      /* ===== ADMIN ===== */
      if (selectedRole === "admin") {
        if (data?.authorization?.startsWith("Bearer ")) {
          localStorage.setItem(
            "admin_token",
            data.authorization.split(" ")[1]
          );
          navigate("/AdminDashboard");
          return;
        }
        setLoginError(data?.message || "Admin login failed");
      }

    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please try again."
      );
    }
  };

  /* =========================
     VERIFY OTP
  ========================== */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    try {
      const { data } = await axios.post(
        "https://backend.hrms.transev.site/hr/login/2fa",
        { email, password, otp },
        { withCredentials: true }
      );

      if (data?.status === "success" && data?.authorization) {
        localStorage.setItem(
          "hr_token",
          data.authorization.split(" ")[1]
        );
        navigate("/HRDashboard");
      } else {
        setLoginError(data?.message || "Invalid OTP");
      }
    } catch {
      setLoginError("Invalid or expired OTP");
    }
  };

  /* =========================
     RESEND OTP (YOUR LOGIC)
  ========================== */
  const handleResendOtp = async () => {
    try {
      const { data } = await axios.post(
        "https://backend.hrms.transev.site/hr/resend-otp",
        { email }
      );

      if (data?.status === "success") {
        setTimer(60);
        setResendVisible(false);
        setOtp("");
      } else {
        setLoginError("Failed to resend OTP");
      }
    } catch {
      setLoginError("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#f9fae8] via-[#eef1c9] to-[#e1e6a6] overflow-hidden">

      {/* GLOW */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#bdc760]/30 via-transparent to-[#bdc760]/20 blur-3xl"></div>
      </div>

      {/* IMAGE */}
      <img
        src={loginIllustration}
        alt="HRMS"
        className="absolute inset-0 m-auto max-w-5xl w-full opacity-70 pointer-events-none"
      />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl p-10 border border-white/40">

          <h1 className="text-center text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            Transmogrify HRMS
          </h1>

          {/* ROLE SELECTOR */}
          {!requires2FA && (
            <div className="flex gap-2 mb-6">
              {roles.map(role => (
                <button
                  key={role.key}
                  onClick={() => {
                    setSelectedRole(role.key);
                    setLoginError("");
                  }}
                  className={`flex-1 py-2 rounded-xl font-semibold transition
                    ${selectedRole === role.key
                      ? `bg-gradient-to-r ${role.color} text-white`
                      : "bg-white/40 text-slate-700"
                    }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          )}

          {/* LOGIN / OTP */}
          {!requires2FA ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="w-full pl-12 py-3 rounded-xl bg-white/70 border"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="w-full pl-12 py-3 rounded-xl bg-white/70 border"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {loginError && (
                <p className="text-red-600 text-sm text-center">{loginError}</p>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${currentRole.color}`}
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
              <p className="font-medium text-slate-700">Enter 6-digit OTP</p>

              <div className="flex justify-center gap-3">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (!val) return;

                      const arr = otp.split("");
                      arr[i] = val;
                      setOtp(arr.join(""));

                      document.getElementById(`otp-${i + 1}`)?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        const arr = otp.split("");
                        if (arr[i]) {
                          arr[i] = "";
                        } else if (i > 0) {
                          arr[i - 1] = "";
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                        setOtp(arr.join(""));
                      }
                    }}
                    id={`otp-${i}`}
                    className="w-12 h-12 text-xl text-center font-bold rounded-xl border-2 border-emerald-300"
                  />
                ))}
              </div>

              {!resendVisible ? (
                <p className="text-sm">Resend OTP in {timer}s</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-emerald-600 font-semibold"
                >
                  Resend OTP
                </button>
              )}

              {loginError && <p className="text-red-600 text-sm">{loginError}</p>}

              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold"
              >
                Verify OTP
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;
