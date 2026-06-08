import React, { useState } from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";
import { FaCalendarAlt, FaEye, FaClock, FaFingerprint, FaQrcode, FaSignInAlt, FaSignOutAlt, FaCoffee, FaPen, FaUser, FaRegCalendarAlt } from "react-icons/fa";
import { FiTrendingUp, FiActivity } from "react-icons/fi";

const EmployeePunchDetails = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [punchData, setPunchData] = useState(null);
  const [loadingPunches, setLoadingPunches] = useState(false);
  const [error, setError] = useState("");

  const fetchPunches = async () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    setError("");
    setLoadingPunches(true);
    setPunchData(null);

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/attendance/day-punches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("employee_token")}`,
        },
        body: JSON.stringify({
          date: selectedDate,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch punch data");

      setPunchData(json.data);
      setLoadingPunches(false);
    } catch (err) {
      setError(err.message);
      setLoadingPunches(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time;
  };

  const getStatusStyle = (status) => {
    const styles = {
      present: { color: "text-emerald-600", bg: "bg-emerald-50", icon: FiActivity, label: "Present" },
      absent: { color: "text-rose-600", bg: "bg-rose-50", icon: FiActivity, label: "Absent" },
      halfDay: { color: "text-amber-600", bg: "bg-amber-50", icon: FiActivity, label: "Half Day" },
      weeklyOff: { color: "text-slate-600", bg: "bg-slate-100", icon: FiActivity, label: "Weekly Off" },
      holiday: { color: "text-purple-600", bg: "bg-purple-50", icon: FiActivity, label: "Holiday" },
    };
    const config = styles[status] || { color: "text-gray-600", bg: "bg-gray-100", icon: FiActivity, label: status || "-" };
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg}`}>
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
      </div>
    );
  };

  const getPunchStateConfig = (state) => {
    const configs = {
      checkIn: { icon: FaSignInAlt, label: "Check In", color: "text-emerald-600", bg: "bg-emerald-50" },
      checkOut: { icon: FaSignOutAlt, label: "Check Out", color: "text-rose-600", bg: "bg-rose-50" },
      breakStart: { icon: FaCoffee, label: "Break Start", color: "text-amber-600", bg: "bg-amber-50" },
      breakEnd: { icon: FaCoffee, label: "Break End", color: "text-blue-600", bg: "bg-blue-50" },
    };
    return configs[state] || { icon: FaClock, label: state, color: "text-gray-600", bg: "bg-gray-50" };
  };

  const getIdentifierConfig = (identifier) => {
    const configs = {
      fingerprint: { icon: FaFingerprint, label: "Fingerprint", bg: "bg-purple-50", text: "text-purple-600" },
      manual: { icon: FaPen, label: "Manual", bg: "bg-orange-50", text: "text-orange-600" },
      qr: { icon: FaQrcode, label: "QR Code", bg: "bg-blue-50", text: "text-blue-600" },
      face: { icon: FaUser, label: "Face Recognition", bg: "bg-indigo-50", text: "text-indigo-600" },
    };
    return configs[identifier] || { icon: FaClock, label: identifier || "-", bg: "bg-gray-50", text: "text-gray-600" };
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <EmployeeSidebar />
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Sleek Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance Overview</span>
            </div>
            <h1 className="text-3xl font-light text-slate-800 tracking-tight mb-1">
              Punch Details
            </h1>
            <p className="text-sm text-slate-400 font-light">
              View your daily attendance and punch records
            </p>
          </div>

          {/* Sleek Search Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-8 transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                  Select Date
                </label>
                <div className="relative group">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all duration-200 bg-white"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </div>
              </div>
              <button
                onClick={fetchPunches}
                disabled={loadingPunches}
                className="w-full lg:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                {loadingPunches ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <FaEye className="w-4 h-4" />
                    View Records
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          {loadingPunches && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16">
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 mt-4">Fetching your records...</p>
              </div>
            </div>
          )}

          {!loadingPunches && error && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          {!loadingPunches && punchData && (
            <div className="space-y-6">
              {/* Sleek Employee Info Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">Employee ID</p>
                      <p className="text-base font-medium text-slate-800">{punchData.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">Date</p>
                      <p className="text-base font-medium text-slate-800">{punchData.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">Day</p>
                      <p className="text-base font-medium text-slate-800">{punchData.day}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">Status</p>
                      {getStatusStyle(punchData.attendance?.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sleek Attendance Summary Cards */}
              {punchData.attendance && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Punch In</p>
                        <p className="text-2xl font-light text-slate-800">
                          {formatTime(punchData.attendance.punchIn) || "-"}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <FaSignInAlt className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Punch Out</p>
                        <p className="text-2xl font-light text-slate-800">
                          {formatTime(punchData.attendance.punchOut) || "-"}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                        <FaSignOutAlt className="w-4 h-4 text-rose-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {punchData.attendance?.comments && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-1">Comments</p>
                  <p className="text-sm text-slate-600 italic">{punchData.attendance.comments}</p>
                </div>
              )}

              {/* Sleek Timeline Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-700">Punch Timeline</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Chronological order of all punches</p>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
                      {punchData.punches?.length || 0} records
                    </div>
                  </div>
                </div>
                
                {punchData.punches && punchData.punches.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {punchData.punches.map((punch, index) => {
                      const stateConfig = getPunchStateConfig(punch.punchState);
                      const StateIcon = stateConfig.icon;
                      const identifierConfig = getIdentifierConfig(punch.identifier);
                      const IdentifierIcon = identifierConfig.icon;
                      
                      return (
                        <div key={punch.id || index} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-[140px]">
                              <span className="text-xs text-slate-400 w-6">{index + 1}</span>
                              <span className="font-mono text-sm font-medium text-slate-700">
                                {formatTime(punch.time)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-md ${stateConfig.bg}`}>
                                <StateIcon className={`w-3.5 h-3.5 ${stateConfig.color}`} />
                              </div>
                              <span className="text-sm text-slate-700 capitalize">
                                {stateConfig.label}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-md ${identifierConfig.bg}`}>
                                <IdentifierIcon className={`w-3.5 h-3.5 ${identifierConfig.text}`} />
                              </div>
                              <span className={`text-xs ${identifierConfig.text}`}>
                                {identifierConfig.label}
                              </span>
                            </div>
                            
                            <div className="text-xs text-slate-400 font-mono">
                              {new Date(punch.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <FaClock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No punches recorded for this date</p>
                  </div>
                )}
              </div>

              {/* Sleek Info Note */}
              {!punchData.attendance && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs text-amber-700 text-center">
                    Attendance record not generated for this date. Raw punches shown above.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sleek Empty State - Only show when not loading, no error, and no data */}
          {!loadingPunches && !error && !punchData && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRegCalendarAlt className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-medium text-slate-700 mb-1">No records loaded</h3>
              <p className="text-sm text-slate-400">Select a date and click "View Records" to see your punch details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeePunchDetails;