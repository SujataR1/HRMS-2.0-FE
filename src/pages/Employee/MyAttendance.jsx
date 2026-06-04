// import EmployeeSidebar from "../../components/Common/EmployeeSidebar";
// import React, { useState, useEffect } from "react";


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
//   const [openComment, setOpenComment] = useState(null);


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
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Month-Year filter (already correct, just kept clean)
//     if (filterType === "monthYear") {
//       const [month, year] = monthYear.split("-");
//       const selectedMonth = parseInt(month, 10);
//       const selectedYear = parseInt(year, 10);

//       if (
//         selectedMonth === today.getMonth() + 1 &&
//         selectedYear === today.getFullYear()
//       ) {
//         return attendanceData.filter(({ date }) => {
//           const attDate = new Date(date);
//           attDate.setHours(0, 0, 0, 0);
//           return attDate <= today;
//         });
//       }
//     }

//     // ✅ YEAR filter fix (THIS IS THE MISSING PART)
//     if (filterType === "year") {
//       const selectedYear = parseInt(year, 10);

//       // If current year → hide future dates
//       if (selectedYear === today.getFullYear()) {
//         return attendanceData.filter(({ date }) => {
//           const attDate = new Date(date);
//           attDate.setHours(0, 0, 0, 0);
//           return attDate <= today;
//         });
//       }
//     }

//     return attendanceData;
//   })();

//   useEffect(() => {
//     setAttendanceData([]);
//     setError("");
//   }, [filterType]);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-200">
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
// <table className="w-full text-sm border-separate border-spacing-y-2">

//                   <thead className="bg-yellow-200 text-yellow-900 font-semibold text-left">
//                       <tr className="hover:bg-slate-50 transition-colors">

//                       <th className="p-4 border-b border-yellow-300 text-center w-16">S.No.</th>
//                       <th className="p-4 border-b border-yellow-300 text-center w-28">Date</th>
//                       <th className="p-4 border-b border-yellow-300 text-left w-32">Day</th>
//                       <th className="p-4 border-b border-yellow-300 text-left w-28">Status</th>
//                       <th className="p-4 border-b border-yellow-300 text-center w-32">Check-In</th>
//                       <th className="p-4 border-b border-yellow-300 text-center w-32">Check-Out</th>
//                       <th className="p-4 border-b border-yellow-300 text-left w-40">Remarks</th>
//                       <th className="p-4 border-b border-yellow-300 text-left w-40">Comments</th>


//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredAttendanceData.map(
//                       ({ id, date, day, status, punchIn, punchOut, flags, comments }, index) => (
//                         <tr
//                           key={id}
//                           className={`border-b border-yellow-100 ${status === "absent"
//                             ? "bg-red-50 text-red-700"
//                             : "text-yellow-900"
//                             } hover:bg-white/60 transition-colors duration-200`}
//                         >
//                           <td className="p-4 text-center w-16">{index + 1}</td>
//                           <td className="p-4 text-center w-28">
//                             {new Date(date).toLocaleDateString()}
//                           </td>
//                           <td className="p-4 text-left w-32">{day}</td>
//                           <td className="p-4 text-left w-28 font-semibold">
//                             {formatStatus(status)}
//                           </td>
//                           <td className="p-4 text-center w-32">{punchIn || "-"}</td>
//                           <td className="p-4 text-center w-32">{punchOut || "-"}</td>
//                           <td className="p-4 text-left w-40">
//   <div className="flex flex-wrap gap-2">
//     {flags?.length ? (
//       flags.map((flag) => (
//         <span
//           key={flag}
//           className="px-3 py-1 rounded-full text-xs font-medium
//                      bg-indigo-50 text-indigo-700
//                      border border-indigo-200"
//         >
//           {formatFlags([flag])}
//         </span>
//       ))
//     ) : (
//       <span className="text-slate-400">—</span>
//     )}
//   </div>
// </td>



// <td className="p-4 text-left w-40">
//   {comments ? (
//     <span
//       className="block truncate cursor-pointer text-slate-700 hover:underline"
//       onClick={() => setOpenComment(comments)}
//     >
//       {comments}
//     </span>
//   ) : (
//     "-"
//   )}
// </td>


// {/* <td className="p-4 text-left w-40">
//   {comments ? (
//     <span className="block truncate" title={comments}>
//       {comments}
//     </span>
//   ) : (
//     "-"
//   )}
// </td> */}



