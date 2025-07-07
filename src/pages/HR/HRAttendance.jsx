import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const HRAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [editEntry, setEditEntry] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  // Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          "http://192.168.0.100:9000/admin/employee-profiles",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
        setEmployees(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch Attendance on Fetch button click
  const fetchAttendance = async () => {
    if (!selectedEmpId) {
      setError("Please select an employee");
      return;
    }
    setError("");
    setLoadingAttendance(true);
    setAttendanceData([]);
    try {
      const res = await fetch(
        "http://192.168.0.100:9000/hr/attendance/view",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
          body: JSON.stringify({
            employeeId: selectedEmpId,
            startDate,
            endDate,
          }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch attendance");
      setAttendanceData(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Handle Save after editing attendance
  const saveAttendance = async () => {
    if (!editEntry) return;
    setLoadingSave(true);
    setError("");
    try {
      const res = await fetch(
        "http://192.168.0.100:9000/hr/edit-attendance-entry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
          body: JSON.stringify({
            employeeId: selectedEmpId,
            attendanceDate: editEntry.date,
            punchIn: new Date(`${editEntry.date}T${editEntry.punchIn}`).toISOString(),
            punchOut: new Date(`${editEntry.date}T${editEntry.punchOut}`).toISOString(),
            status: editEntry.status,
            flags: ["manualEntry", "edited"],
            comments: editEntry.comments,
          }),
        }
      );
      const json = await res.json();
      if (!res.ok || json.status !== "success")
        throw new Error(json.message || "Failed to update attendance");

      // Update local state after save
      setAttendanceData((prev) =>
        prev.map((item) =>
          item.id === editEntry.id ? { ...editEntry } : item
        )
      );
      setEditEntry(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 font-sans">
      <HRSidebar />
      <main className="ml-64 flex-1 flex flex-col items-center p-6 md:p-10">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-yellow-200 p-8 space-y-8">
          <h1 className="text-4xl font-extrabold text-yellow-900 text-center tracking-wide drop-shadow-md">
            Attendance Check
          </h1>

          {loadingEmployees ? (
            <p className="text-yellow-600 font-semibold text-center animate-pulse">
              Loading employees...
            </p>
          ) : error ? (
            <p className="text-red-600 font-semibold text-center">{error}</p>
          ) : (
            <>
              {/* Employee Select */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <label
                    htmlFor="employee-select"
                    className="block text-yellow-900 font-semibold mb-2"
                  >
                    Select Employee
                  </label>
                  <select
                    id="employee-select"
                    className="w-full rounded-lg border border-yellow-300 px-4 py-3 shadow-sm focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300 transition"
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    aria-label="Select employee to view attendance"
                  >
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="flex space-x-4 flex-wrap sm:flex-nowrap">
                  <div>
                    <label
                      htmlFor="start-date"
                      className="block text-yellow-900 font-semibold mb-2"
                    >
                      From
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      className="rounded-lg border border-yellow-300 px-4 py-2 shadow-sm focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300"
                      max={endDate}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end-date"
                      className="block text-yellow-900 font-semibold mb-2"
                    >
                      To
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      className="rounded-lg border border-yellow-300 px-4 py-2 shadow-sm focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Fetch Button */}
                <div className="flex items-end">
                  <button
                    onClick={fetchAttendance}
                    disabled={loadingAttendance}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loadingAttendance ? "Fetching Attendance..." : "Fetch Attendance"}
                  </button>
                </div>
              </div>

              {/* Attendance List */}
              {attendanceData.length === 0 && !loadingAttendance && (
                <p className="text-yellow-700 italic text-center mt-8">
                  No attendance records found for the selected employee and date range.
                </p>
              )}

              {attendanceData.length > 0 && (
                <div className="space-y-4 mt-6 overflow-x-auto">
                  {attendanceData.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white shadow-md rounded-lg p-4 border-t-4 border-yellow-500 hover:shadow-lg transition flex items-center justify-between min-w-max"
                    >
                      <div className="flex items-center space-x-2 whitespace-nowrap font-semibold text-yellow-900">

                        <span>Date:</span>
                        <span className="font-normal text-yellow-700">{entry.date}</span>
                        <span className="text-yellow-300">|</span>

                        <span>In:</span>
                        <span className="font-normal text-yellow-700">{entry.punchIn}</span>
                        <span className="text-yellow-300">|</span>

                        <span>Out:</span>
                        <span className="font-normal text-yellow-700">{entry.punchOut}</span>
                        <span className="text-yellow-300">|</span>

                        <span>Status:</span>
                        <span className="font-normal text-yellow-700 capitalize">{entry.status}</span>
                        <span className="text-yellow-300">|</span>

                        <span>Comments:</span>
                        <span className="font-normal text-yellow-700">{entry.comments || "-"}</span>
                      </div>

                      <button
                        onClick={() => setEditEntry(entry)}
                        className="ml-4 px-4 py-1 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 whitespace-nowrap"
                      >
                        Edit
                      </button>
                    </div>
                  ))}

                </div>
              )}

              {/* Edit Modal */}
              {editEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
                    <h2 className="text-2xl font-bold text-yellow-900 mb-4">
                      Edit Attendance ({editEntry.date})
                    </h2>

                    <label className="block font-semibold text-yellow-900 mb-1">Punch In</label>
                    <input
                      type="time"
                      value={editEntry.punchIn}
                      onChange={(e) =>
                        setEditEntry((prev) => ({ ...prev, punchIn: e.target.value }))
                      }
                      className="w-full border border-yellow-300 rounded-md px-3 py-2 mb-4 focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300"
                    />

                    <label className="block font-semibold text-yellow-900 mb-1">Punch Out</label>
                    <input
                      type="time"
                      value={editEntry.punchOut}
                      onChange={(e) =>
                        setEditEntry((prev) => ({ ...prev, punchOut: e.target.value }))
                      }
                      className="w-full border border-yellow-300 rounded-md px-3 py-2 mb-4 focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300"
                    />

                    <label className="block font-semibold text-yellow-900 mb-1">Status</label>
                    <select
                      value={editEntry.status}
                      onChange={(e) =>
                        setEditEntry((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="w-full border border-yellow-300 rounded-md px-3 py-2 mb-4 focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300"
                    >
                      <option value="fullDay">Full Day</option>
                      <option value="halfDay">Half Day</option>
                      <option value="absent">Absent</option>
                    </select>

                    <label className="block font-semibold text-yellow-900 mb-1">Comments</label>
                    <textarea
                      rows={3}
                      value={editEntry.comments}
                      onChange={(e) =>
                        setEditEntry((prev) => ({ ...prev, comments: e.target.value }))
                      }
                      className="w-full border border-yellow-300 rounded-md px-3 py-2 mb-4 focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300 resize-none"
                    />

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setEditEntry(null)}
                        disabled={loadingSave}
                        className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveAttendance}
                        disabled={loadingSave}
                        className="px-5 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                      >
                        {loadingSave ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRAttendance;
