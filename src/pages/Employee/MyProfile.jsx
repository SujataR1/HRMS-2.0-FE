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
        const response = await fetch("https://backend.hrms.transev.site/employee/profile", {
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
              <div className="space-y-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <InfoRow
                  label={
                    <span className="flex items-center gap-2">
                      <BriefcaseIcon className="w-5 h-5 text-gray-500" />
                      Employment Type
                    </span>
                  }
                  value={profile.employmentType}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2">
                      <CheckBadgeIcon className="w-5 h-5 text-green-600" />
                      Employment Status
                    </span>
                  }
                  value={
                    <span
                      className={`px-2 py-0.5 rounded-md text-sm font-medium ${profile.employmentStatus === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {profile.employmentStatus}
                    </span>
                  }
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-blue-500" />
                      Date of Joining
                    </span>
                  }
                  value={formatDate(profile.dateOfJoining)}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                      Confirmation Date
                    </span>
                  }
                  value={formatDate(profile.confirmationDate)}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
                      Designation
                    </span>
                  }
                  value={profile.designation}
                />
                <InfoRow
                  label={
                    <span className="flex items-center gap-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
                      Department
                    </span>
                  }
                  value={profile.department}
                />
              </div>
            </ProfileSection>

            <ProfileSection title="Assigned Shift Details" fullWidth>
              {profile.assignedShift ? (
                <div className="space-y-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
                  {/* Shift Name */}
                  <div className="flex items-center gap-2 border-b pb-2 border-yellow-300">
                    <ClockIcon className="w-6 h-6 text-yellow-700" />
                    <h4 className="text-2xl font-bold text-yellow-800">
                      {profile.assignedShift.shiftName}
                    </h4>
                  </div>

                  {/* Shift Timings */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-800 text-sm">
                    <div className="flex items-start gap-2">
                      <ArrowRightCircleIcon className="w-5 h-5 text-gray-500 mt-1" />
                      <span>
                        <span className="font-semibold">Shift Start:</span>{" "}
                        {profile.assignedShift.fullShiftStartingTime || "-"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRightCircleIcon className="w-5 h-5 text-gray-500 mt-1" />
                      <span>
                        <span className="font-semibold">Shift End:</span>{" "}
                        {profile.assignedShift.fullShiftEndingTime || "-"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ClockIcon className="w-5 h-5 text-gray-500 mt-1" />
                      <span>
                        <span className="font-semibold">Duration:</span>{" "}
                        {profile.assignedShift.fullShiftDuration || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Weekly Days Off */}
                  <div className="text-gray-700 text-sm flex items-start gap-2">
                    <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                    <span>
                      <span className="font-semibold">Weekly Days Off:</span>{" "}
                      {profile.assignedShift.weeklyDaysOff.length > 0
                        ? profile.assignedShift.weeklyDaysOff.join(", ")
                        : "None"}
                    </span>
                  </div>

                  {/* Punch In / Out Times */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
                    <div>
                      <h5 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                        <ArrowRightCircleIcon className="w-5 h-5 text-yellow-600" />
                        Punch In Rules
                      </h5>
                      <ul className="space-y-1 list-disc list-inside text-gray-700">
                        <li><strong>Earliest:</strong> {profile.assignedShift.computed.punchInEarliest || "-"}</li>
                        <li><strong>Grace Until:</strong> {profile.assignedShift.computed.punchInGraceUntil || "-"}</li>
                        <li><strong>Absent After:</strong> {profile.assignedShift.computed.punchInAbsentAfter || "-"}</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                        <ArrowRightCircleIcon className="w-5 h-5 text-yellow-600" />
                        Punch Out Rules
                      </h5>
                      <ul className="space-y-1 list-disc list-inside text-gray-700">
                        <li><strong>Earliest Without Penalty:</strong> {profile.assignedShift.computed.punchOutEarliestWithoutPenalty || "-"}</li>
                        <li><strong>Latest With Buffer:</strong> {profile.assignedShift.computed.punchOutMaxLatestWithBuffer || "-"}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Grace & Overtime */}
                  <div className="bg-white rounded-md p-4 shadow-inner border border-yellow-100 text-sm space-y-2 text-gray-700">
                    <p><ExclamationCircleIcon className="w-4 h-4 inline text-yellow-600 mr-1" /> <strong>Grace In:</strong> {profile.assignedShift.fullShiftGraceInTimingInMinutes} minutes</p>
                    <p><ExclamationCircleIcon className="w-4 h-4 inline text-yellow-600 mr-1" /> <strong>Grace Out:</strong> {profile.assignedShift.fullShiftGraceOutTimingInMinutes} minutes</p>
                    <p><ExclamationCircleIcon className="w-4 h-4 inline text-yellow-600 mr-1" /> <strong>Max Overtime:</strong> {profile.assignedShift.overtimeMaximumAllowableLimitInMinutes} minutes</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-gray-500">No assigned shift details available.</p>
              )}
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
