import React, { useState } from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const MyAttendance = () => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    const token = localStorage.getItem("employee_token");
    if (!token) {
      setError("Unauthorized: Token not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://192.168.0.100:9000/employee/attendance/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate,
          endDate,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to fetch attendance");
      }

      setAttendanceData(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <EmployeeSidebar />

      <main className="flex-1 ml-64 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border border-yellow-300 p-10">
          <h1 className="text-4xl font-extrabold mb-10 text-yellow-900 border-b border-yellow-300 pb-4 text-center">
            My Attendance
          </h1>

          {/* Date selectors and fetch button */}
          <div className="mb-8 flex flex-wrap gap-6 items-center justify-center">
            <label className="font-semibold text-yellow-900 text-lg">
              From:{" "}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>

            <label className="font-semibold text-yellow-900 text-lg">
              To:{" "}
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>

            <button
              onClick={fetchAttendance}
              className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
            >
              Fetch Attendance
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-center font-medium mb-4">{error}</div>
          )}

          {loading ? (
            <div className="text-center text-yellow-800">Loading attendance...</div>
          ) : (
            <table className="w-full rounded-lg border border-yellow-200 shadow-sm overflow-hidden">
              <thead className="bg-yellow-200 text-yellow-900 font-semibold text-left">
                <tr>
                  <th className="p-4 border-b border-yellow-300">Date</th>
                  <th className="p-4 border-b border-yellow-300">Status</th>
                  <th className="p-4 border-b border-yellow-300">Check-In</th>
                  <th className="p-4 border-b border-yellow-300">Check-Out</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-yellow-700 italic">
                      No attendance records found for the selected date range.
                    </td>
                  </tr>
                ) : (
                  attendanceData.map(({ date, status, checkIn, checkOut }) => (
                    <tr
                      key={date}
                      className={`border-b border-yellow-100 ${
                        status === "Absent" ? "bg-red-50 text-red-700" : "text-yellow-900"
                      } hover:bg-yellow-50 transition-colors duration-200`}
                    >
                      <td className="p-4">{new Date(date).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold">{status}</td>
                      <td className="p-4">{checkIn || "-"}</td>
                      <td className="p-4">{checkOut || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyAttendance;
