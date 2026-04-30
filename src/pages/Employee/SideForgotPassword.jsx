// import React, { useState } from "react";
// import axios from "axios";
// import Illustration from "../../assets/right.png";
// import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

// const SideForgotPassword = () => {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("employee_token");

//   // Step 1: Send OTP
//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "https://backend.hrms.transev.site/employee/request-password-reset",
//         { assignedEmail: email },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data?.status === "success") {
//         setMessage("OTP sent to your email.");
//         setStep(2);
//       } else {
//         setError(response.data?.message || "Failed to send OTP.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2: Reset Password
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     setLoading(true);
//     try {
//       const response = await axios.patch(
//         "https://backend.hrms.transev.site/employee/reset-password",
//         {
//           assignedEmail: email,
//           otp,
//           newPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data?.status === "success") {
//         setMessage("✅ Password reset successful.");
//         setOtp("");
//         setNewPassword("");
//         setEmail("");
//         // Stay on the page, no redirect
//       } else {
//         setError(response.data?.message || "Reset failed.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#f1f5f9]">
//       {/* Sidebar */}
//   <div className="w-64">
//     <EmployeeSidebar />
//   </div>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center px-4">
//         <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden">
//           {/* Left side with image */}
//           <div className="md:w-1/2 bg-[#f9fafb] flex items-center justify-center p-8">
//             <img
//               src={Illustration}
//               alt="Forgot Password Illustration"
//               className="w-72 h-auto object-contain"
//             />
//           </div>

//           {/* Right side form */}
//           <div className="md:w-1/2 p-8 md:p-12">
//             <h2 className="text-3xl font-bold text-[#f1d245] mb-3">
//               {step === 1 ? "Change Password" : "Reset Password"}
//             </h2>
//             <p className="text-gray-600 mb-8">
//               {step === 1
//                 ? "Enter the email address associated with your account."
//                 : "Enter the OTP sent to your email and set a new password."}
//             </p>

//             {step === 1 ? (
//               <form onSubmit={handleEmailSubmit} className="space-y-6">
//                 <input
//                   type="email"
//                   placeholder="Enter Email Address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full border-0 border-b-2 border-gray-300 focus:border-[#f1d245] focus:outline-none text-gray-700 placeholder-gray-400 py-2"
//                 />
//                 <div className="flex items-center justify-between">
//                   <a
//                     href="#"
//                     className="text-sm text-[#f1d245] hover:underline font-medium"
//                   >
//                     Try another way
//                   </a>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`px-6 py-2 bg-[#f1d245] text-white rounded-full shadow-md hover:bg-[#e6c822] transition font-semibold ${
//                       loading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {loading ? "Sending..." : "Next"}
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <form onSubmit={handleResetPassword} className="space-y-6">
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                   className="w-full border-0 border-b-2 border-gray-300 focus:border-[#f1d245] focus:outline-none text-gray-700 placeholder-gray-400 py-2"
//                 />
//                 <input
//                   type="password"
//                   placeholder="Enter New Password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                   className="w-full border-0 border-b-2 border-gray-300 focus:border-[#f1d245] focus:outline-none text-gray-700 placeholder-gray-400 py-2"
//                 />
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full py-2 bg-[#f1d245] text-white rounded-full shadow-md hover:bg-[#e6c822] transition font-semibold ${
//                     loading ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   {loading ? "Resetting..." : "Reset Password"}
//                 </button>
//               </form>
//             )}

//             {/* Messages */}
//             {message && (
//               <p className="text-green-600 mt-4 font-medium">{message}</p>
//             )}
//             {error && (
//               <p className="text-red-600 mt-4 font-medium">{error}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideForgotPassword;
import React, { useState } from "react";
import axios from "axios";
import Illustration from "../../assets/right.png";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";
import { 
  FaEnvelope, 
  FaLock, 
  FaKey, 
  FaArrowRight, 
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaShieldAlt,
  FaUserShield
} from "react-icons/fa";

const SideForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("employee_token");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend.hrms.transev.site/employee/request-password-reset",
        { assignedEmail: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.status === "success") {
        setMessage("OTP sent successfully to your email");
        setStep(2);
      } else {
        setError(response.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await axios.patch(
        "https://backend.hrms.transev.site/employee/reset-password",
        { assignedEmail: email, otp, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.status === "success") {
        setMessage("✅ Password changed successfully");
        setTimeout(() => {
          setOtp("");
          setNewPassword("");
          setEmail("");
          setStep(1);
        }, 2000);
      } else {
        setError(response.data?.message || "Reset failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="w-64">
        <EmployeeSidebar />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-5xl w-full">
          {/* Premium Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Illustration with Premium Design */}
              <div className="md:w-1/2 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <FaUserShield className="text-white text-3xl" />
                    </div>
                  </div>
                  <img
                    src={Illustration}
                    alt="Password Reset"
                    className="w-64 h-auto object-contain mx-auto mb-6"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {step === 1 ? "Forgot Password?" : "Reset Your Password"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {step === 1
                      ? "Don't worry, we'll help you recover your account"
                      : "Create a strong password to secure your account"}
                  </p>
                </div>

                {/* Step Indicator */}
                <div className="relative z-10 mt-8 flex gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-amber-500' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-amber-500' : 'bg-gray-300'}`}></div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="md:w-1/2 p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {step === 1 ? "Change Password" : "Set New Password"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {step === 1
                      ? "Enter your registered email to receive OTP"
                      : "Enter OTP and create a new password"}
                  </p>
                </div>

                {step === 1 ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="relative group">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                        <FaEnvelope className="text-lg" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-8 pr-4 py-3 border-0 border-b-2 border-gray-200 focus:border-amber-400 focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <FaArrowLeft size={14} />
                        <span className="text-sm font-medium">Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`
                          flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200
                          ${loading 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg hover:-translate-y-0.5'
                          }
                        `}
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin text-white" />
                            <span className="text-white">Sending...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-white">Send OTP</span>
                            <FaArrowRight className="text-white" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="relative group">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                        <FaKey className="text-lg" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full pl-8 pr-4 py-3 border-0 border-b-2 border-gray-200 focus:border-amber-400 focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                        <FaLock className="text-lg" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full pl-8 pr-12 py-3 border-0 border-b-2 border-gray-200 focus:border-amber-400 focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !otp || !newPassword}
                        className={`
                          flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200
                          ${loading || !otp || !newPassword
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg hover:-translate-y-0.5'
                          }
                        `}
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin text-white" />
                            <span className="text-white">Resetting...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-white">Reset Password</span>
                            <FaArrowRight className="text-white" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Messages */}
                {message && (
                  <div className="mt-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500 text-sm" />
                      <p className="text-emerald-700 text-sm font-medium">{message}</p>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="mt-6 p-3 bg-rose-50 border border-rose-200 rounded-xl animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
                        <span className="text-white text-[10px]">!</span>
                      </div>
                      <p className="text-rose-700 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <FaShieldAlt className="text-gray-400 text-xs" />
                    <p className="text-gray-400 text-[10px] text-center">
                      Your password is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SideForgotPassword;