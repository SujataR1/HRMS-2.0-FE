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
  const [selectedPresenceEstimate, setSelectedPresenceEstimate] = useState(null);

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

  const formatConfidence = (confidence) => {
    if (!confidence) return "-";
    const colors = {
      high: "text-green-600",
      medium: "text-yellow-600",
      low: "text-red-600",
      unknown: "text-gray-500",
    };
    return {
      text: confidence.toUpperCase(),
      color: colors[confidence] || "text-gray-500",
    };
  };

  // Parse time string to minutes since midnight
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    // Handle format like "2026-06-01 13:18:00" or just "13:18:00"
    const timePart = timeStr.includes(" ") ? timeStr.split(" ")[1] : timeStr;
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Calculate total break time by merging overlapping breaks
  const calculateTotalBreakTime = (presenceEstimate) => {
    if (!presenceEstimate?.clusters?.middle || presenceEstimate.clusters.middle.length === 0) {
      return 0;
    }

    // Extract break intervals from clusters
    const breakIntervals = [];
    
    presenceEstimate.clusters.middle.forEach((cluster) => {
      if (cluster.firstPunchLocal && cluster.lastPunchLocal) {
        const start = parseTimeToMinutes(cluster.firstPunchLocal);
        const end = parseTimeToMinutes(cluster.lastPunchLocal);
        if (start !== end) {
          breakIntervals.push({ start, end });
        } else {
          // Single punch - treat as 1 minute break
          breakIntervals.push({ start, end: start + 1 });
        }
      }
    });

    if (breakIntervals.length === 0) return 0;

    // Sort intervals by start time
    breakIntervals.sort((a, b) => a.start - b.start);

    // Merge overlapping or consecutive intervals (within 10 minutes)
    const mergedIntervals = [];
    const MERGE_THRESHOLD = 10; // minutes

    for (const interval of breakIntervals) {
      if (mergedIntervals.length === 0) {
        mergedIntervals.push({ ...interval });
      } else {
        const last = mergedIntervals[mergedIntervals.length - 1];
        // If current break starts within threshold of last break's end, merge them
        if (interval.start <= last.end + MERGE_THRESHOLD) {
          last.end = Math.max(last.end, interval.end);
        } else {
          mergedIntervals.push({ ...interval });
        }
      }
    }

    // Calculate total break minutes
    let totalBreakMinutes = 0;
    mergedIntervals.forEach(interval => {
      totalBreakMinutes += (interval.end - interval.start);
    });

    return totalBreakMinutes;
  };

  // Calculate number of actual break periods (after merging)
  const calculateBreakCount = (presenceEstimate) => {
    if (!presenceEstimate?.clusters?.middle || presenceEstimate.clusters.middle.length === 0) {
      return 0;
    }

    const breakIntervals = [];
    
    presenceEstimate.clusters.middle.forEach((cluster) => {
      if (cluster.firstPunchLocal && cluster.lastPunchLocal) {
        const start = parseTimeToMinutes(cluster.firstPunchLocal);
        const end = parseTimeToMinutes(cluster.lastPunchLocal);
        if (start !== end) {
          breakIntervals.push({ start, end });
        } else {
          breakIntervals.push({ start, end: start + 1 });
        }
      }
    });

    if (breakIntervals.length === 0) return 0;

    breakIntervals.sort((a, b) => a.start - b.start);

    // Merge intervals
    const mergedIntervals = [];
    const MERGE_THRESHOLD = 10;

    for (const interval of breakIntervals) {
      if (mergedIntervals.length === 0) {
        mergedIntervals.push({ ...interval });
      } else {
        const last = mergedIntervals[mergedIntervals.length - 1];
        if (interval.start <= last.end + MERGE_THRESHOLD) {
          last.end = Math.max(last.end, interval.end);
        } else {
          mergedIntervals.push({ ...interval });
        }
      }
    }

    return mergedIntervals.length;
  };

  // Format minutes to readable string
  const formatMinutes = (minutes) => {
    if (!minutes || minutes === 0) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Format break count with proper text
  const formatBreakCount = (count) => {
    if (count === 0) return "-";
    if (count === 1) return "1 break";
    return `${count} breaks`;
  };

  // Calculate net working time (estimated inside minutes - break minutes)
  const calculateNetWorkingTime = (presenceEstimate) => {
    if (!presenceEstimate?.estimatedInsideMinutes) return 0;
    const breakTime = calculateTotalBreakTime(presenceEstimate);
    return Math.max(0, presenceEstimate.estimatedInsideMinutes - breakTime);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "fullDay":
        return "bg-green-100 text-green-800";
      case "halfDay":
        return "bg-orange-100 text-orange-800";
      case "overtime":
        return "bg-purple-100 text-purple-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "weeklyOff":
        return "bg-blue-100 text-blue-800";
      case "holiday":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-200">
      <div className="w-64 hidden md:block">
        <EmployeeSidebar />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-7xl backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/40 p-6 md:p-10">
          <h1 className="text-4xl font-extrabold mb-10 text-yellow-900 pb-4 text-center tracking-wide">
            My Attendance
          </h1>

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

          <div className="mb-4 text-center text-red-600 italic font-semibold">
            Note: The "Regenerate Attendance" will refresh data based on the selected filter.
          </div>

          <div className="mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center">
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
                value={`${monthYear.split("-").reverse().join("-")}`}
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
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm border-separate border-spacing-y-2">
                  <thead className="bg-yellow-200 text-yellow-900 font-semibold text-left">
                    <tr>
                      <th className="p-4 border-b border-yellow-300 text-center w-12">S.No.</th>
                      <th className="p-4 border-b border-yellow-300 text-center w-24">Date</th>
                      <th className="p-4 border-b border-yellow-300 text-left w-24">Day</th>
                      <th className="p-4 border-b border-yellow-300 text-left w-24">Status</th>
                      <th className="p-4 border-b border-yellow-300 text-center w-28">Check-In</th>
                      <th className="p-4 border-b border-yellow-300 text-center w-28">Check-Out</th>
                      <th className="p-4 border-b border-yellow-300 text-center w-32">Office Hours</th>
                      <th className="p-4 border-b border-yellow-300 text-center w-28">Break Taken</th>
                      <th className="p-4 border-b border-yellow-300 text-center w-32">Net Working</th>
                      <th className="p-4 border-b border-yellow-300 text-left w-24">Confidence</th>
                      <th className="p-4 border-b border-yellow-300 text-left w-40">Flags</th>
                      <th className="p-4 border-b border-yellow-300 text-left w-40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendanceData.map(
                      ({ id, date, day, status, punchIn, punchOut, flags, comments, presenceEstimate }, index) => {
                        const breakTime = calculateTotalBreakTime(presenceEstimate);
                        const breakCount = calculateBreakCount(presenceEstimate);
                        const netWorkingTime = calculateNetWorkingTime(presenceEstimate);
                        
                        return (
                          <tr
                            key={id}
                            className="border-b border-yellow-100 hover:bg-white/60 transition-colors duration-200"
                          >
                            <td className="p-4 text-center">{index + 1}</td>
                            <td className="p-4 text-center">
                              {new Date(date).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-left">{day}</td>
                            <td className="p-4 text-left">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                                {formatStatus(status)}
                              </span>
                            </td>
                            <td className="p-4 text-center">{punchIn || "-"}</td>
                            <td className="p-4 text-center">{punchOut || "-"}</td>
                            <td className="p-4 text-center">
                              {presenceEstimate?.estimatedInsideMinutes ? (
                                <div className="text-xs">
                                  <div className="font-semibold">{formatMinutes(presenceEstimate.estimatedInsideMinutes)}</div>
                                  <div className="text-gray-500 text-[10px]">
                                    ({presenceEstimate.estimatedInsideStart?.split(" ")[1] || "-"} - {presenceEstimate.estimatedInsideEnd?.split(" ")[1] || "-"})
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {breakTime > 0 ? (
                                <div className="text-xs">
                                  <div className="font-semibold text-orange-600">✓{formatMinutes(breakTime)}</div>
                                  <div className="text-gray-500 text-[10px]">
                                    {formatBreakCount(breakCount)}
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {netWorkingTime > 0 ? (
                                <div className="text-xs">
                                  <div className="font-semibold text-green-600">{formatMinutes(netWorkingTime)}</div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-4 text-left">
                              {presenceEstimate?.confidence && (
                                <span className={`font-semibold text-xs ${formatConfidence(presenceEstimate.confidence).color}`}>
                                  {formatConfidence(presenceEstimate.confidence).text}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-left">
                              <div className="flex flex-wrap gap-1">
                                {flags?.length ? (
                                  flags.map((flag) => (
                                    <span
                                      key={flag}
                                      className="px-2 py-1 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                                    >
                                      {formatFlags([flag])}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400 text-xs">—</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-left">
                              <div className="flex gap-2">
                                {comments && (
                                  <button
                                    onClick={() => setOpenComment(comments)}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
                                  >
                                    View Comment
                                  </button>
                                )}
                                {presenceEstimate && (
                                  <button
                                    onClick={() => setSelectedPresenceEstimate(presenceEstimate)}
                                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition"
                                  >
                                    View Details
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tablet View */}
              <div className="hidden md:block lg:hidden">
                <div className="space-y-4">
                  {filteredAttendanceData.map(
                    ({ id, date, day, status, punchIn, punchOut, flags, comments, presenceEstimate }, index) => {
                      const breakTime = calculateTotalBreakTime(presenceEstimate);
                      const breakCount = calculateBreakCount(presenceEstimate);
                      const netWorkingTime = calculateNetWorkingTime(presenceEstimate);
                      
                      return (
                        <div
                          key={id}
                          className="bg-white/80 rounded-lg p-4 shadow-sm border border-yellow-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-semibold text-lg">{new Date(date).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-600">{day}</div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                              {formatStatus(status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <span className="font-semibold">Check-In:</span> {punchIn || "-"}
                            </div>
                            <div>
                              <span className="font-semibold">Check-Out:</span> {punchOut || "-"}
                            </div>
                            {presenceEstimate?.estimatedInsideMinutes && (
                              <>
                                <div>
                                  <span className="font-semibold">Office Hours:</span>{" "}
                                  {formatMinutes(presenceEstimate.estimatedInsideMinutes)}
                                </div>
                                <div>
                                  <span className="font-semibold">Break Taken:</span>{" "}
                                  <span className="text-orange-600">✓{formatMinutes(breakTime)}</span>
                                  <span className="text-gray-500 text-xs ml-1">({formatBreakCount(breakCount)})</span>
                                </div>
                                <div>
                                  <span className="font-semibold">Net Working:</span>{" "}
                                  <span className="text-green-600">{formatMinutes(netWorkingTime)}</span>
                                </div>
                                <div>
                                  <span className="font-semibold">Confidence:</span>{" "}
                                  <span className={formatConfidence(presenceEstimate.confidence).color}>
                                    {formatConfidence(presenceEstimate.confidence).text}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          {flags?.length > 0 && (
                            <div className="mb-3">
                              <div className="font-semibold text-sm mb-1">Flags:</div>
                              <div className="flex flex-wrap gap-1">
                                {flags.map((flag) => (
                                  <span key={flag} className="px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700">
                                    {formatFlags([flag])}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            {comments && (
                              <button
                                onClick={() => setOpenComment(comments)}
                                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                              >
                                View Comment
                              </button>
                            )}
                            {presenceEstimate && (
                              <button
                                onClick={() => setSelectedPresenceEstimate(presenceEstimate)}
                                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {filteredAttendanceData.map(
                  ({ id, date, day, status, punchIn, punchOut, flags, comments, presenceEstimate }, index) => {
                    const breakTime = calculateTotalBreakTime(presenceEstimate);
                    const breakCount = calculateBreakCount(presenceEstimate);
                    const netWorkingTime = calculateNetWorkingTime(presenceEstimate);
                    
                    return (
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
                            <span className={getStatusColor(status).replace("bg", "text")}>
                              {formatStatus(status)}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Check-In:</span> {punchIn || "-"}
                          </div>
                          <div>
                            <span className="font-semibold">Check-Out:</span> {punchOut || "-"}
                          </div>
                          {presenceEstimate?.estimatedInsideMinutes && (
                            <>
                              <div className="col-span-2">
                                <span className="font-semibold">Office Hours:</span>{" "}
                                {formatMinutes(presenceEstimate.estimatedInsideMinutes)}
                              </div>
                              <div className="col-span-2">
                                <span className="font-semibold">Est. Time:</span>{" "}
                                {presenceEstimate.estimatedInsideStart?.split(" ")[1] || "-"} - {presenceEstimate.estimatedInsideEnd?.split(" ")[1] || "-"}
                              </div>
                              {breakTime > 0 && (
                                <div className="col-span-2">
                                  <span className="font-semibold">Break Taken:</span>{" "}
                                  <span className="text-orange-600">✓{formatMinutes(breakTime)}</span>
                                  <span className="text-gray-500 text-xs ml-1">({formatBreakCount(breakCount)})</span>
                                </div>
                              )}
                              {netWorkingTime > 0 && (
                                <div className="col-span-2">
                                  <span className="font-semibold">Net Working:</span>{" "}
                                  <span className="text-green-600">{formatMinutes(netWorkingTime)}</span>
                                </div>
                              )}
                            </>
                          )}
                          <div className="col-span-2">
                            <span className="font-semibold">Flags:</span>{" "}
                            {formatFlags(flags)}
                          </div>
                          <div className="col-span-2 flex gap-2 mt-1">
                            {comments && (
                              <button
                                onClick={() => setOpenComment(comments)}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                View Comment
                              </button>
                            )}
                            {presenceEstimate && (
                              <button
                                onClick={() => setSelectedPresenceEstimate(presenceEstimate)}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}

          {/* Regenerate Confirmation Dialog */}
          {showRegenerateDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-xl border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-yellow-900">
                  Confirm Regenerate Attendance
                </h2>
                <p className="mb-6 text-yellow-700">
                  This will overwrite your existing attendance data for the selected filter.
                  Are you sure you want to continue?
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
            <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
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

          {/* Presence Estimate Details Modal */}
          {selectedPresenceEstimate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSelectedPresenceEstimate(null)}
              />
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 animate-fadeIn">
                <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-2xl">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Presence Estimate Details
                  </h3>
                  <button
                    onClick={() => setSelectedPresenceEstimate(null)}
                    className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-500">First Raw Punch</div>
                      <div className="text-base">{selectedPresenceEstimate.firstRawPunch || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500">Last Raw Punch</div>
                      <div className="text-base">{selectedPresenceEstimate.lastRawPunch || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500">Estimated Inside Start</div>
                      <div className="text-base">{selectedPresenceEstimate.estimatedInsideStart || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500">Estimated Inside End</div>
                      <div className="text-base">{selectedPresenceEstimate.estimatedInsideEnd || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500">Office Hours</div>
                      <div className="text-base">
                        {selectedPresenceEstimate.estimatedInsideMinutes
                          ? formatMinutes(selectedPresenceEstimate.estimatedInsideMinutes)
                          : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500">Break Taken</div>
                      <div className="text-base text-orange-600">
                        ✓{formatMinutes(calculateTotalBreakTime(selectedPresenceEstimate))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500">Net Working Time</div>
                      <div className="text-base text-green-600">
                        {formatMinutes(calculateNetWorkingTime(selectedPresenceEstimate))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500">Confidence</div>
                      <div className={`text-base font-semibold ${formatConfidence(selectedPresenceEstimate.confidence).color}`}>
                        {formatConfidence(selectedPresenceEstimate.confidence).text}
                      </div>
                    </div>
                  </div>

                  {/* Flags */}
                  {selectedPresenceEstimate.flags?.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-2">Processing Flags</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPresenceEstimate.flags.map((flag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                            {flag.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clusters Information */}
                  {selectedPresenceEstimate.clusters && (
                    <div className="space-y-4">
                      <div className="text-sm font-semibold text-gray-500 border-t pt-4">Punch Clusters</div>
                      
                      {/* Arrival Cluster */}
                      {selectedPresenceEstimate.clusters.arrival && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="font-semibold text-green-800 mb-2">Arrival Boundary</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div><span className="text-gray-600">First Punch:</span> {selectedPresenceEstimate.clusters.arrival.firstPunchLocal}</div>
                            <div><span className="text-gray-600">Last Punch:</span> {selectedPresenceEstimate.clusters.arrival.lastPunchLocal}</div>
                            <div><span className="text-gray-600">Chosen Boundary:</span> {selectedPresenceEstimate.clusters.arrival.chosenBoundaryLocal}</div>
                            <div><span className="text-gray-600">Punch Count:</span> {selectedPresenceEstimate.clusters.arrival.punchCount}</div>
                            <div className="col-span-2"><span className="text-gray-600">Selection Rule:</span> {selectedPresenceEstimate.clusters.arrival.selectionRule}</div>
                          </div>
                        </div>
                      )}

                      {/* Exit Cluster */}
                      {selectedPresenceEstimate.clusters.exit && (
                        <div className="bg-red-50 rounded-lg p-3">
                          <div className="font-semibold text-red-800 mb-2">Exit Boundary</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div><span className="text-gray-600">First Punch:</span> {selectedPresenceEstimate.clusters.exit.firstPunchLocal}</div>
                            <div><span className="text-gray-600">Last Punch:</span> {selectedPresenceEstimate.clusters.exit.lastPunchLocal}</div>
                            <div><span className="text-gray-600">Chosen Boundary:</span> {selectedPresenceEstimate.clusters.exit.chosenBoundaryLocal}</div>
                            <div><span className="text-gray-600">Punch Count:</span> {selectedPresenceEstimate.clusters.exit.punchCount}</div>
                            <div className="col-span-2"><span className="text-gray-600">Selection Rule:</span> {selectedPresenceEstimate.clusters.exit.selectionRule}</div>
                          </div>
                        </div>
                      )}

                      {/* Middle Clusters (Breaks) */}
                      {selectedPresenceEstimate.clusters.middle?.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <div className="font-semibold text-yellow-800 mb-2">
                            Break Clusters ({selectedPresenceEstimate.clusters.middle.length} total punches)
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Total Break Time: <span className="text-orange-600 font-semibold">
                              {formatMinutes(calculateTotalBreakTime(selectedPresenceEstimate))}
                            </span>
                            ({calculateBreakCount(selectedPresenceEstimate)} actual break{calculateBreakCount(selectedPresenceEstimate) !== 1 ? "s" : ""})
                          </div>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {(() => {
                              // Merge breaks for display
                              const breakIntervals = [];
                              selectedPresenceEstimate.clusters.middle.forEach((cluster) => {
                                if (cluster.firstPunchLocal && cluster.lastPunchLocal) {
                                  const start = parseTimeToMinutes(cluster.firstPunchLocal);
                                  const end = parseTimeToMinutes(cluster.lastPunchLocal);
                                  breakIntervals.push({ 
                                    start, 
                                    end, 
                                    startStr: cluster.firstPunchLocal.split(" ")[1],
                                    endStr: cluster.lastPunchLocal.split(" ")[1],
                                    punchCount: cluster.punchCount
                                  });
                                }
                              });
                              
                              breakIntervals.sort((a, b) => a.start - b.start);
                              
                              // Merge for display
                              const merged = [];
                              const MERGE_THRESHOLD = 10;
                              for (const interval of breakIntervals) {
                                if (merged.length === 0) {
                                  merged.push({ ...interval });
                                } else {
                                  const last = merged[merged.length - 1];
                                  if (interval.start <= last.end + MERGE_THRESHOLD) {
                                    last.end = Math.max(last.end, interval.end);
                                    last.endStr = interval.endStr;
                                    last.punchCount += interval.punchCount;
                                  } else {
                                    merged.push({ ...interval });
                                  }
                                }
                              }
                              
                              return merged.map((breakPeriod, idx) => (
                                <div key={idx} className="border-t border-yellow-200 pt-2 first:border-t-0 first:pt-0">
                                  <div className="text-sm">
                                    <div className="font-medium">Break {idx + 1}:</div>
                                    <div>Time: {breakPeriod.startStr} - {breakPeriod.endStr}</div>
                                    <div>Duration: <span className="text-orange-600">{formatMinutes(breakPeriod.end - breakPeriod.start)}</span></div>
                                    <div>Total Punches: {breakPeriod.punchCount}</div>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {selectedPresenceEstimate.clusters.notes?.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="font-semibold text-blue-800 mb-2">Notes</div>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {selectedPresenceEstimate.clusters.notes.map((note, idx) => (
                              <li key={idx} className="text-gray-700">{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-gray-400 border-t pt-3 mt-3">
                    <div>Algorithm Version: {selectedPresenceEstimate.algorithmVersion}</div>
                    <div>Computed At: {selectedPresenceEstimate.computedAt}</div>
                  </div>
                </div>

                <div className="sticky bottom-0 px-6 py-4 border-t flex justify-end bg-slate-50 rounded-b-2xl">
                  <button
                    onClick={() => setSelectedPresenceEstimate(null)}
                    className="px-5 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comment Modal */}
          {openComment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpenComment(null)}
              />
              <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl border border-slate-200 animate-fadeIn">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Comment Details
                  </h3>
                  <button
                    onClick={() => setOpenComment(null)}
                    className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="px-6 py-5 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto">
                  {openComment}
                </div>
                <div className="px-6 py-4 border-t flex justify-end bg-slate-50 rounded-b-2xl">
                  <button
                    onClick={() => setOpenComment(null)}
                    className="px-5 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition"
                  >
                    Close
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