//                         </tr>
//                       )
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards */}
//               <div className="md:hidden space-y-4">
//                 {filteredAttendanceData.map(
//                   ({ id, date, day, status, punchIn, punchOut, flags, comments }, index) => (
//                     <div
//                       key={id}
//                       className={`border rounded-lg p-4 shadow-sm ${status === "absent"
//                         ? "bg-red-50 text-red-700 border-red-200"
//                         : "bg-yellow-50 text-yellow-900 border-yellow-200"
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
//                         <div className="col-span-2">
//                           <span className="font-semibold">Comments:</span>{" "}
//                           {comments || "-"}
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
//             <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
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
//             <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
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


// {openComment && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center">
//     {/* Backdrop */}
//     <div
//       className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//       onClick={() => setOpenComment(null)}
//     />

//     {/* Modal */}
//     <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-slate-200 animate-fadeIn">
      
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 border-b">
//         <h3 className="text-lg font-semibold text-slate-800">
//           Comment Details
//         </h3>
//         <button
//           onClick={() => setOpenComment(null)}
//           className="text-slate-400 hover:text-slate-600 text-xl leading-none"
//         >
//           ×
//         </button>
//       </div>

//       {/* Body */}
//       <div className="px-6 py-5 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto">
//         {openComment}
//       </div>

//       {/* Footer */}
//       <div className="px-6 py-4 border-t flex justify-end bg-slate-50 rounded-b-2xl">
//         <button
//           onClick={() => setOpenComment(null)}
//           className="px-5 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//     </div>
//   );
// };

// export default MyAttendance;
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";
import React, { useState, useEffect } from "react";

