// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import loginIllustration from "../assets/hrms.webp";
// import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// const roles = [
//   { key: "Employee", label: "Employee", color: "from-yellow-400 to-orange-400" },
//   { key: "admin", label: "Admin", color: "from-purple-500 to-indigo-500" },
//   { key: "hr", label: "HR", color: "from-emerald-400 to-teal-500" },
// ];

// const Home = () => {
//   const navigate = useNavigate();

//   const [selectedRole, setSelectedRole] = useState("Employee");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [requires2FA, setRequires2FA] = useState(false);
//   const [otp, setOtp] = useState("");

//   const [timer, setTimer] = useState(60);
//   const [resendVisible, setResendVisible] = useState(false);

//   const [loginError, setLoginError] = useState("");

//   const currentRole = roles.find(r => r.key === selectedRole) || roles[0];
//   const [showPassword, setShowPassword] = useState(false);


//   /* =========================
//      OTP TIMER (SAFE)
//   ========================== */
//   useEffect(() => {
//     if (!requires2FA) return;

//     if (timer === 0) {
//       setResendVisible(true);
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimer(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [requires2FA, timer]);

//   /* =========================
//      LOGIN SUBMIT
//   ========================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoginError("");

//     try {
//       const urlMap = {
//         Employee: "employee/login",
//         admin: "admin/login",
//         hr: "hr/login",
//       };

//       const payload =
//         selectedRole === "Employee"
//           ? { assignedEmail: email, password }
//           : { email, password };

//       const { data } = await axios.post(
//         `https://backend.hrms.transev.site/${urlMap[selectedRole]}`,
//         payload,
//         { withCredentials: true }
//       );

//       /* ===== HR LOGIN ===== */
//       if (selectedRole === "hr") {
//         if (data?.status === "success" && data?.requires2FA) {
//           setRequires2FA(true);
//           setOtp("");
//           setTimer(60);
//           setResendVisible(false);
//           return;
//         }

//         if (data?.status === "success" && data?.token) {
//           localStorage.setItem("hr_token", data.token);
//           navigate("/HRDashboard");
//           return;
//         }

//         setLoginError(data?.message || "HR login failed");
//         return;
//       }

//       /* ===== EMPLOYEE ===== */
//       if (selectedRole === "Employee") {
//         if (data?.status === "success" && data?.authorization) {
//           localStorage.setItem(
//             "employee_token",
//             data.authorization.split(" ")[1]
//           );
//           navigate("/EmployeeDashboard");
//           return;
//         }
//         setLoginError(data?.message || "Employee login failed");
//         return;
//       }

//       /* ===== ADMIN ===== */
//       if (selectedRole === "admin") {
//         if (data?.authorization?.startsWith("Bearer ")) {
//           localStorage.setItem(
//             "admin_token",
//             data.authorization.split(" ")[1]
//           );
//           navigate("/AdminDashboard");
//           return;
//         }
//         setLoginError(data?.message || "Admin login failed");
//       }

//     } catch (err) {
//       setLoginError(
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         "Login failed. Please try again."
//       );
//     }
//   };

//   /* =========================
//      VERIFY OTP
//   ========================== */
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (otp.length !== 6) return;

//     try {
//       const { data } = await axios.post(
//         "https://backend.hrms.transev.site/hr/login/2fa",
//         { email, password, otp },
//         { withCredentials: true }
//       );

//       if (data?.status === "success" && data?.authorization) {
//         localStorage.setItem(
//           "hr_token",
//           data.authorization.split(" ")[1]
//         );
//         navigate("/HRDashboard");
//       } else {
//         setLoginError(data?.message || "Invalid OTP");
//       }
//     } catch {
//       setLoginError("Invalid or expired OTP");
//     }
//   };

//   /* =========================
//      RESEND OTP (YOUR LOGIC)
//   ========================== */
//   const handleResendOtp = async () => {
//     try {
//       const { data } = await axios.post(
//         "https://backend.hrms.transev.site/hr/resend-otp",
//         { email }
//       );

//       if (data?.status === "success") {
//         setTimer(60);
//         setResendVisible(false);
//         setOtp("");
//       } else {
//         setLoginError("Failed to resend OTP");
//       }
//     } catch {
//       setLoginError("Failed to resend OTP");
//     }
//   };

//   return (
//     <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#f9fae8] via-[#eef1c9] to-[#e1e6a6] overflow-hidden">

//       {/* GLOW */}
//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#bdc760]/30 via-transparent to-[#bdc760]/20 blur-3xl"></div>
//       </div>

//       {/* IMAGE */}
//       <img
//         src={loginIllustration}
//         alt="HRMS"
//         className="absolute inset-0 m-auto max-w-5xl w-full opacity-70 pointer-events-none"
//       />

//       {/* CARD */}
//       <div className="relative z-10 w-full max-w-md px-6">
//         <div className="rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl p-10 border border-white/40">

//           <h1 className="text-center text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
//             Transmogrify HRMS
//           </h1>

//           {/* ROLE SELECTOR */}
//           {!requires2FA && (
//             <div className="flex gap-2 mb-6">
//               {roles.map(role => (
//                 <button
//                   key={role.key}
//                   onClick={() => {
//                     setSelectedRole(role.key);
//                     setLoginError("");
//                   }}
//                   className={`flex-1 py-2 rounded-xl font-semibold transition
//                     ${selectedRole === role.key
//                       ? `bg-gradient-to-r ${role.color} text-white`
//                       : "bg-white/40 text-slate-700"
//                     }`}
//                 >
//                   {role.label}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* LOGIN / OTP */}
//           {!requires2FA ? (
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="relative">
//                 <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="email"
//                   className="w-full pl-12 py-3 rounded-xl bg-white/70 border"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

