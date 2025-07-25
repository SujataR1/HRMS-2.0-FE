import React, { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";
import {
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const Tooltip = ({ message }) => (
  <div className="absolute z-20 bg-white border border-yellow-400 text-yellow-800 rounded-md p-2 text-xs shadow-lg w-64">
    {message}
  </div>
);

const InfoIconWithTooltip = ({ message }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-block ml-1 cursor-pointer"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      aria-label="More info"
    >
      <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400 hover:text-yellow-600 transition" />
      {show && <Tooltip message={message} />}
    </div>
  );
};

const EmployeeShiftDetails = () => {
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
        const response = await fetch(
          "https://backend.hrms.transev.site/employee/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch profile");
        }
        setProfile(result.data);
        setError("");
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen bg-yellow-50 font-sans">
        <aside className="w-64 bg-white border-r border-yellow-200 shadow-md">
          <EmployeeSidebar />
        </aside>
        <main className="flex-1 flex items-center justify-center p-10 text-yellow-600 font-bold text-xl animate-pulse">
          Loading shift details...
        </main>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen bg-yellow-50 font-sans">
        <aside className="w-64 bg-white border-r border-yellow-200 shadow-md">
          <EmployeeSidebar />
        </aside>
        <main className="flex-1 flex items-center justify-center p-10 text-red-600 font-bold text-xl">
          <ExclamationCircleIcon className="w-8 h-8 inline mr-2" />
          {error}
        </main>
      </div>
    );

  const shift = profile?.assignedShift;

  if (!shift)
    return (
      <div className="flex min-h-screen bg-yellow-50 font-sans">
        <aside className="w-64 bg-white border-r border-yellow-200 shadow-md">
          <EmployeeSidebar />
        </aside>
        <main className="flex-1 flex items-center justify-center p-10 text-yellow-700 font-semibold text-xl italic">
          No assigned shift details available.
        </main>
      </div>
    );

  // Improved InfoCard with optional truncate
  const InfoCard = ({ label, value, tooltip, noTruncate = false }) => (
    <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out relative w-full">
      <dt className="text-sm text-gray-600 font-medium flex items-center mb-1">
        {label}
        {tooltip && <InfoIconWithTooltip message={tooltip} />}
      </dt>
      <dd
        className={`text-lg font-semibold text-yellow-700 ${
          noTruncate ? "" : "truncate"
        }`}
      >
        {value || "-"}
      </dd>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-yellow-50 font-sans">
      <aside className="w-64 bg-white border-r border-yellow-200 shadow-md">
        <EmployeeSidebar />
      </aside>

      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-yellow-900 mb-10 border-b border-yellow-300 pb-3">
          My Shift Details
        </h1>

        {/* Shift Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <InfoCard
            label="Shift Name"
            value={shift.shiftName}
            tooltip="The official name of your assigned shift"
          />
          <InfoCard
            label="Shift Time"
            value={`${shift.fullShiftStartingTime || "-"} - ${
              shift.fullShiftEndingTime || "-"
            }`}
            tooltip="Your shift start and end time"
          />
          <InfoCard
            label="Weekly Days Off"
            value={
              shift.weeklyDaysOff?.length
                ? shift.weeklyDaysOff.join(", ")
                : "None"
            }
            tooltip="Days you have off every week"
          />
          <InfoCard
            label="Shift ID"
            value={shift.id || "N/A"}
            tooltip="Unique identifier of your shift"
            noTruncate
          />
        </div>

        {/* Punch Rules */}
       {shift.computed && (
  <>
    <h2 className="text-3xl font-bold text-yellow-900 mt-14 mb-6 border-b border-yellow-300 pb-2">
      Punch Rules & Grace Periods
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Full shift punch-in/out */}
      <InfoCard
        label="Punch In Earliest"
        value={shift.computed.punchInEarliest}
        tooltip="Earliest time you can punch in"
      />
      <InfoCard
        label="Punch In Grace Until"
        value={shift.computed.punchInGraceUntil}
        tooltip="Grace period allowed for punch in without penalty"
      />
      <InfoCard
        label="Punch In Absent After"
        value={shift.computed.punchInAbsentAfter}
        tooltip="After this time you will be marked absent"
      />
      <InfoCard
        label="Punch Out Earliest Without Penalty"
        value={shift.computed.punchOutEarliestWithoutPenalty}
        tooltip="Earliest punch out time without penalty"
      />
      <InfoCard
        label="Punch Out Latest With Buffer"
        value={shift.computed.punchOutMaxLatestWithBuffer}
        tooltip="Latest punch out time including buffer period"
      />

      {/* Grace & Overtime */}
      <InfoCard
        label="Grace In (minutes)"
        value={shift.fullShiftGraceInTimingInMinutes}
        tooltip="Allowed grace period for clocking in"
      />
      <InfoCard
        label="Grace Out (minutes)"
        value={shift.fullShiftGraceOutTimingInMinutes}
        tooltip="Allowed grace period for clocking out"
      />
      <InfoCard
        label="Max Overtime (minutes)"
        value={shift.overtimeMaximumAllowableLimitInMinutes}
        tooltip="Maximum allowed overtime per shift"
      />

      {/* Half-shift values (optional) */}
      <InfoCard
        label="Half Shift Start"
        value={shift.halfShiftStartingTime || "Not applicable"}
        tooltip="Start time for half shift (if applicable)"
      />
      <InfoCard
        label="Half Shift End"
        value={shift.halfShiftEndingTime || "Not applicable"}
        tooltip="End time for half shift (if applicable)"
      />
      <InfoCard
        label="Half Shift Grace In"
        value={
          shift.halfShiftGraceInTimingInMinutes != null
            ? `${shift.halfShiftGraceInTimingInMinutes} mins`
            : "Not applicable"
        }
        tooltip="Grace period for half-shift clock-in"
      />
      <InfoCard
        label="Half Shift Grace Out"
        value={
          shift.halfShiftGraceOutTimingInMinutes != null
            ? `${shift.halfShiftGraceOutTimingInMinutes} mins`
            : "Not applicable"
        }
        tooltip="Grace period for half-shift clock-out"
      />
    </div>
  </>
)}
      </main>
    </div>
  );
};

export default EmployeeShiftDetails;
