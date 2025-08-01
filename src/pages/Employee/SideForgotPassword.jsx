import React, { useState } from "react";
import axios from "axios";
import Illustration from "../../assets/right.png";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const SideForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("employee_token");

  // Step 1: Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend.hrms.transev.site/employee/request-password-reset",
        { assignedEmail: email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status === "success") {
        setMessage("OTP sent to your email.");
        setStep(2);
      } else {
        setError(response.data?.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await axios.patch(
        "https://backend.hrms.transev.site/employee/reset-password",
        {
          assignedEmail: email,
          otp,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status === "success") {
        setMessage("✅ Password reset successful.");
        setOtp("");
        setNewPassword("");
        setEmail("");
        // Stay on the page, no redirect
      } else {
        setError(response.data?.message || "Reset failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden">
          {/* Left side with image */}
          <div className="md:w-1/2 bg-[#f9fafb] flex items-center justify-center p-8">
            <img
              src={Illustration}
              alt="Forgot Password Illustration"
              className="w-72 h-auto object-contain"
            />
          </div>

          {/* Right side form */}
          <div className="md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-[#f1d245] mb-3">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>
            <p className="text-gray-600 mb-8">
              {step === 1
                ? "Enter the email address associated with your account."
                : "Enter the OTP sent to your email and set a new password."}
            </p>

            {step === 1 ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-0 border-b-2 border-gray-300 focus:border-[#f1d245] focus:outline-none text-gray-700 placeholder-gray-400 py-2"
                />
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-sm text-[#f1d245] hover:underline font-medium"
                  >
                    Try another way
                  </a>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 bg-[#f1d245] text-white rounded-full shadow-md hover:bg-[#e6c822] transition font-semibold ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Sending..." : "Next"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full border-0 border-b-2 border-gray-300 focus:border-[#f1d245] focus:outline-none text-gray-700 placeholder-gray-400 py-2"
                />
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border-0 border-b-2 border-gray-300 focus:border-[#f1d245] focus:outline-none text-gray-700 placeholder-gray-400 py-2"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 bg-[#f1d245] text-white rounded-full shadow-md hover:bg-[#e6c822] transition font-semibold ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Messages */}
            {message && (
              <p className="text-green-600 mt-4 font-medium">{message}</p>
            )}
            {error && (
              <p className="text-red-600 mt-4 font-medium">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideForgotPassword;
