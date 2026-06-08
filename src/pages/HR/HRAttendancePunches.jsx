import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const HRAttendancePunches = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [punchData, setPunchData] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingPunches, setLoadingPunches] = useState(false);
  const [error, setError] = useState("");

  // Fetch employees
  useEffect(() => {
    fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      },
    })
      .then((res) => res.json().then((d) => (res.ok ? d.data : Promise.reject(d.message))))
      .then(setEmployees)
      .catch((err) => setError(err))
      .finally(() => setLoadingEmployees(false));
  }, []);

  const fetchPunches = async () => {
    if (!selectedEmpId) {
      alert("⚠️ Please select an employee");
      return;
    }

    if (!selectedDate) {
      alert("⚠️ Please select a date");
      return;
    }

    setError("");
    setLoadingPunches(true);
    setPunchData(null);

    try {
      const res = await fetch("https://backend.hrms.transev.site/hr/attendance/day-punches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmpId,
          date: selectedDate,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch punch data");

      setPunchData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPunches(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      halfDay: "bg-yellow-100 text-yellow-800",
      weeklyOff: "bg-gray-100 text-gray-800",
      holiday: "bg-purple-100 text-purple-800",
    };
    const color = statusColors[status] || "bg-gray-100 text-gray-800";
    const label = status?.charAt(0).toUpperCase() + status?.slice(1) || "-";
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

  const getPunchStateIcon = (state) => {
    if (state === "checkIn") return "✅";
    if (state === "checkOut") return "❌";
    if (state === "breakStart") return "☕";
    if (state === "breakEnd") return "🔄";
    return "📍";
  };

  const getIdentifierBadge = (identifier) => {
    const identifiers = {
      fingerprint: "🖐️ Fingerprint",
      manual: "✏️ Manual",
      qr: "📱 QR Code",
      face: "😀 Face Recognition",
    };
    return identifiers[identifier] || identifier || "-";
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <HRSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="bg-white shadow-lg rounded-2xl border border-yellow-200 p-8 space-y-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-800 text-center">
            Employee Punch Details
          </h1>
          <p className="text-center text-yellow-600">
            View detailed punch-in/out records for any employee on a specific date
          </p>

          {loadingEmployees ? (
            <p className="text-yellow-600 animate-pulse text-center">Loading employees...</p>
          ) : error && !punchData ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <>
              {/* Search Form */}
              <div className="flex flex-wrap gap-4 items-end justify-center">
                {/* Employee Selection */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-yellow-900 font-semibold mb-1">
                    Select Employee
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                  >
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-yellow-900 font-semibold mb-1">Select Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </div>

                {/* Fetch Button */}
                <div>
                  <button
                    onClick={fetchPunches}
                    disabled={loadingPunches}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-all duration-300"
                  >
                    {loadingPunches ? "Loading..." : "View Punches"}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              {loadingPunches && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <p className="mt-2 text-yellow-600">Loading punch data...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              {punchData && !loadingPunches && (
                <div className="space-y-6">
                  {/* Employee Info Header */}
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Employee ID</p>
                        <p className="text-lg font-semibold text-yellow-900">{punchData.employeeId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Date</p>
                        <p className="text-lg font-semibold text-yellow-900">{punchData.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Day</p>
                        <p className="text-lg font-semibold text-yellow-900">{punchData.day}</p>
                      </div>
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Status</p>
                        <div className="mt-1">{getStatusBadge(punchData.attendance?.status)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Summary - Duration removed */}
                  {punchData.attendance && (
                    <div className="bg-white border border-yellow-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                        📊 Attendance Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <p className="text-sm text-yellow-600">Punch In</p>
                          <p className="text-xl font-bold text-yellow-900">
                            {formatTime(punchData.attendance.punchIn) || "-"}
                          </p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <p className="text-sm text-yellow-600">Punch Out</p>
                          <p className="text-xl font-bold text-yellow-900">
                            {formatTime(punchData.attendance.punchOut) || "-"}
                          </p>
                        </div>
                      </div>
                      {punchData.attendance.comments && (
                        <div className="mt-3 pt-3 border-t border-yellow-100">
                          <p className="text-sm text-yellow-600 font-medium">Comments:</p>
                          <p className="text-yellow-800">{punchData.attendance.comments}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Punches Timeline */}
                  <div className="bg-white border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      ⏰ Punch Timeline ({punchData.punches?.length || 0} punches)
                    </h3>
                    {punchData.punches && punchData.punches.length > 0 ? (
                      <div className="space-y-2">
                        {/* Timeline Header */}
                        <div className="grid grid-cols-12 gap-2 pb-2 border-b border-yellow-200 font-semibold text-yellow-700">
                          <div className="col-span-1">#</div>
                          <div className="col-span-3">Time</div>
                          <div className="col-span-3">Punch State</div>
                          <div className="col-span-3">Identifier</div>
                          <div className="col-span-2">Timestamp</div>
                        </div>
                        
                        {/* Timeline Items */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {punchData.punches.map((punch, index) => (
                            <div
                              key={punch.id || index}
                              className="grid grid-cols-12 gap-2 py-2 hover:bg-yellow-50 rounded-lg transition-colors"
                            >
                              <div className="col-span-1 text-yellow-600 font-medium">
                                {index + 1}
                              </div>
                              <div className="col-span-3 font-mono text-yellow-900">
                                {formatTime(punch.time)}
                              </div>
                              <div className="col-span-3">
                                <span className="flex items-center gap-1">
                                  {getPunchStateIcon(punch.punchState)}
                                  <span className="capitalize">
                                    {punch.punchState === "checkIn" ? "Check In" :
                                     punch.punchState === "checkOut" ? "Check Out" :
                                     punch.punchState === "breakStart" ? "Break Start" :
                                     punch.punchState === "breakEnd" ? "Break End" :
                                     punch.punchState}
                                  </span>
                                </span>
                              </div>
                              <div className="col-span-3 text-sm text-yellow-700">
                                {getIdentifierBadge(punch.identifier)}
                              </div>
                              <div className="col-span-2 text-xs text-yellow-500">
                                {new Date(punch.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-yellow-500">
                        <p>No punches recorded for this date</p>
                        <p className="text-sm mt-1">The employee may be absent or no attendance data available</p>
                      </div>
                    )}
                  </div>

                  {/* No Attendance Record Note */}
                  {!punchData.attendance && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-yellow-700">
                        ⚠️ Attendance record has not been generated for this date yet.
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        Raw punches are shown above. Run attendance generation to create the attendance record.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRAttendancePunches;