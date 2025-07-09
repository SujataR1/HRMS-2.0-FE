import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";
import QRCode from "react-qr-code";
import logo from "../../assets/TransmogriffyLogo.png"; // Adjust path if needed

const HrProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("hr_token");

      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://192.168.0.100:9000/hr/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch profile");
        }

        setProfile(result.data);
        setError("");
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-yellow-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-yellow-300 bg-yellow-100">
        <HRSidebar />
      </aside>

      {/* Main Card */}
      <main className="flex-1 flex justify-center items-center p-10">
        {loading ? (
          <p className="text-yellow-600 text-lg">Loading profile...</p>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold">{error}</p>
        ) : (
          <div className="w-80 bg-white rounded-xl shadow-md border border-gray-300 p-6 text-center">
            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={logo}
                alt="Company Logo"
                className="w-20 h-auto mb-1" // smaller logo
              />
              <h1 className="text-lg font-bold">
                <span className="text-yellow-500">TRANS</span>
                <span className="text-gray-800">MOGRIFY</span>
              </h1>
            </div>

            {/* Profile Photo */}
            <img
              src={profile.profileImage || "/assets/default-profile.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full mx-auto border-4 border-yellow-300 object-cover"
            />

            {/* Name */}
            <h2 className="text-xl font-bold text-blue-700 mt-4">{profile.name}</h2>

            {/* Details */}
            <div className="text-gray-700 text-sm mt-3 space-y-1">
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Email Verified:</strong> {profile.isEmailVerified ? "Yes ✅" : "No ❌"}</p>
              <p><strong>Emp. ID No.:</strong> {profile.employeeId}</p>
            </div>

            {/* QR Code */}
            <div className="mt-6 flex justify-center">
              <QRCode
                value={JSON.stringify({
                  name: profile.name,
                  email: profile.email,
                  isEmailVerified: profile.isEmailVerified,
                  employeeId: profile.employeeId,
                })}
                size={100}
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HrProfile;
