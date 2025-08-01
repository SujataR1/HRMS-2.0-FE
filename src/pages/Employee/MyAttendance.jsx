// import React, { useState } from "react";
// import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

// const MyAttendance = () => {
//   const [filterType, setFilterType] = useState("monthYear"); // "date", "monthYear", or "year"
//   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
//   const [monthYear, setMonthYear] = useState(() => {
//     const d = new Date();
//     return `${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
//   });
//   const [year, setYear] = useState(new Date().getFullYear().toString());

//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
//   const [regenLoading, setRegenLoading] = useState(false);
//   const [regenError, setRegenError] = useState("");

//   const fetchAttendance = async () => {
//     const token = localStorage.getItem("employee_token");
//     if (!token) {
//       setError("Unauthorized: Token not found. Please log in again.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     let body = {};
//     if (filterType === "date") {
//       body = { date };
//     } else if (filterType === "monthYear") {
//       body = { monthYear };
//     } else if (filterType === "year") {
//       body = { year };
//     }

//     try {
//       const res = await fetch(
//         "https://backend.hrms.transev.site/employee/attendance/view",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(body),
//         }
//       );

//       const json = await res.json();

//       if (!res.ok) {
//         throw new Error(json?.error || "Failed to fetch attendance");
//       }

//       setAttendanceData(json.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const regenerateAttendance = async () => {
//     setRegenLoading(true);
//     setRegenError("");
//     const token = localStorage.getItem("employee_token");
//     if (!token) {
//       setRegenError("Unauthorized: Token not found. Please log in again.");
//       setRegenLoading(false);
//       return;
//     }

//     let body = {};
//     if (filterType === "date") {
//       body = { date };
//     } else if (filterType === "monthYear") {
//       body = { monthYear };
//     } else if (filterType === "year") {
//       body = { year };
//     }

//     try {
//       const res = await fetch(
//         "https://backend.hrms.transev.site/employee/attendance/generate",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(body),
//         }
//       );

//       const json = await res.json();

//       if (!res.ok) {
//         throw new Error(json?.error || "Failed to regenerate attendance");
//       }

//       // Close dialog and refresh attendance data
//       setShowRegenerateDialog(false);
//       await fetchAttendance();
//     } catch (err) {
//       setRegenError(err.message);
//     } finally {
//       setRegenLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-yellow-50">
//       <EmployeeSidebar />

//       <main className="flex-1 ml-64 flex items-center justify-center p-8">
//         <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border border-yellow-300 p-10">
//           <h1 className="text-4xl font-extrabold mb-10 text-yellow-900 border-b border-yellow-300 pb-4 text-center">
//             My Attendance
//           </h1>

//           {/* Filter Type Selection */}
//           <div className="mb-6 flex flex-wrap gap-4 justify-center">
//             <label className="text-yellow-900 font-semibold">
//               <input
//                 type="radio"
//                 value="date"
//                 checked={filterType === "date"}
//                 onChange={() => setFilterType("date")}
//                 className="mr-1"
//               />
//               Single Date
//             </label>
//             <label className="text-yellow-900 font-semibold">
//               <input
//                 type="radio"
//                 value="monthYear"
//                 checked={filterType === "monthYear"}
//                 onChange={() => setFilterType("monthYear")}
//                 className="mr-1"
//               />
//               Month-Year
//             </label>
//             <label className="text-yellow-900 font-semibold">
//               <input
//                 type="radio"
//                 value="year"
//                 checked={filterType === "year"}
//                 onChange={() => setFilterType("year")}
//                 className="mr-1"
//               />
//               Full Year
//             </label>
//           </div>

//           {/* User Note */}
//           <div className="mb-4 text-center text-red-600 italic font-semibold">
//             Note: The "Regenerate Attendance" will refresh data based on the selected filter.
//           </div>

//           {/* Input based on selection + buttons */}
//           <div className="mb-8 flex flex-wrap gap-6 items-center justify-center">
//             {filterType === "date" && (
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               />
//             )}

//             {filterType === "monthYear" && (
//               <input
//                 type="month"
//                 value={`${monthYear.split("-").reverse().join("-")}`}
//                 onChange={(e) => {
//                   const [y, m] = e.target.value.split("-");
//                   setMonthYear(`${m}-${y}`);
//                 }}
//                 className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               />
//             )}

//             {filterType === "year" && (
//               <input
//                 type="number"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//                 min="2000"
//                 max="2100"
//                 className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-32"
//               />
//             )}

//             <button
//               onClick={fetchAttendance}
//               className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
//             >
//               Fetch Attendance
//             </button>

//             <button
//               onClick={() => setShowRegenerateDialog(true)}
//               className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
//             >
//               Regenerate Attendance
//             </button>

//           </div>

//           {error && (
//             <div className="text-red-600 text-center font-medium mb-4">{error}</div>
//           )}

//           {loading ? (
//             <div className="text-center text-yellow-800">Loading attendance...</div>
//           ) : (
//             <table className="w-full rounded-lg border border-yellow-200 shadow-sm overflow-hidden">
//               <thead className="bg-yellow-200 text-yellow-900 font-semibold text-left">
//                 <tr>
//                   <th className="p-4 border-b border-yellow-300">Date</th>
//                   <th className="p-4 border-b border-yellow-300">Status</th>
//                   <th className="p-4 border-b border-yellow-300">Check-In</th>
//                   <th className="p-4 border-b border-yellow-300">Check-Out</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendanceData.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="text-center py-8 text-yellow-700 italic"
//                     >
//                       No attendance records found.
//                     </td>
//                   </tr>
//                 ) : (
//                   attendanceData.map(({ id, date, status, punchIn, punchOut }) => (
//                     <tr
//                       key={id}
//                       className={`border-b border-yellow-100 ${status === "absent"
//                         ? "bg-red-50 text-red-700"
//                         : "text-yellow-900"
//                         } hover:bg-yellow-50 transition-colors duration-200`}
//                     >
//                       <td className="p-4">{new Date(date).toLocaleDateString()}</td>
//                       <td className="p-4 font-semibold">{status}</td>
//                       <td className="p-4">{punchIn || "-"}</td>
//                       <td className="p-4">{punchOut || "-"}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           )}

