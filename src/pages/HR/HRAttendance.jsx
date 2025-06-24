import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const dummyAttendanceData = {
  E1001: {
    markIn: "09:05 AM",
    markOut: "06:00 PM",
    breaks: [
      { start: "12:30 PM", end: "01:00 PM" },
      { start: "03:15 PM", end: "03:30 PM" },
    ],
  },
  E1002: {
    markIn: "08:55 AM",
    markOut: "05:45 PM",
    breaks: [{ start: "01:00 PM", end: "01:30 PM" }],
  },
  // Add more dummy data here...
};

const HRAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:9000/admin/employee-profiles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
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

  // Update attendance when employee changes
  useEffect(() => {
    if (selectedEmpId) {
      setAttendance(dummyAttendanceData[selectedEmpId] || null);
    } else {
      setAttendance(null);
    }
  }, [selectedEmpId]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 font-sans">
      <HRSidebar />
      <main className="ml-64 flex-1 flex flex-col items-center p-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-yellow-200 p-10 space-y-10">
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
              <label
                htmlFor="employee-select"
                className="block text-yellow-900 font-semibold mb-3"
              >
                Select Employee
              </label>
              <select
                id="employee-select"
                className="w-full max-w-md rounded-lg border border-yellow-300 px-4 py-3 shadow-sm focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300 transition"
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

              {selectedEmpId && (
                <div className="mt-10 bg-yellow-50 rounded-xl p-8 border border-yellow-200 shadow-md max-w-md mx-auto">
                  <h2 className="text-2xl font-semibold text-yellow-900 mb-6 text-center">
                    Attendance Details
                  </h2>

                  {attendance ? (
                    <>
                      <p className="text-yellow-800 text-lg mb-4">
                        <span className="font-semibold">Mark In:</span> {attendance.markIn}
                      </p>
                      <p className="text-yellow-800 text-lg mb-4">
                        <span className="font-semibold">Mark Out:</span> {attendance.markOut}
                      </p>

                      <div>
                        <h3 className="text-yellow-900 font-semibold mb-3">
                          Break Times
                        </h3>
                        {attendance.breaks.length === 0 ? (
                          <p className="text-yellow-700 italic">No breaks recorded.</p>
                        ) : (
                          <ul className="space-y-2 text-yellow-800">
                            {attendance.breaks.map((b, idx) => (
                              <li
                                key={idx}
                                className="bg-yellow-100 rounded-lg px-4 py-2 shadow-inner"
                              >
                                {b.start} - {b.end}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-yellow-700 italic text-center">
                      No attendance data available for this employee.
                    </p>
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

export default HRAttendance;