const MyAttendance = () => {
  const [filterType, setFilterType] = useState("monthYear");
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
  const [openComment, setOpenComment] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    // Filter out "directionalPunchState" from flags
    const filteredFlags = flags.filter(flag => flag !== "directionalPunchState");
    if (filteredFlags.length === 0) return "-";
    return filteredFlags
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterType === "monthYear") {
      const [month, year] = monthYear.split("-");
      const selectedMonth = parseInt(month, 10);
      const selectedYear = parseInt(year, 10);

      if (
        selectedMonth === today.getMonth() + 1 &&
        selectedYear === today.getFullYear()
      ) {
        return attendanceData.filter(({ date }) => {
          const attDate = new Date(date);
          attDate.setHours(0, 0, 0, 0);
          return attDate <= today;
        });
      }
    }

    if (filterType === "year") {
      const selectedYear = parseInt(year, 10);
      if (selectedYear === today.getFullYear()) {
        return attendanceData.filter(({ date }) => {
          const attDate = new Date(date);
          attDate.setHours(0, 0, 0, 0);
          return attDate <= today;
        });
      }
    }

    return attendanceData;
  })();

  useEffect(() => {
    setAttendanceData([]);
    setError("");
  }, [filterType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <EmployeeSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Attendance</h1>
                </div>
                <p className="text-slate-500 text-sm ml-1">Track your daily attendance records</p>
              </div>

              {/* Filter Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <div className="flex flex-wrap gap-3 mb-5">
                  <button
                    onClick={() => setFilterType("date")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filterType === "date" 
                        ? "bg-amber-500 text-white shadow-md" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Single Date
                  </button>
                  <button
                    onClick={() => setFilterType("monthYear")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filterType === "monthYear" 
                        ? "bg-amber-500 text-white shadow-md" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Month-Year
                  </button>
                  <button
                    onClick={() => setFilterType("year")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filterType === "year" 
                        ? "bg-amber-500 text-white shadow-md" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Full Year
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {filterType === "date" && (
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  )}

                  {filterType === "year" && (
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      min="2000"
                      max="2100"
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  )}

                  <button
                    onClick={fetchAttendance}
                    className="px-5 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition font-medium text-sm shadow-sm"
                  >
                    Fetch Attendance
                  </button>

                  <button
                    onClick={() => setShowRegenerateDialog(true)}
                    className="px-5 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition font-medium text-sm shadow-sm"
                  >
                    Regenerate
                  </button>

                  {filterType === "monthYear" && (
                    <button
                      onClick={sendMonthlyReport}
                      disabled={reportLoading}
                      className="px-5 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-medium text-sm shadow-sm disabled:opacity-50"
                    >
                      {reportLoading ? "Sending..." : "Send Report"}
                    </button>
                  )}
                </div>

                <p className="text-xs text-amber-600 mt-3 italic">
                  Note: "Regenerate Attendance" will refresh data based on the selected filter.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
              ) : filteredAttendanceData.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-slate-500">No attendance records found.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">#</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Day</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Check-In</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Check-Out</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Remarks</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">Comments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredAttendanceData.map(
                            ({ id, date, day, status, punchIn, punchOut, flags, comments }, index) => (
                              <tr
                                key={id}
                                className={`hover:bg-amber-50/30 transition ${
                                  status === "absent" ? "bg-red-50/50" : ""
                                }`}
                              >
                                <td className="px-5 py-3 text-sm text-slate-500">{index + 1}</td>
                                <td className="px-5 py-3 text-sm font-medium text-slate-700">
                                  {new Date(date).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-3 text-sm text-slate-600">{day}</td>
                                <td className="px-5 py-3">
                                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                    status === "present" ? "bg-green-100 text-green-700" :
                                    status === "absent" ? "bg-red-100 text-red-700" :
                                    status === "fullDay" ? "bg-green-100 text-green-700" :
                                    status === "halfDay" ? "bg-yellow-100 text-yellow-700" :
                                    status === "overtime" ? "bg-blue-100 text-blue-700" :
                                    "bg-gray-100 text-gray-700"
                                  }`}>
                                    {formatStatus(status)}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-sm text-slate-600">{punchIn || "-"}</td>
                                <td className="px-5 py-3 text-sm text-slate-600">{punchOut || "-"}</td>
                                <td className="px-5 py-3 text-sm text-slate-500">
                                  <div className="flex flex-wrap gap-1">
                                    {(() => {
                                      const filteredFlags = flags?.filter(f => f !== "directionalPunchState") || [];
                                      if (filteredFlags.length === 0) return <span>-</span>;
                                      return filteredFlags.map((flag) => (
                                        <span
                                          key={flag}
                                          className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-medium"
                                        >
                                          {flag.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim()}
                                        </span>
                                      ));
                                    })()}
                                  </div>
                                </td>
                                <td className="px-5 py-3">
                                  {comments ? (
                                    <button
                                      onClick={() => setOpenComment(comments)}
                                      className="text-amber-600 hover:text-amber-700 text-sm underline"
                                    >
                                      View
                                    </button>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4">
                    {filteredAttendanceData.map(
                      ({ id, date, day, status, punchIn, punchOut, flags, comments }, index) => (
                        <div
                          key={id}
                          className={`bg-white rounded-2xl shadow-sm border p-4 ${
                            status === "absent" ? "border-red-200 bg-red-50/30" : "border-slate-100"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm font-medium text-slate-400">#{index + 1}</p>
                              <p className="text-base font-bold text-slate-800">
                                {new Date(date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-slate-500">{day}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              status === "present" ? "bg-green-100 text-green-700" :
                              status === "absent" ? "bg-red-100 text-red-700" :
                              status === "fullDay" ? "bg-green-100 text-green-700" :
                              status === "halfDay" ? "bg-yellow-100 text-yellow-700" :
                              status === "overtime" ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {formatStatus(status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-slate-400">Check-In</p>
                              <p className="font-medium text-slate-700">{punchIn || "-"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Check-Out</p>
                              <p className="font-medium text-slate-700">{punchOut || "-"}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-slate-400">Remarks</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(() => {
                                  const filteredFlags = flags?.filter(f => f !== "directionalPunchState") || [];
                                  if (filteredFlags.length === 0) return <span className="text-slate-500">-</span>;
                                  return filteredFlags.map((flag) => (
                                    <span
                                      key={flag}
                                      className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-medium"
                                    >
                                      {flag.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim()}
                                    </span>
                                  ));
                                })()}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-slate-400">Comments</p>
                              {comments ? (
                                <button
                                  onClick={() => setOpenComment(comments)}
                                  className="text-amber-600 hover:text-amber-700 text-sm underline"
                                >
                                  View Comment
                                </button>
                              ) : (
                                <span className="text-slate-500 text-sm">-</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Regenerate Dialog */}
      {showRegenerateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRegenerateDialog(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Confirm Regenerate</h3>
            <p className="text-slate-600 text-sm mb-4">
              This will overwrite your existing attendance data for the selected filter. Are you sure?
            </p>
            {regenError && <p className="text-red-600 text-sm mb-3">{regenError}</p>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRegenerateDialog(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={regenerateAttendance}
                disabled={regenLoading}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium disabled:opacity-50"
              >
                {regenLoading ? "Processing..." : "Yes, Regenerate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Success Popup */}
      {showReportSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowReportSuccessPopup(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-700 font-medium mb-4">{reportMessage}</p>
            <button
              onClick={() => setShowReportSuccessPopup(false)}
              className="px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {openComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpenComment(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-semibold text-slate-800">Comment Details</h3>
              <button onClick={() => setOpenComment(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="px-5 py-4 text-slate-600 text-sm whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
              {openComment}
            </div>
            <div className="px-5 py-3 border-t bg-slate-50 rounded-b-2xl flex justify-end">
              <button onClick={() => setOpenComment(null)} className="px-4 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;