// <div className="relative">
//   <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

//   <input
//     type={showPassword ? "text" : "password"}
//     className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border"
//     placeholder="Password"
//     value={password}
//     onChange={(e) => setPassword(e.target.value)}
//     required
//   />

//   <button
//     type="button"
//     onClick={() => setShowPassword(!showPassword)}
//     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
//     tabIndex={-1}
//   >
//     {showPassword ? <FaEyeSlash /> : <FaEye />}
//   </button>
// </div>


//               {loginError && (
//                 <p className="text-red-600 text-sm text-center">{loginError}</p>
//               )}

//               <button
//                 type="submit"
//                 className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${currentRole.color}`}
//               >
//                 Sign In
//               </button>
//               {/* FORGOT PASSWORD */}
//               <div className="text-center mt-4">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     navigate(`/forgot-password/${selectedRole.toLowerCase()}`)
//                   }
//                   className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>

//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
//               <p className="font-medium text-slate-700">Enter 6-digit OTP</p>

//               <div className="flex justify-center gap-3">
//                 {[...Array(6)].map((_, i) => (
//                   <input
//                     key={i}
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={1}
//                     value={otp[i] || ""}
//                     onChange={(e) => {
//                       const val = e.target.value.replace(/\D/g, "");
//                       if (!val) return;

//                       const arr = otp.split("");
//                       arr[i] = val;
//                       setOtp(arr.join(""));

//                       document.getElementById(`otp-${i + 1}`)?.focus();
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Backspace") {
//                         const arr = otp.split("");
//                         if (arr[i]) {
//                           arr[i] = "";
//                         } else if (i > 0) {
//                           arr[i - 1] = "";
//                           document.getElementById(`otp-${i - 1}`)?.focus();
//                         }
//                         setOtp(arr.join(""));
//                       }
//                     }}
//                     id={`otp-${i}`}
//                     className="w-12 h-12 text-xl text-center font-bold rounded-xl border-2 border-emerald-300"
//                   />
//                 ))}
//               </div>

//               {!resendVisible ? (
//                 <p className="text-sm">Resend OTP in {timer}s</p>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={handleResendOtp}
//                   className="text-emerald-600 font-semibold"
//                 >
//                   Resend OTP
//                 </button>
//               )}

//               {loginError && <p className="text-red-600 text-sm">{loginError}</p>}

//               <button
//                 type="submit"
//                 disabled={otp.length !== 6}
//                 className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold"
//               >
//                 Verify OTP
//               </button>
//             </form>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginIllustration from "../assets/hrms.webp";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";


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

  /* 🔹 NEW STATES (RESEND OTP) */
  const [timer, setTimer] = useState(60);
  const [resendVisible, setResendVisible] = useState(false);
  const [resending, setResending] = useState(false);

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const currentRole = roles.find(r => r.key === selectedRole) || roles[0];
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  /* =========================
     OTP TIMER (NEW)
  ========================== */
  useEffect(() => {
    if (!requires2FA) return;

    if (timer <= 0) {
      setResendVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [requires2FA, timer]);

  /* =========================
     LOGIN SUBMIT (UNCHANGED)
  ========================== */
const handleSubmit = async (e) => {
  e.preventDefault();
  if (isLoggingIn) return;

  setIsLoggingIn(true);
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
          setTimer(60);            // 🔹 NEW
          setResendVisible(false); // 🔹 NEW
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
  } finally {
    setIsLoggingIn(false);
  }
};


  /* =========================
     VERIFY OTP (UNCHANGED)
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
     RESEND OTP (NEW FEATURE)
  ========================== */
  const handleResendOtp = async () => {
    if (resending) return;

    setResending(true);
    setLoginError("");

    try {
      const { data } = await axios.post(
        "https://backend.hrms.transev.site/hr/resend-otp",
        { email },
        { withCredentials: true }
      );

      if (data?.status === "success") {
        setTimer(60);
        setResendVisible(false);
        setOtp("");
      } else {
        setLoginError("Failed to resend OTP");
      }
    } catch (err) {
      setLoginError(
        err.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#f9fae8] via-[#eef1c9] to-[#e1e6a6] overflow-hidden">

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#bdc760]/30 via-transparent to-[#bdc760]/20 blur-3xl"></div>
      </div>

      <img
        src={loginIllustration}
        alt="HRMS"
        className="absolute inset-0 m-auto max-w-5xl w-full opacity-70 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl p-10 border border-white/40">

          <h1 className="text-center text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            Transmogrify HRMS
          </h1>

          {/* ROLE SELECTOR (UNCHANGED) */}
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
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {loginError && (
                <p className="text-red-600 text-sm text-center">{loginError}</p>
              )}

<button
  type="submit"
  disabled={isLoggingIn}
  className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${currentRole.color}
    ${isLoggingIn ? "opacity-70 cursor-not-allowed" : ""}`}
>
  {isLoggingIn ? "Signing in..." : "Sign In"}
</button>


              {/* FORGOT PASSWORD (KEPT) */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/forgot-password/${selectedRole.toLowerCase()}`)
                  }
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
              <p className="font-medium text-slate-700">Enter 6-digit OTP</p>

              <div className="flex justify-center gap-3">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
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

                      if (i < 5) {
                        document.getElementById(`otp-${i + 1}`)?.focus();
                      }
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
                  disabled={resending}
                  className={`font-semibold ${
                    resending
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-emerald-600 hover:text-emerald-800"
                  }`}
                >
                  {resending ? "Resending..." : "Resend OTP"}
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