//           {/* Regenerate Confirmation Dialog */}
//           {showRegenerateDialog && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//               <div className="bg-white p-6 rounded-lg w-96 shadow-xl border border-gray-300">
//                 <h2 className="text-xl font-bold mb-4 text-gray-800">
//                   Regenerate Attendance?
//                 </h2>

//                 <p className="mb-4 text-sm text-red-600">
//                   Are you sure you want to regenerate attendance based on the selected
//                   filter?
//                 </p>

//                 {regenError && (
//                   <div className="text-red-600 text-sm mb-2">{regenError}</div>
//                 )}

//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={() => setShowRegenerateDialog(false)}
//                     className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//                     disabled={regenLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={regenerateAttendance}
//                     className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-700"
//                     disabled={regenLoading}
//                   >
//                     {regenLoading ? "Regenerating..." : "Confirm"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MyAttendance;

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

  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [regenError, setRegenError] = useState("");

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
      const res = await fetch(
        "https://backend.hrms.transev.site/employee/attendance/view",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

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
  const formatStatus = (status) => {
    if (!status) return "-";
    return status
      .replace(/([A-Z])/g, " $1") // adds space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
      .trim();
  };
  const formatFlags = (flags) => {
    if (!flags || flags.length === 0) return "-";
    return flags
      .map(flag =>
        flag
          .replace(/([A-Z])/g, " $1") // space before capital letters
          .replace(/^./, str => str.toUpperCase()) // capitalize first letter
      )
      .join(", ");
  };


  const regenerateAttendance = async () => {
    setRegenLoading(true);
    setRegenError("");
    const token = localStorage.getItem("employee_token");
    if (!token) {
      setRegenError("Unauthorized: Token not found. Please log in again.");
      setRegenLoading(false);
      return;
    }

    let body = {};
    if (filterType === "date") {
      body = { date };
    } else if (filterType === "monthYear") {
      body = { monthYear };
    } else if (filterType === "year") {
      body = { year };
    }

    try {
      const res = await fetch(
        "https://backend.hrms.transev.site/employee/attendance/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to regenerate attendance");
      }

      // Close dialog and refresh attendance data
      setShowRegenerateDialog(false);
      await fetchAttendance();
    } catch (err) {
      setRegenError(err.message);
    } finally {
      setRegenLoading(false);
    }
  };

  // Filter attendanceData to show only up to today if filterType is monthYear and selected month-year is current month-year
  const filteredAttendanceData = (() => {
    if (filterType === "monthYear") {
      const [month, year] = monthYear.split("-");
      const today = new Date();
      const selectedMonth = parseInt(month, 10);
      const selectedYear = parseInt(year, 10);

      if (
        selectedMonth === today.getMonth() + 1 &&
        selectedYear === today.getFullYear()
      ) {
        // Filter dates to <= today
        return attendanceData.filter(({ date }) => {
          const attDate = new Date(date);
          // Compare only date part (ignore time)
          return attDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0);
        });
      }
    }

    // Otherwise, return all data
    return attendanceData;

  })();

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

          {/* User Note */}
          <div className="mb-4 text-center text-red-600 italic font-semibold">
            Note: The "Regenerate Attendance" will refresh data based on the
            selected filter.
          </div>

          {/* Input based on selection + buttons */}
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
                value={`${monthYear.split("-").reverse().join("-")}`} // YYYY-MM format
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

            <button
              onClick={() => setShowRegenerateDialog(true)}
              className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
            >
              Regenerate Attendance
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
                  <th className="p-4 border-b border-yellow-300">S.No.</th>
                  <th className="p-4 border-b border-yellow-300">Date</th>
                  <th className="p-4 border-b border-yellow-300">Day</th> {/* Add this line */}
                  <th className="p-4 border-b border-yellow-300">Status</th>
                  <th className="p-4 border-b border-yellow-300">Check-In</th>
                  <th className="p-4 border-b border-yellow-300">Check-Out</th>
                  <th className="p-4 border-b border-yellow-300">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendanceData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-yellow-700 italic">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  filteredAttendanceData.map(
                    ({ id, date, day, status, punchIn, punchOut, flags }, index) => (
                      <tr
                        key={id}
                        className={`border-b border-yellow-100 ${status === "absent" ? "bg-red-50 text-red-700" : "text-yellow-900"
                          } hover:bg-yellow-50 transition-colors duration-200`}
                      >
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{new Date(date).toLocaleDateString()}</td>
                        <td className="p-4">{day}</td>
                        <td className="p-4 font-semibold">{formatStatus(status)}</td>
                        <td className="p-4">{punchIn || "-"}</td>
                        <td className="p-4">{punchOut || "-"}</td>
                        <td className="p-4">{formatFlags(flags)}</td> {/* ✅ New column */}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          )}

          {/* Regenerate Confirmation Dialog */}
          {showRegenerateDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-xl border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Regenerate Attendance?
                </h2>

                <p className="mb-4 text-sm text-red-600">
                  Are you sure you want to regenerate attendance based on the
                  selected filter?
                </p>

                {regenError && (
                  <div className="text-red-600 text-sm mb-2">{regenError}</div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowRegenerateDialog(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    disabled={regenLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={regenerateAttendance}
                    className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-700"
                    disabled={regenLoading}
                  >
                    {regenLoading ? "Regenerating..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyAttendance;
