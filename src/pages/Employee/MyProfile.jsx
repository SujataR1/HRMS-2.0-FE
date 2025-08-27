
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import logo from "../../assets/TransmogriffyLogo.png";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ArrowRightCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
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
        // Fetch profile data
        const profileResponse = await fetch("https://backend.hrms.transev.site/employee/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileResult = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileResult.message || "Failed to fetch profile");
        }

        setProfile(profileResult.data);
        setError("");

        // Fetch profile picture
        const picResponse = await fetch("https://backend.hrms.transev.site/employee/profile-picture", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const picResult = await picResponse.json();

        if (!picResponse.ok || picResult.status !== "success") {
          throw new Error("Failed to fetch profile picture");
        }

        // picResult.data is a base64 string with data URI prefix
        setProfilePic(picResult.data);
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
    return <LoaderWithSidebar message="Loading profile..." />;

  if (error)
    return <LoaderWithSidebar error message={error} />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-yellow-50 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-yellow-300 bg-yellow-100 shadow-md sticky top-0 z-10">
        <EmployeeSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-10 flex justify-center">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl border border-gray-300 p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <img src={logo} alt="Company Logo" className="w-20 sm:w-28 mb-2 sm:mb-3" />
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center">
              <span className="text-yellow-500">TRANS</span>
              <span className="text-gray-900">MOGRIFY</span>
            </h1>
          </div>

          {/* Profile Top */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative rounded-full p-1 bg-yellow-400 shadow-lg">
              <img
                src={profilePic || "/assets/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            <h2 className="mt-5 sm:mt-7 text-3xl sm:text-5xl font-semibold text-blue-800 text-center">
              {profile.name}
            </h2>
            <p className="mt-1 text-gray-600 italic tracking-wide">Employee</p>
          </div>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 text-gray-800 text-base">
            {/* Identification Section */}
            <ProfileSection title="Identification">
              <InfoRow label="Employee ID" value={profile.employeeId} />
              <InfoRow label="Assigned Email" value={profile.assignedEmail} />
              <InfoRow label="Personal Email" value={profile.personalEmail} />
              <InfoRow label="Email Verified" value={profile.isPersonalEmailVerified ? "Yes ✅" : "No ❌"} />
            </ProfileSection>

            {/* Employment Details Section */}
            <ProfileSection title="Employment Details">
              <div className="space-y-4 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <InfoRow
                  label={<span className="flex items-center gap-2"><BriefcaseIcon className="w-5 h-5 text-gray-500" />Employment Type</span>}
                  value={profile.employmentType}
                />
                <InfoRow
                  label={<span className="flex items-center gap-2"><CheckBadgeIcon className="w-5 h-5 text-green-600" />Employment Status</span>}
                  value={
                    <span className={`px-2 py-0.5 rounded-md text-sm font-medium ${profile.employmentStatus === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-700"
                      }`}>
                      {profile.employmentStatus}
                    </span>
                  }
                />
                <InfoRow
                  label={<span className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-500" />Date of Joining</span>}
                  value={formatDate(profile.dateOfJoining)}
                />
                <InfoRow
                  label={<span className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-blue-600" />Confirmation Date</span>}
                  value={formatDate(profile.confirmationDate)}
                />
                <InfoRow
                  label={<span className="flex items-center gap-2"><BuildingOfficeIcon className="w-5 h-5 text-gray-500" />Designation</span>}
                  value={profile.designation}
                />
                <InfoRow
                  label={<span className="flex items-center gap-2"><BuildingOfficeIcon className="w-5 h-5 text-gray-500" />Department</span>}
                  value={profile.department}
                />
              </div>
            </ProfileSection>

            {/* Assigned Shift Details Section */}
            <ProfileSection title="Assigned Shift Details" fullWidth>
              {profile.assignedShift ? (
                <div className="space-y-6 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 border-b pb-2 border-yellow-300">
                    <ClockIcon className="w-6 h-6 text-yellow-700" />
                    <h4 className="text-xl sm:text-2xl font-bold text-yellow-800">
                      {profile.assignedShift.shiftName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-800 text-sm">
                    <ShiftItem label="Shift Start" value={profile.assignedShift.fullShiftStartingTime} />
                    <ShiftItem label="Shift End" value={profile.assignedShift.fullShiftEndingTime} />
                    <ShiftItem label="Duration" value={profile.assignedShift.fullShiftDuration} />
                  </div>

                  <ShiftItem
                    label="Weekly Days Off"
                    icon={<XCircleIcon className="w-5 h-5 text-red-500" />}
                    value={
                      profile.assignedShift.weeklyDaysOff.length > 0
                        ? profile.assignedShift.weeklyDaysOff.join(", ")
                        : "None"
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
                    <PunchRules title="Punch In Rules" data={{
                      Earliest: profile.assignedShift.computed.punchInEarliest,
                      "Grace Until": profile.assignedShift.computed.punchInGraceUntil,
                      "Absent After": profile.assignedShift.computed.punchInAbsentAfter,
                    }} />

                    <PunchRules title="Punch Out Rules" data={{
                      "Earliest Without Penalty": profile.assignedShift.computed.punchOutEarliestWithoutPenalty,
                      "Latest With Buffer": profile.assignedShift.computed.punchOutMaxLatestWithBuffer,
                    }} />
                  </div>

                  <div className="bg-white rounded-md p-4 shadow-inner border border-yellow-100 text-sm space-y-2 text-gray-700">
                    <GraceRule label="Grace In" value={profile.assignedShift.fullShiftGraceInTimingInMinutes} />
                    <GraceRule label="Grace Out" value={profile.assignedShift.fullShiftGraceOutTimingInMinutes} />
                    <GraceRule label="Max Overtime" value={profile.assignedShift.overtimeMaximumAllowableLimitInMinutes} />
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-gray-500">No assigned shift details available.</p>
              )}
            </ProfileSection>

            {/* Contact Information Section */}
            <ProfileSection title="Contact Information">
              <InfoRow label="Phone Number" value={profile.phoneNumber} />
              <InfoRow label="Emergency Contact" value={profile.emergencyContactNumber} />
              <InfoRow label="Present Address" value={profile.presentAddress} />
              <InfoRow label="Permanent Address" value={profile.permanentAddress} />
            </ProfileSection>

            {/* Personal Details Section */}
            <ProfileSection title="Personal Details">
              <InfoRow label="Aadhaar Number" value={profile.aadhaarCardNumber} />
              <InfoRow label="PAN Number" value={profile.panCardNumber} />
              <InfoRow label="Blood Group" value={profile.bloodGroup} />
              <InfoRow label="Medical Notes" value={profile.medicalNotes} />
              <InfoRow label="Highest Qualification" value={profile.highestEducationalQualification} />
            </ProfileSection>

            {/* Banking Details Section */}
            <ProfileSection title="Banking Details" fullWidth>
              <InfoRow label="Bank Name" value={profile.bankName} />
              <InfoRow label="Bank Account Number" value={profile.bankAccountNumber} />
              <InfoRow label="IFSC Code" value={profile.ifsCode} />
            </ProfileSection>
          </div>

          {/* QR Code Card */}
          <div className="mt-16 flex justify-center">
            <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
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
              <p className="mt-3 text-center text-sm text-gray-600">Scan QR for quick info</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Loader
const LoaderWithSidebar = ({ message = "", error = false }) => (
  <div className="flex flex-col md:flex-row min-h-screen bg-yellow-50 font-sans">
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-yellow-300 bg-yellow-100 shadow-md sticky top-0 z-10">
      <EmployeeSidebar />
    </aside>
    <main className="flex-1 flex items-center justify-center p-10">
      <p className={`${error ? "text-red-600" : "text-yellow-600"} text-lg font-semibold animate-pulse`}>
        {message}
      </p>
    </main>
  </div>
);

// Section Wrapper
const ProfileSection = ({ title, children, fullWidth }) => (
  <section className={`${fullWidth ? "md:col-span-2" : ""}`}>
    <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 bg-yellow-100 px-4 py-2 border border-yellow-300 rounded-lg shadow-sm">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </section>
);

// Label & Value Row
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-4 py-3 rounded-md bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition text-sm sm:text-base">
    <span className="font-semibold text-yellow-700 uppercase text-xs tracking-wide mb-1 sm:mb-0">{label}</span>
    <span className="text-gray-900 font-medium sm:max-w-[65%] text-left sm:text-right break-words">{value || "-"}</span>
  </div>
);

// Shift Item
const ShiftItem = ({ label, value, icon }) => (
  <div className="flex items-start gap-2 text-sm">
    {icon || <ArrowRightCircleIcon className="w-5 h-5 text-gray-500 mt-1" />}
    <span><span className="font-semibold">{label}:</span> {value || "-"}</span>
  </div>
);

// Punch Rules
const PunchRules = ({ title, data }) => (
  <div className="bg-white border border-yellow-200 rounded-lg p-4 shadow-inner text-sm">
    <h4 className="font-semibold mb-2 text-yellow-700">{title}</h4>
    <ul className="space-y-1">
      {Object.entries(data).map(([key, val]) => (
        <li key={key} className="flex justify-between">
          <span>{key}</span>
          <span>{val || "-"}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Grace Rule
const GraceRule = ({ label, value }) => (
  <div className="flex justify-between border-b border-yellow-100 pb-1 last:border-0">
    <span>{label}:</span>
    <span>{value !== null && value !== undefined ? `${value} minutes` : "-"}</span>
  </div>
);

export default MyProfile;

