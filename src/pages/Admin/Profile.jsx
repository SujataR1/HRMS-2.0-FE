import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import logo from "../../assets/TransmogriffyLogo.png";
import AdminSidebar from "../../components/Common/AdminSidebar";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    (async () => {
      if (!token) return setLoading(false), setStatusMsg({ text: "Not authorized", type: "error" });
      const r = await fetch("https://backend.hrms.transev.site/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      r.ok
        ? (setProfile(data.data), setForm({ name: data.data.name, email: data.data.email }))
        : setStatusMsg({ text: data.message, type: "error" });
      setLoading(false);
    })();
  }, []);

  const handleUpdate = async () => {
    setStatusMsg({ text: "", type: "" });
    const r = await fetch("https://backend.hrms.transev.site/admin/update-profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await r.json();
    if (r.ok) {
      const emailChanged = form.email !== profile.email;

      setProfile({ ...profile, ...form, isEmailVerified: emailChanged ? false : profile.isEmailVerified });
      setEditable(false);
      setStatusMsg({ text: "Profile updated", type: "success" });

      // show OTP step only if email changed
      if (emailChanged) {
        // optional: call backend to "send" otp
        setShowOTP(true);
      }
    } else {
      setStatusMsg({ text: data.message, type: "error" });
    }
  };

  const handleOtpSubmit = () => {
    // Mock OTP check
    if (otp === "123456") {
      setShowOTP(false);
      setStatusMsg({ text: "✅ Email verified!", type: "success" });
      setProfile({ ...profile, isEmailVerified: true });
    } else {
      setStatusMsg({ text: "Invalid OTP. Try 123456 for testing.", type: "error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 border-r border-gray-300 bg-white">
        <AdminSidebar />
      </aside>

      <main className="flex-1 flex justify-center p-10">
        {loading ? (
          <div className="text-gray-600 animate-pulse">Loading...</div>
        ) : (
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <img src={logo} alt="Logo" className="w-24 mb-2" />
              <h1 className="text-2xl font-bold">
                <span className="text-yellow-500">TRANS</span>
                <span className="text-gray-700">MOGRIFY</span>
              </h1>
            </div>

            {/* Profile Avatar */}
            <div className="flex justify-center mt-6">
              <img
                src="/assets/default-profile.png"
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-yellow-300 shadow-md"
              />
            </div>

            {/* Form Section */}
            <div className="mt-6">
              {editable ? (
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />

                  <div className="flex space-x-4 justify-center">
                    <button
                      onClick={handleUpdate}
                      className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditable(false);
                        setForm({ name: profile.name, email: profile.email });
                      }}
                      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <h2 className="text-xl font-semibold">{profile.name}</h2>

                  <div className="flex justify-center items-center space-x-2">
                    <span className="font-medium">{profile.email}</span>
                    {profile.isEmailVerified ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">✅ Verified</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">❌ Not Verified</span>
                    )}
                  </div>

                  <div className="text-gray-500 text-sm">Last Updated: {profile.updatedAt}</div>

                  <button
                    onClick={() => setEditable(true)}
                    className="mt-4 bg-yellow-500 px-6 py-2 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
              )}
            </div>

            {statusMsg.text && (
              <div
                className={`mt-4 text-sm text-center ${statusMsg.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
              >
                {statusMsg.text}
              </div>
            )}

            {showOTP && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
                <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl relative">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">📨 Email Verification</h2>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    We've sent a 6-digit OTP to <strong>{form.email}</strong>. Please enter it below to verify your email address.
                  </p>

                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-center tracking-widest text-lg mb-4"
                    placeholder="Enter OTP"
                  />

                  {statusMsg.text && (
                    <div
                      className={`text-sm mb-3 text-center ${statusMsg.type === "success" ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {statusMsg.text}
                    </div>
                  )}

                  <div className="flex justify-center gap-4 mt-2">
                    <button
                      onClick={handleOtpSubmit}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                      ✅ Verify OTP
                    </button>
                    <button
                      onClick={() => setShowOTP(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm transition"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* QR Code */}
            <div className="mt-6 flex justify-center">
              <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <QRCode
                  value={JSON.stringify({
                    name: profile.name,
                    email: profile.email,
                    isEmailVerified: profile.isEmailVerified,
                  })}
                  size={120}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProfile;
