import React, { useState } from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const MyAttendance = () => {
  const [filterType, setFilterType] = useState("monthYear"); // "date", "monthYear", or "year"
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [monthYear, setMonthYear] = useState(() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  });
  const [year, setYear] = useState(new Date().getFullYear().toString());

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

    let body = {};
    if (filterType === "date") {
      body = { date };
    } else if (filterType === "monthYear") {
      body = { monthYear };
    } else if (filterType === "year") {
      body = { year };
    }

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/attendance/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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

          {/* Filter Type Selection */}
          <div className="mb-6 flex flex-wrap gap-4 justify-center">
            <label className="text-yellow-900 font-semibold">
              <input
                type="radio"
                value="date"
                checked={filterType === "date"}
                onChange={() => setFilterType("date")}
                className="mr-1"
              />
              Single Date
            </label>
            <label className="text-yellow-900 font-semibold">
              <input
                type="radio"
                value="monthYear"
                checked={filterType === "monthYear"}
                onChange={() => setFilterType("monthYear")}
                className="mr-1"
              />
              Month-Year
            </label>
            <label className="text-yellow-900 font-semibold">
              <input
                type="radio"
                value="year"
                checked={filterType === "year"}
                onChange={() => setFilterType("year")}
                className="mr-1"
              />
              Full Year
            </label>
          </div>

          {/* Input based on selection */}
          <div className="mb-8 flex flex-wrap gap-6 items-center justify-center">
            {filterType === "date" && (
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            )}

            {filterType === "monthYear" && (
              <input
                type="month"
                value={`${monthYear.split("-").reverse().join("-")}`}
                onChange={(e) => {
                  const [y, m] = e.target.value.split("-");
                  setMonthYear(`${m}-${y}`);
                }}
                className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            )}

            {filterType === "year" && (
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max="2100"
                className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-32"
              />
            )}

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
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendanceData.map(({ id, date, status, punchIn, punchOut }) => (
                    <tr
                      key={id}
                      className={`border-b border-yellow-100 ${
                        status === "absent" ? "bg-red-50 text-red-700" : "text-yellow-900"
                      } hover:bg-yellow-50 transition-colors duration-200`}
                    >
                      <td className="p-4">{new Date(date).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold">{status}</td>
                      <td className="p-4">{punchIn || "-"}</td>
                      <td className="p-4">{punchOut || "-"}</td>
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
