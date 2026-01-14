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
//   const [reportLoading, setReportLoading] = useState(false);
//   const [reportMessage, setReportMessage] = useState("");
//   const [showReportSuccessPopup, setShowReportSuccessPopup] = useState(false);

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
//   const formatStatus = (status) => {
//     if (!status) return "-";
//     return status
//       .replace(/([A-Z])/g, " $1")
//       .replace(/^./, (str) => str.toUpperCase())
//       .trim();
//   };
//   const formatFlags = (flags) => {
//     if (!flags || flags.length === 0) return "-";
//     return flags
//       .map((flag) =>
//         flag
//           .replace(/([A-Z])/g, " $1")
//           .replace(/^./, (str) => str.toUpperCase())
//       )
//       .join(", ");
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

//       setShowRegenerateDialog(false);
//       await fetchAttendance();
//     } catch (err) {
//       setRegenError(err.message);
//     } finally {
//       setRegenLoading(false);
//     }
//   };

//   const sendMonthlyReport = async () => {
//     setReportLoading(true);
//     setError("");
//     setReportMessage("");

//     const token = localStorage.getItem("employee_token");
//     if (!token) {
//       setError("Unauthorized: Token not found. Please log in again.");
//       setReportLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(
//         "https://backend.hrms.transev.site/employee/attendance/send-monthly-reports",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ monthYear }),
//         }
//       );

//       const json = await res.json();

//       if (!res.ok) {
//         throw new Error(json?.error || "Failed to send monthly report");
//       }

//       setReportMessage(json.message || "Report sent successfully");
//       setShowReportSuccessPopup(true);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setReportLoading(false);
//     }
//   };

//   const filteredAttendanceData = (() => {
//     if (filterType === "monthYear") {
//       const [month, year] = monthYear.split("-");
//       const today = new Date();
//       const selectedMonth = parseInt(month, 10);
//       const selectedYear = parseInt(year, 10);

//       if (
//         selectedMonth === today.getMonth() + 1 &&
//         selectedYear === today.getFullYear()
//       ) {
//         return attendanceData.filter(({ date }) => {
//           const attDate = new Date(date);
//           return attDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0);
//         });
//       }
//     }
//     return attendanceData;
//   })();

//   return (
//     <div className="flex min-h-screen bg-yellow-50">
//       {/* Sidebar */}
//       <div className="w-64 hidden md:block">
//         <EmployeeSidebar />
//       </div>

//       <main className="flex-1 flex items-center justify-center p-4 md:p-6">
//         <div className="w-full max-w-5xl backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/40 p-6 md:p-10">
//           <h1 className="text-4xl font-extrabold mb-10 text-yellow-900 pb-4 text-center tracking-wide">
//             My Attendance
//           </h1>

//           {/* Filter Type Selection */}
//           <div className="mb-6 flex flex-wrap gap-4 justify-center">
//             <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer hover:bg-white/70 transition font-semibold text-yellow-900">
//               <input
//                 type="radio"
//                 value="date"
//                 checked={filterType === "date"}
//                 onChange={() => setFilterType("date")}
//                 className="mr-1"
//               />
//               Single Date
//             </label>
//             <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer hover:bg-white/70 transition font-semibold text-yellow-900">
//               <input
//                 type="radio"
//                 value="monthYear"
//                 checked={filterType === "monthYear"}
//                 onChange={() => setFilterType("monthYear")}
//                 className="mr-1"
//               />
//               Month-Year
//             </label>
//             <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer hover:bg-white/70 transition font-semibold text-yellow-900">
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
//             Note: The "Regenerate Attendance" will refresh data based on the
//             selected filter.
//           </div>

//           {/* Input based on selection + buttons */}
//           <div className="mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center">
//             {/* inputs */}
//             {filterType === "date" && (
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full max-w-xs md:w-48"
//               />
//             )}

//             {filterType === "monthYear" && (
//               <input
//                 type="month"
//                 value={`${monthYear.split("-").reverse().join("-")}`} // YYYY-MM format
//                 onChange={(e) => {
//                   const [y, m] = e.target.value.split("-");
//                   setMonthYear(`${m}-${y}`);
//                 }}
//                 className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full max-w-xs md:w-48"
//               />
//             )}

