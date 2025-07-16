import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import logo from "../../assets/TransmogriffyLogo.png";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("employee_token");

      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://192.168.0.100:9000/employee/profile", {
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

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

  if (loading)
    return (
      <LoaderWithSidebar message="Loading profile..." />
    );

  if (error)
    return (
      <LoaderWithSidebar error message={error} />
    );

  return (
    <div className="flex min-h-screen bg-yellow-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-yellow-300 bg-yellow-100 shadow-md sticky top-0 h-screen">
        <EmployeeSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-12 flex justify-center">
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-gray-300 p-14">
          {/* Header */}
          <div className="flex flex-col items-center mb-12 select-none">
            <img src={logo} alt="Company Logo" className="w-28 mb-3" />
            <h1 className="text-5xl font-extrabold tracking-tight">
              <span className="text-yellow-500">TRANS</span>
              <span className="text-gray-900">MOGRIFY</span>
            </h1>
          </div>

          {/* Profile Top */}
          <div className="flex flex-col items-center mb-14">
            <div className="relative rounded-full p-1 bg-yellow-400 shadow-lg">
              <img
                src={profile.profileImage || "/assets/default-profile.png"}
                alt="Profile"
                className="w-44 h-44 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            <h2 className="mt-7 text-5xl font-semibold text-blue-800">{profile.name}</h2>
            <p className="mt-1 text-gray-600 italic tracking-wide">Employee</p>
          </div>

          {/* Profile Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 text-gray-800 text-base">
            <ProfileSection title="Identification">
              <InfoRow label="Employee ID" value={profile.employeeId} />
              <InfoRow label="Assigned Email" value={profile.assignedEmail} />
              <InfoRow label="Personal Email" value={profile.personalEmail} />
              <InfoRow label="Email Verified" value={profile.isPersonalEmailVerified ? "Yes ✅" : "No ❌"} />
            </ProfileSection>

            <ProfileSection title="Employment Details">
              <InfoRow label="Employment Type" value={profile.employmentType} />
              <InfoRow label="Employment Status" value={profile.employmentStatus} />
              <InfoRow label="Date of Joining" value={formatDate(profile.dateOfJoining)} />
              <InfoRow label="Confirmation Date" value={formatDate(profile.confirmationDate)} />
              <InfoRow label="Designation" value={profile.designation} />
              <InfoRow label="Department" value={profile.department} />
              <InfoRow label="Assigned Shift ID" value={profile.assignedShiftId} />
            </ProfileSection>

            <ProfileSection title="Contact Information">
              <InfoRow label="Phone Number" value={profile.phoneNumber} />
              <InfoRow label="Emergency Contact" value={profile.emergencyContactNumber} />
              <InfoRow label="Present Address" value={profile.presentAddress} />
              <InfoRow label="Permanent Address" value={profile.permanentAddress} />
            </ProfileSection>

            <ProfileSection title="Personal Details">
              <InfoRow label="Aadhaar Number" value={profile.aadhaarCardNumber} />
              <InfoRow label="PAN Number" value={profile.panCardNumber} />
              <InfoRow label="Blood Group" value={profile.bloodGroup} />
              <InfoRow label="Medical Notes" value={profile.medicalNotes} />
              <InfoRow label="Highest Qualification" value={profile.highestEducationalQualification} />
            </ProfileSection>

            <ProfileSection title="Banking Details" fullWidth>
              <InfoRow label="Bank Name" value={profile.bankName} />
              <InfoRow label="Bank Account Number" value={profile.bankAccountNumber} />
              <InfoRow label="IFSC Code" value={profile.ifsCode} />
            </ProfileSection>
          </div>

          {/* QR Code Card */}
          <div className="mt-20 flex justify-center">
            <div className="p-8 bg-yellow-50 border border-yellow-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <QRCode
                value={JSON.stringify({
                  employeeId: profile.employeeId,
                  name: profile.name,
                  assignedEmail: profile.assignedEmail,
                  personalEmail: profile.personalEmail,
                  isPersonalEmailVerified: profile.isPersonalEmailVerified,
                })}
                size={160}
                bgColor="#fff"
                fgColor="#000"
                level="Q"
              />
              <p className="mt-3 text-center text-sm text-gray-600 select-none">Scan QR for quick info</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const LoaderWithSidebar = ({ message = "", error = false }) => (
  <div className="flex min-h-screen bg-yellow-50 font-sans">
    <aside className="w-64 border-r border-yellow-300 bg-yellow-100 shadow-md sticky top-0 h-screen">
      <EmployeeSidebar />
    </aside>
    <main className="flex-1 flex items-center justify-center p-10">
      <p className={`${error ? "text-red-600" : "text-yellow-600"} text-lg font-semibold animate-pulse`}>
        {message}
      </p>
    </main>
  </div>
);

const ProfileSection = ({ title, children, fullWidth }) => (
  <section className={`${fullWidth ? "md:col-span-2" : ""}`}>
    <h3 className="text-2xl font-semibold mb-6 rounded-lg bg-yellow-100 px-4 py-2 border border-yellow-300 shadow-sm select-none">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </section>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center px-4 py-3 rounded-md bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition cursor-default select-text">
    <span className="font-semibold text-yellow-700 uppercase text-xs tracking-wide">{label}</span>
    <span className="text-gray-900 font-medium max-w-[65%] text-right break-words">{value || "-"}</span>
  </div>
);

export default MyProfile;