//             {filterType === "year" && (
//               <input
//                 type="number"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//                 min="2000"
//                 max="2100"
//                 className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full max-w-xs md:w-48"
//               />
//             )}

//             {/* Buttons */}
//             {/* Buttons */}
//             <button
//               onClick={fetchAttendance}
//               className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition w-full max-w-xs md:w-48"
//             >
//               Fetch Attendance
//             </button>

//             <button
//               onClick={() => setShowRegenerateDialog(true)}
//               className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition w-full max-w-xs md:w-48"
//             >
//               Regenerate Attendance
//             </button>

//             {filterType === "monthYear" && (
//               <button
//                 onClick={sendMonthlyReport}
//                 className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition w-full max-w-xs md:w-48"
//                 disabled={reportLoading}
//               >
//                 {reportLoading ? "Sending Report..." : "Send Monthly Report"}
//               </button>
//             )}

//           </div>

//           {error && (
//             <div className="text-red-600 text-center font-medium mb-4">{error}</div>
//           )}

//           {loading ? (
//             <div className="text-center text-yellow-800">Loading attendance...</div>
//           ) : filteredAttendanceData.length === 0 ? (
//             <div className="text-center py-8 text-yellow-700 italic">
//               No attendance records found.
//             </div>
//           ) : (
//             <>
//               {/* Desktop Table */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="w-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/60 border border-white/40 shadow-xl">
//                   <thead className="bg-yellow-200 text-yellow-900 font-semibold text-left">
//                     <tr>
//                       <th className="p-4 border-b border-yellow-300">S.No.</th>
//                       <th className="p-4 border-b border-yellow-300">Date</th>
//                       <th className="p-4 border-b border-yellow-300">Day</th>
//                       <th className="p-4 border-b border-yellow-300">Status</th>
//                       <th className="p-4 border-b border-yellow-300">Check-In</th>
//                       <th className="p-4 border-b border-yellow-300">Check-Out</th>
//                       <th className="p-4 border-b border-yellow-300">Remarks</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredAttendanceData.map(
//                       ({ id, date, day, status, punchIn, punchOut, flags }, index) => (
//                         <tr
//                           key={id}
//                           className={`border-b border-yellow-100 ${status === "absent"
//                               ? "bg-red-50 text-red-700"
//                               : "text-yellow-900"
//                             } hover:bg-white/60 transition-colors duration-200`}
//                         >
//                           <td className="p-4">{index + 1}</td>
//                           <td className="p-4">{new Date(date).toLocaleDateString()}</td>
//                           <td className="p-4">{day}</td>
//                           <td className="p-4 font-semibold">{formatStatus(status)}</td>
//                           <td className="p-4">{punchIn || "-"}</td>
//                           <td className="p-4">{punchOut || "-"}</td>
//                           <td className="p-4">{formatFlags(flags)}</td>
//                         </tr>
//                       )
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards */}
//               <div className="md:hidden space-y-4">
//                 {filteredAttendanceData.map(
//                   ({ id, date, day, status, punchIn, punchOut, flags }, index) => (
//                     <div
//                       key={id}
//                       className={`border rounded-lg p-4 shadow-sm ${status === "absent"
//                           ? "bg-red-50 text-red-700 border-red-200"
//                           : "bg-yellow-50 text-yellow-900 border-yellow-200"
//                         }`}
//                     >
//                       <div className="flex justify-between mb-2 font-semibold text-lg">
//                         <span>Day {index + 1}</span>
//                         <span>{new Date(date).toLocaleDateString()}</span>
//                       </div>

//                       <div className="grid grid-cols-2 gap-2 text-sm">
//                         <div>
//                           <span className="font-semibold">Day:</span> {day}
//                         </div>
//                         <div>
//                           <span className="font-semibold">Status:</span>{" "}
//                           {formatStatus(status)}
//                         </div>
//                         <div>
//                           <span className="font-semibold">Check-In:</span> {punchIn || "-"}
//                         </div>
//                         <div>
//                           <span className="font-semibold">Check-Out:</span>{" "}
//                           {punchOut || "-"}
//                         </div>
//                         <div className="col-span-2">
//                           <span className="font-semibold">Remarks:</span>{" "}
//                           {formatFlags(flags)}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             </>
//           )}

//           {/* Regenerate Confirmation Dialog */}
//           {showRegenerateDialog && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//               <div className="bg-white p-6 rounded-lg w-96 shadow-xl border border-gray-300">
//                 <h2 className="text-xl font-bold mb-4 text-yellow-900">
//                   Confirm Regenerate Attendance
//                 </h2>
//                 <p className="mb-6 text-yellow-700">
//                   This will overwrite your existing attendance data for the selected
//                   filter. Are you sure you want to continue?
//                 </p>
//                 {regenError && (
//                   <p className="mb-4 text-red-600 font-semibold">{regenError}</p>
//                 )}
//                 <div className="flex justify-end gap-4">
//                   <button
//                     onClick={() => setShowRegenerateDialog(false)}
//                     disabled={regenLoading}
//                     className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={regenerateAttendance}
//                     disabled={regenLoading}
//                     className="px-4 py-2 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition"
//                   >
//                     {regenLoading ? "Processing..." : "Yes, Regenerate"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Report Success Popup */}
//           {showReportSuccessPopup && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//               <div className="bg-white p-6 rounded-lg w-80 shadow-xl border border-gray-300 text-center">
//                 <p className="mb-4 text-yellow-900 font-semibold">{reportMessage}</p>
//                 <button
//                   onClick={() => setShowReportSuccessPopup(false)}
//                   className="px-4 py-2 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition"
//                 >
//                   OK
//                 </button>
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
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [showReportSuccessPopup, setShowReportSuccessPopup] = useState(false);

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
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };
  const formatFlags = (flags) => {
    if (!flags || flags.length === 0) return "-";
    return flags
      .map((flag) =>
        flag
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
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

      setShowRegenerateDialog(false);
      await fetchAttendance();
    } catch (err) {
      setRegenError(err.message);
    } finally {
      setRegenLoading(false);
    }
  };

  const sendMonthlyReport = async () => {
    setReportLoading(true);
    setError("");
    setReportMessage("");

    const token = localStorage.getItem("employee_token");
    if (!token) {
      setError("Unauthorized: Token not found. Please log in again.");
      setReportLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://backend.hrms.transev.site/employee/attendance/send-monthly-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ monthYear }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to send monthly report");
      }

      setReportMessage(json.message || "Report sent successfully");
      setShowReportSuccessPopup(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setReportLoading(false);
    }
  };

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
        return attendanceData.filter(({ date }) => {
          const attDate = new Date(date);
          return attDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0);
        });
      }
    }
    return attendanceData;
  })();

  return (
<div className="flex min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-200">
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <EmployeeSidebar />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-5xl backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/40 p-6 md:p-10">
          <h1 className="text-4xl font-extrabold mb-10 text-yellow-900 pb-4 text-center tracking-wide">
            My Attendance
          </h1>

          {/* Filter Type Selection */}
          <div className="mb-6 flex flex-wrap gap-4 justify-center">
            <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer hover:bg-white/70 transition font-semibold text-yellow-900">
              <input
                type="radio"
                value="date"
                checked={filterType === "date"}
                onChange={() => setFilterType("date")}
                className="mr-1"
              />
              Single Date
            </label>
            <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer hover:bg-white/70 transition font-semibold text-yellow-900">
              <input
                type="radio"
                value="monthYear"
                checked={filterType === "monthYear"}
                onChange={() => setFilterType("monthYear")}
                className="mr-1"
              />
              Month-Year
            </label>
            <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer hover:bg-white/70 transition font-semibold text-yellow-900">
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
          <div className="mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center">
            {/* inputs */}
            {filterType === "date" && (
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full max-w-xs md:w-48"
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
                className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full max-w-xs md:w-48"
              />
            )}

            {filterType === "year" && (
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max="2100"
                className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full max-w-xs md:w-48"
              />
            )}

            {/* Buttons */}
            {/* Buttons */}
            <button
              onClick={fetchAttendance}
              className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition w-full max-w-xs md:w-48"
            >
              Fetch Attendance
            </button>

            <button
              onClick={() => setShowRegenerateDialog(true)}
              className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition w-full max-w-xs md:w-48"
            >
              Regenerate Attendance
            </button>

            {filterType === "monthYear" && (
              <button
                onClick={sendMonthlyReport}
                className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition w-full max-w-xs md:w-48"
                disabled={reportLoading}
              >
                {reportLoading ? "Sending Report..." : "Send Monthly Report"}
              </button>
            )}

          </div>

          {error && (
            <div className="text-red-600 text-center font-medium mb-4">{error}</div>
          )}

          {loading ? (
            <div className="text-center text-yellow-800">Loading attendance...</div>
          ) : filteredAttendanceData.length === 0 ? (
            <div className="text-center py-8 text-yellow-700 italic">
              No attendance records found.
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/60 border border-white/40 shadow-xl">
                  <thead className="bg-yellow-200 text-yellow-900 font-semibold text-left">
                    <tr>
                      <th className="p-4 border-b border-yellow-300">S.No.</th>
                      <th className="p-4 border-b border-yellow-300">Date</th>
                      <th className="p-4 border-b border-yellow-300">Day</th>
                      <th className="p-4 border-b border-yellow-300">Status</th>
                      <th className="p-4 border-b border-yellow-300">Check-In</th>
                      <th className="p-4 border-b border-yellow-300">Check-Out</th>
                      <th className="p-4 border-b border-yellow-300">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendanceData.map(
                      ({ id, date, day, status, punchIn, punchOut, flags }, index) => (
                        <tr
                          key={id}
                          className={`border-b border-yellow-100 ${status === "absent"
                              ? "bg-red-50 text-red-700"
                              : "text-yellow-900"
                            } hover:bg-white/60 transition-colors duration-200`}
                        >
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4">{new Date(date).toLocaleDateString()}</td>
                          <td className="p-4">{day}</td>
                          <td className="p-4 font-semibold">{formatStatus(status)}</td>
                          <td className="p-4">{punchIn || "-"}</td>
                          <td className="p-4">{punchOut || "-"}</td>
                          <td className="p-4">{formatFlags(flags)}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredAttendanceData.map(
                  ({ id, date, day, status, punchIn, punchOut, flags }, index) => (
                    <div
                      key={id}
                      className={`border rounded-lg p-4 shadow-sm ${status === "absent"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-900 border-yellow-200"
                        }`}
                    >
                      <div className="flex justify-between mb-2 font-semibold text-lg">
                        <span>Day {index + 1}</span>
                        <span>{new Date(date).toLocaleDateString()}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-semibold">Day:</span> {day}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span>{" "}
                          {formatStatus(status)}
                        </div>
                        <div>
                          <span className="font-semibold">Check-In:</span> {punchIn || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Check-Out:</span>{" "}
                          {punchOut || "-"}
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">Remarks:</span>{" "}
                          {formatFlags(flags)}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          {/* Regenerate Confirmation Dialog */}
          {showRegenerateDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-xl border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-yellow-900">
                  Confirm Regenerate Attendance
                </h2>
                <p className="mb-6 text-yellow-700">
                  This will overwrite your existing attendance data for the selected
                  filter. Are you sure you want to continue?
                </p>
                {regenError && (
                  <p className="mb-4 text-red-600 font-semibold">{regenError}</p>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowRegenerateDialog(false)}
                    disabled={regenLoading}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={regenerateAttendance}
                    disabled={regenLoading}
                    className="px-4 py-2 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition"
                  >
                    {regenLoading ? "Processing..." : "Yes, Regenerate"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report Success Popup */}
          {showReportSuccessPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded-lg w-80 shadow-xl border border-gray-300 text-center">
                <p className="mb-4 text-yellow-900 font-semibold">{reportMessage}</p>
                <button
                  onClick={() => setShowReportSuccessPopup(false)}
                  className="px-4 py-2 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyAttendance;
