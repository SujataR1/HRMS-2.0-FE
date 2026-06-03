// import React, { useEffect, useState } from "react";
// import HRSidebar from "../../components/Common/HRSidebar";

// const HRAttendance = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmpId, setSelectedEmpId] = useState("");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [editEntry, setEditEntry] = useState(null);
//   const [loadingEmployees, setLoadingEmployees] = useState(true);
//   const [loadingAttendance, setLoadingAttendance] = useState(false);
//   const [loadingSave, setLoadingSave] = useState(false);
//   const [error, setError] = useState("");
//   const [filterType, setFilterType] = useState("today");
//   const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
//   const currentYear = new Date().getFullYear();
//   const [filterYear, setFilterYear] = useState(currentYear);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");



//   const formatTime = (time) => {
//     if (!time) return "-";

//     // If already in am/pm format, return as is
//     if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) {
//       return time;
//     }

//     // Otherwise, parse 24-hour format and convert
//     const [hourStr, minuteStr] = time.split(":");
//     let hour = parseInt(hourStr, 10);
//     const ampm = hour >= 12 ? "pm" : "am";
//     hour = hour % 12 || 12;
//     return `${hour.toString().padStart(2, "0")}:${minuteStr.padStart(2, "0")}:00 ${ampm}`;
//   };
//   const formatLocalDate = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   };

//   // Update date range based on selected filter
//   useEffect(() => {
//     const now = new Date();
//     let start, end;

//     if (filterType === "today") {
//       const d = new Date(
//         now.getTime() - now.getTimezoneOffset() * 60000
//       ).toISOString().slice(0, 10);

//       start = end = d;
//     } else if (filterType === "month") {
//       const year = filterYear;
//       const month = filterMonth; // 1-12

//       const startDateObj = new Date(year, month - 1, 1); // ✅ Corrected
//       const today = new Date();
//       const isCurrentMonth =
//         today.getFullYear() === year && today.getMonth() === month - 1;

//       const endDateObj = isCurrentMonth
//         ? today
//         : new Date(year, month, 0); // ✅ Last day of selected month

//       start = formatLocalDate(startDateObj);
//       end = formatLocalDate(endDateObj);

//     } else {
//       start = `${filterYear}-01-01`;
//       end = `${filterYear}-12-31`;
//     }

//     setStartDate(start);
//     setEndDate(end);
//   }, [filterType, filterMonth, filterYear]);


//   // Fetch employees
//   useEffect(() => {
//     fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//       },
//     })
//       .then((res) => res.json().then((d) => (res.ok ? d.data : Promise.reject(d.message))))
//       .then(setEmployees)
//       .catch((err) => setError(err))
//       .finally(() => setLoadingEmployees(false));
//   }, []);

//   const fetchAttendance = async () => {
//     if (!selectedEmpId) {
//       alert("⚠️ Employee is required");
//       return;
//     }

//     if (filterType === "month") {
//       if (!filterMonth) {
//         alert("⚠️ Month is required");
//         return;
//       }
//       if (!filterYear) {
//         alert("⚠️ Year is required");
//         return;
//       }
//     }

//     if (filterType === "year" && !filterYear) {
//       alert("⚠️ Year is required");
//       return;
//     }

//     setError("");
//     setLoadingAttendance(true);
//     setAttendanceData([]);

//     try {
//       const res = await fetch("https://backend.hrms.transev.site/hr/attendance/view", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//         },
//         body: JSON.stringify({
//           employeeId: selectedEmpId,
//           startDate,
//           endDate,
//         }),
//       });

//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message || "Failed to fetch attendance");

//       // Create a map for quick access
//       const dataMap = {};
//       (json.data || []).forEach((entry) => {
//         dataMap[entry.date] = entry;
//       });

//       // Create full date range and fill missing days
//       const fullData = [];
//       let current = new Date(startDate);
//       const last = new Date(endDate);
//       const todayStr = new Date().toISOString().slice(0, 10);

//       while (current <= last) {
//         const dateStr = current.toISOString().slice(0, 10);

//         // Prevent showing future dates
//         if (dateStr > todayStr) break;

//         const entry = dataMap[dateStr];
//         fullData.push({
//           id: entry?.id || dateStr,
//           date: dateStr,
//           punchIn: entry?.punchIn || null,
//           punchOut: entry?.punchOut || null,
//           status: entry?.status || "absent",
//           comments: entry?.comments || "",
//           flags: entry?.flags || [],   // ✅ ADD THIS
//         });


//         current.setDate(current.getDate() + 1);
//       }

//       setAttendanceData(fullData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingAttendance(false);
//     }
//   };


//   const saveAttendance = async () => {
//     if (!editEntry) return;
//     setLoadingSave(true);
//     setError("");

//     try {
//       const attendanceDate = `${editEntry.date}T00:00:00.000Z`;

//       const formatToISO = (dateStr, timeStr) => {
//         if (!timeStr) return null; // prevent crash
//         const [hour, minute] = timeStr.split(":");
//         const date = new Date(dateStr);
//         date.setHours(parseInt(hour, 10));
//         date.setMinutes(parseInt(minute, 10));
//         date.setSeconds(0);
//         date.setMilliseconds(0);
//         return date.toISOString();
//       };

//       const punchInISO = formatToISO(editEntry.date, editEntry.punchIn);
//       const punchOutISO = formatToISO(editEntry.date, editEntry.punchOut);

//       const payload = {
//         employeeId: selectedEmpId,
//         attendanceDate,
//         status: editEntry.status,
//         flags: ["manualEntry", "edited"],
//         comments: editEntry.comments,
//       };

//       if (punchInISO) payload.punchIn = punchInISO;
//       if (punchOutISO) payload.punchOut = punchOutISO;

//       // ✅ make sure res is defined here
//       const res = await fetch(
//         "https://backend.hrms.transev.site/hr/edit-attendance-entry",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const json = await res.json();
//       if (!res.ok || json.status !== "success") throw new Error(json.message || "Save failed");

//       setAttendanceData((prev) =>
//         prev.map((it) => (it.id === editEntry.id ? { ...editEntry } : it))
//       );
//       setEditEntry(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingSave(false);
//     }
//   };

//   const getStatusLabel = (status) => {
//     const labels = {
//       fullDay: "Full Day",
//       halfDay: "Half Day",
//       weeklyOff: "Weekly Off",
//       holiday: "Holiday",
//       absent: "Absent",
//     };
//     return labels[status] || status;
//   };


//   const formatFlags = (flags) => {
//     if (!flags || flags.length === 0) return "-";
//     return flags
//       .map((f) =>
//         f
//           .replace(/([A-Z])/g, " $1")
//           .replace(/^./, (c) => c.toUpperCase())
//       )
//       .join(", ");
//   };


//   return (
//     <div className="flex min-h-screen bg-yellow-50">
//       <HRSidebar />
//       <main className="ml-64 flex-1 p-8">
//         <div className="bg-white shadow-lg rounded-2xl border border-yellow-200 p-8 space-y-6 max-w-5xl mx-auto">
//           <h1 className="text-3xl font-bold text-yellow-800 text-center">Attendance Check</h1>

//           {loadingEmployees ? (
//             <p className="text-yellow-600 animate-pulse text-center">Loading employees...</p>
//           ) : error ? (
//             <p className="text-red-600 text-center">{error}</p>
//           ) : (
//             <>
//               <div className="flex flex-wrap gap-4 items-end">
//                 {/* Employee */}
//                 <div className="flex-1">
//                   <label className="block text-yellow-900 font-semibold mb-1">Employee</label>
//                   <select
//                     className="w-full border rounded-lg px-3 py-2"
//                     value={selectedEmpId}
//                     onChange={(e) => setSelectedEmpId(e.target.value)}
//                   >
//                     <option value="">-- Select --</option>
//                     {employees.map((e) => (
//                       <option key={e.employeeId} value={e.employeeId}>
//                         {e.name} ({e.employeeId})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Filter Type */}
//                 <div>
//                   <label className="block text-yellow-900 font-semibold mb-1">Filter</label>
//                   <select
//                     className="border rounded-lg px-3 py-2"
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                   >
//                     <option value="today">Today</option>
//                     <option value="month">Month</option>
//                     <option value="year">Year</option>
//                   </select>
//                 </div>

//                 {/* Month Selector */}
//                 {filterType === "month" && (
//                   <div>
//                     <label className="block text-yellow-900 font-semibold mb-1">Month</label>
//                     <select
//                       className="border rounded-lg px-3 py-2"
//                       value={filterMonth}
//                       onChange={(e) => setFilterMonth(Number(e.target.value))}
//                     >
//                       {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
//                         <option key={m} value={m}>
//                           {new Date(0, m - 1).toLocaleString("en-US", { month: "long" })}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {/* Year Selector */}
//                 {filterType === "year" && (
//                   <div>
//                     <label className="block text-yellow-900 font-semibold mb-1">Year</label>
//                     <select
//                       className="border rounded-lg px-3 py-2"
//                       value={filterYear}
//                       onChange={(e) => setFilterYear(Number(e.target.value))}
//                     >
//                       {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
//                         <option key={y} value={y}>
//                           {y}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {/* Fetch Button */}
//                 <div>
//                   <button
//                     onClick={fetchAttendance}
//                     disabled={loadingAttendance}
//                     className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
//                   >
//                     {loadingAttendance ? "Fetching..." : "Fetch"}
//                   </button>
//                 </div>
//               </div>

//               {/* Results */}
//               {attendanceData.length === 0 && !loadingAttendance ? (
//                 <p className="text-yellow-700 italic text-center mt-6">No records found</p>
//               ) : (
//                 <table className="w-full border divide-y divide-yellow-200 mt-6">
//                   <thead className="bg-yellow-100">
//                     <tr>
//                       <th className="px-4 py-2 text-left text-yellow-800 font-semibold">SL</th> {/* Added SL header */}
//                       {["Date", "Punch In", "Punch Out", "Status", "Flags", "Comments", "Action"].map((h) => (
//                         <th key={h} className="px-4 py-2 text-left text-yellow-800 font-semibold">
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-yellow-100">
//                     {attendanceData.map((row, index) => (
//                       <tr key={row.id} className="hover:bg-yellow-50">
//                         <td className="px-4 py-2">
//                           {filterType === "year" ? index + 1 : new Date(row.date).getDate()}
//                         </td>


//                         <td className="px-4 py-2">{row.date}</td>
//                         <td className="px-4 py-2">{formatTime(row.punchIn)}</td>
//                         <td className="px-4 py-2">{formatTime(row.punchOut)}</td>
//                         <td className="px-4 py-2">{getStatusLabel(row.status)}</td>
//                         <td className="px-4 py-2">{formatFlags(row.flags)}</td>   {/* ✅ FLAGS */}
//                         <td className="px-4 py-2">{row.comments || "-"}</td>

//                         <td className="px-4 py-2">
//                           <button
//                             onClick={() => setEditEntry(row)}
//                             className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                           >
//                             Edit
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}

//               {/* Edit Modal */}
//               {editEntry && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                   <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//                     <h2 className="text-xl font-bold text-yellow-900 mb-4">
//                       Edit ({editEntry.date})
//                     </h2>

//                     {["punchIn", "punchOut", "status", "comments"].map((field) => (
//                       <div key={field} className="mb-4">
//                         <label className="block font-semibold text-yellow-900 mb-1">
//                           {field.replace(/([A-Z])/g, " $1").toUpperCase()}
//                         </label>
//                         {field === "comments" ? (
//                           <textarea
//                             rows={3}
//                             className="w-full border rounded px-3 py-2"
//                             value={editEntry.comments}
//                             onChange={(e) =>
//                               setEditEntry((prev) => ({ ...prev, comments: e.target.value }))
//                             }
//                           />
//                         ) : field === "status" ? (
//                           <select
//                             className="w-full border rounded px-3 py-2"
//                             value={editEntry.status}
//                             onChange={(e) =>
//                               setEditEntry((prev) => ({ ...prev, status: e.target.value }))
//                             }
//                           >
//                             <option value="fullDay">Full Day</option>
//                             <option value="halfDay">Half Day</option>
//                             <option value="weeklyOff">Weekly Off</option>
//                             <option value="holiday">Holiday</option>
//                             <option value="absent">Absent</option>
//                           </select>

//                         ) : (
//                           <input
//                             type="time"
//                             className="w-full border rounded px-3 py-2"
//                             value={editEntry[field] || ""}   // ⬅️ prevent crash if null
//                             onChange={(e) =>
//                               setEditEntry((prev) => ({ ...prev, [field]: e.target.value }))
//                             }
//                           />

//                         )}
//                       </div>
//                     ))}

//                     <div className="flex justify-end space-x-4">
//                       <button
//                         onClick={() => setEditEntry(null)}
//                         disabled={loadingSave}
//                         className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={saveAttendance}
//                         disabled={loadingSave}
//                         className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//                       >
//                         {loadingSave ? "Saving..." : "Save"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HRAttendance;

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
  const [filterType, setFilterType] = useState("today");
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const currentYear = new Date().getFullYear();
  const [filterYear, setFilterYear] = useState(currentYear);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Break policy constants
  const TARGET_BREAK_MINUTES = 60; // 1 hour target break
  const PRODUCTIVE_BASELINE_MIN = 480; // 8 hours productive work (office minutes - break = productive)

  // Helper: Calculate break minutes from attendance record
  const calculateBreakMinutes = (record) => {
    const officeMins = record.durationInOfficeMinutes;
    if (!officeMins || officeMins === 0) return 0;
    
    const status = record.status;
    const isOffDay = (status === 'weeklyOff' || status === 'holiday' || status === 'absent');
    
    // No break for off days or days without proper punches
    if (isOffDay || !record.punchIn || !record.punchOut) return 0;
    
    // For half-day or very short days, break is minimal
    if (status === 'halfDay' || officeMins < 300) {
      return Math.max(0, Math.min(officeMins - 240, 30));
    }
    
    // Standard calculation: break = office minutes - productive baseline (480 min)
    // If office minutes = 540 (9 hours), break = 60 min (perfect)
    // If office minutes = 500, break = 20 min (took less break)
    let breakVal = Math.max(0, officeMins - PRODUCTIVE_BASELINE_MIN);
    // Cap break at 120 minutes (2 hours) for sanity
    breakVal = Math.min(breakVal, 120);
    return Math.round(breakVal);
  };

  // Format break time display
  const formatBreakTime = (minutes) => {
    if (!minutes || minutes <= 0) return "-";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins > 0 ? mins + 'm' : ''}`;
    return `${mins}m`;
  };

  // Get break status indicator (whether employee took too much or too little break)
  const getBreakStatus = (breakTaken) => {
    if (breakTaken === 0) return { text: "No break", color: "text-gray-400" };
    if (breakTaken > TARGET_BREAK_MINUTES + 15) return { text: "Excess break", color: "text-red-600", icon: "⚠️" };
    if (breakTaken < TARGET_BREAK_MINUTES - 15 && breakTaken > 0) return { text: "Short break", color: "text-orange-500", icon: "⚡" };
    return { text: "Optimal", color: "text-green-600", icon: "✓" };
  };

  const formatTime = (time) => {
    if (!time) return "-";
    if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) {
      return time;
    }
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minuteStr.padStart(2, "0")}:00 ${ampm}`;
  };

  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Update date range based on selected filter
  useEffect(() => {
    const now = new Date();
    let start, end;

    if (filterType === "today") {
      const d = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString().slice(0, 10);
      start = end = d;
    } else if (filterType === "month") {
      const year = filterYear;
      const month = filterMonth;
      const startDateObj = new Date(year, month - 1, 1);
      const today = new Date();
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month - 1;
      const endDateObj = isCurrentMonth ? today : new Date(year, month, 0);
      start = formatLocalDate(startDateObj);
      end = formatLocalDate(endDateObj);
    } else {
      start = `${filterYear}-01-01`;
      end = `${filterYear}-12-31`;
      const todayStr = formatLocalDate(new Date());
      if (end > todayStr) end = todayStr;
    }
    setStartDate(start);
    setEndDate(end);
  }, [filterType, filterMonth, filterYear]);

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

  // Calculate summary statistics (total break, avg break, etc.)
  const calculateSummaryStats = (data) => {
    const validDays = data.filter(record => 
      record.punchIn && record.punchOut && 
      (record.status === 'fullDay' || record.status === 'halfDay' || record.status === 'overtime')
    );
    
    const totalBreak = validDays.reduce((sum, record) => sum + (record.breakTaken || 0), 0);
    const avgBreak = validDays.length ? Math.round(totalBreak / validDays.length) : 0;
    const excessBreakDays = validDays.filter(record => (record.breakTaken || 0) > TARGET_BREAK_MINUTES + 10).length;
    const totalOfficeMinutes = data.reduce((sum, record) => sum + (record.durationInOfficeMinutes || 0), 0);
    
    return { totalBreak, avgBreak, excessBreakDays, totalOfficeMinutes, validDaysCount: validDays.length };
  };

  const fetchAttendance = async () => {
    if (!selectedEmpId) {
      alert("⚠️ Employee is required");
      return;
    }
    if (filterType === "month") {
      if (!filterMonth) { alert("⚠️ Month is required"); return; }
      if (!filterYear) { alert("⚠️ Year is required"); return; }
    }
    if (filterType === "year" && !filterYear) {
      alert("⚠️ Year is required");
      return;
    }

    setError("");
    setLoadingAttendance(true);
    setAttendanceData([]);

    try {
      const res = await fetch("https://backend.hrms.transev.site/hr/attendance/view", {
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
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch attendance");

      const dataMap = {};
      (json.data || []).forEach((entry) => {
        dataMap[entry.date] = entry;
      });

      const fullData = [];
      let current = new Date(startDate);
      const last = new Date(endDate);
      const todayStr = new Date().toISOString().slice(0, 10);

      while (current <= last) {
        const dateStr = current.toISOString().slice(0, 10);
        if (dateStr > todayStr) break;

        const entry = dataMap[dateStr];
        const enrichedEntry = {
          id: entry?.id || dateStr,
          date: dateStr,
          punchIn: entry?.punchIn || null,
          punchOut: entry?.punchOut || null,
          durationInOfficeMinutes: entry?.durationInOfficeMinutes || 0,
          status: entry?.status || "absent",
          comments: entry?.comments || "",
          flags: entry?.flags || [],
        };
        // Add calculated break minutes
        enrichedEntry.breakTaken = calculateBreakMinutes(enrichedEntry);
        fullData.push(enrichedEntry);
        current.setDate(current.getDate() + 1);
      }

      setAttendanceData(fullData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const saveAttendance = async () => {
    if (!editEntry) return;
    setLoadingSave(true);
    setError("");

    try {
      const attendanceDate = `${editEntry.date}T00:00:00.000Z`;

      const formatToISO = (dateStr, timeStr) => {
        if (!timeStr) return null;
        const [hour, minute] = timeStr.split(":");
        const date = new Date(dateStr);
        date.setHours(parseInt(hour, 10));
        date.setMinutes(parseInt(minute, 10));
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.toISOString();
      };

      const punchInISO = formatToISO(editEntry.date, editEntry.punchIn);
      const punchOutISO = formatToISO(editEntry.date, editEntry.punchOut);

      const payload = {
        employeeId: selectedEmpId,
        attendanceDate,
        status: editEntry.status,
        flags: ["manualEntry", "edited"],
        comments: editEntry.comments,
      };
      if (punchInISO) payload.punchIn = punchInISO;
      if (punchOutISO) payload.punchOut = punchOutISO;

      const res = await fetch("https://backend.hrms.transev.site/hr/edit-attendance-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.status !== "success") throw new Error(json.message || "Save failed");

      // Recalculate break for the updated entry
      const updatedEntry = { ...editEntry };
      updatedEntry.breakTaken = calculateBreakMinutes(updatedEntry);
      
      setAttendanceData((prev) =>
        prev.map((it) => (it.id === editEntry.id ? updatedEntry : it))
      );
      setEditEntry(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSave(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      fullDay: "Full Day",
      halfDay: "Half Day",
      weeklyOff: "Weekly Off",
      holiday: "Holiday",
      absent: "Absent",
      overtime: "Overtime",
      approvedLeave: "Approved Leave",
    };
    return labels[status] || status;
  };

  const formatFlags = (flags) => {
    if (!flags || flags.length === 0) return "-";
    return flags
      .map((f) => f.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()))
      .join(", ");
  };

  const stats = calculateSummaryStats(attendanceData);

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <HRSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="bg-white shadow-lg rounded-2xl border border-yellow-200 p-8 space-y-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-800 text-center">
            Attendance & Break Tracker
          </h1>

          {loadingEmployees ? (
            <p className="text-yellow-600 animate-pulse text-center">Loading employees...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-yellow-900 font-semibold mb-1">Employee</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {employees.map((e) => (
                      <option key={e.employeeId} value={e.employeeId}>
                        {e.name} ({e.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-yellow-900 font-semibold mb-1">Filter</label>
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="today">Today</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>

                {filterType === "month" && (
                  <>
                    <div>
                      <label className="block text-yellow-900 font-semibold mb-1">Month</label>
                      <select
                        className="border rounded-lg px-3 py-2"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(Number(e.target.value))}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <option key={m} value={m}>
                            {new Date(0, m - 1).toLocaleString("en-US", { month: "long" })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-yellow-900 font-semibold mb-1">Year</label>
                      <select
                        className="border rounded-lg px-3 py-2"
                        value={filterYear}
                        onChange={(e) => setFilterYear(Number(e.target.value))}
                      >
                        {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {filterType === "year" && (
                  <div>
                    <label className="block text-yellow-900 font-semibold mb-1">Year</label>
                    <select
                      className="border rounded-lg px-3 py-2"
                      value={filterYear}
                      onChange={(e) => setFilterYear(Number(e.target.value))}
                    >
                      {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <button
                    onClick={fetchAttendance}
                    disabled={loadingAttendance}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                  >
                    {loadingAttendance ? "Fetching..." : "Fetch"}
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              {attendanceData.length > 0 && !loadingAttendance && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border-l-4 border-yellow-500">
                    <div className="text-yellow-700 text-sm font-medium">📊 Total Break</div>
                    <div className="text-2xl font-bold text-yellow-800">{formatBreakTime(stats.totalBreak)}</div>
                    <div className="text-xs text-stone-500">over {stats.validDaysCount} working days</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-yellow-100">
                    <div className="text-stone-600 text-sm"><i className="fas fa-mug-hot mr-1"></i> Avg Daily Break</div>
                    <div className="text-2xl font-semibold text-stone-800">{formatBreakTime(stats.avgBreak)}</div>
                    <div className="text-xs text-stone-400">target: 1h/day</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-yellow-100">
                    <div className="text-stone-600 text-sm"><i className="fas fa-flag-checkered"></i> Days &gt; 1h Break</div>
                    <div className="text-2xl font-semibold text-amber-700">{stats.excessBreakDays}</div>
                    <div className="text-xs text-stone-400">exceeded policy</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-yellow-100">
                    <div className="text-stone-600 text-sm"><i className="fas fa-building"></i> Total Office Hours</div>
                    <div className="text-2xl font-semibold text-stone-800">
                      {Math.floor(stats.totalOfficeMinutes / 60)}h {stats.totalOfficeMinutes % 60}m
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance Table */}
              {attendanceData.length === 0 && !loadingAttendance ? (
                <p className="text-yellow-700 italic text-center mt-6">No records found</p>
              ) : (
                <div className="overflow-x-auto mt-6">
                  <table className="w-full border divide-y divide-yellow-200">
                    <thead className="bg-yellow-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">SL</th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">Date</th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">Punch In</th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">Punch Out</th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">Office Hrs</th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">Status</th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold tooltip-info" title="Calculated break based on office duration (target: 60min/day)">
                          ⏱️ Break Taken
                        </th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">Flags</th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">Comments</th>
                        <th className="px-4 py-2 text-left text-yellow-800 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-yellow-100">
                      {attendanceData.map((row, index) => {
                        const breakStatus = getBreakStatus(row.breakTaken);
                        const officeHours = row.durationInOfficeMinutes || 0;
                        return (
                          <tr key={row.id} className="hover:bg-yellow-50">
                            <td className="px-4 py-2">{filterType === "year" ? index + 1 : new Date(row.date).getDate()}</td>
                            <td className="px-4 py-2">{row.date}</td>
                            <td className="px-4 py-2">{formatTime(row.punchIn)}</td>
                            <td className="px-4 py-2">{formatTime(row.punchOut)}</td>
                            <td className="px-4 py-2">{Math.floor(officeHours / 60)}h {officeHours % 60}m</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                row.status === 'fullDay' ? 'bg-green-100 text-green-700' :
                                row.status === 'halfDay' ? 'bg-orange-100 text-orange-700' :
                                row.status === 'weeklyOff' ? 'bg-gray-100 text-gray-600' :
                                row.status === 'holiday' ? 'bg-purple-100 text-purple-700' :
                                row.status === 'absent' ? 'bg-red-100 text-red-600' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {getStatusLabel(row.status)}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <span className={`${breakStatus.color} font-medium`}>
                                {breakStatus.icon && <span className="mr-1">{breakStatus.icon}</span>}
                                {formatBreakTime(row.breakTaken)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-xs">{formatFlags(row.flags)}</td>
                            <td className="px-4 py-2 max-w-xs truncate">{row.comments || "-"}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => setEditEntry(row)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Edit Modal */}
              {editEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold text-yellow-900 mb-4">
                      Edit Attendance ({editEntry.date})
                    </h2>
                    <p className="text-sm text-stone-500 mb-4">
                      Current break: {formatBreakTime(editEntry.breakTaken)} (will auto-recalculate on save)
                    </p>

                    {["punchIn", "punchOut", "status", "comments"].map((field) => (
                      <div key={field} className="mb-4">
                        <label className="block font-semibold text-yellow-900 mb-1">
                          {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </label>
                        {field === "comments" ? (
                          <textarea
                            rows={3}
                            className="w-full border rounded px-3 py-2"
                            value={editEntry.comments || ""}
                            onChange={(e) =>
                              setEditEntry((prev) => ({ ...prev, comments: e.target.value }))
                            }
                          />
                        ) : field === "status" ? (
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={editEntry.status}
                            onChange={(e) =>
                              setEditEntry((prev) => ({ ...prev, status: e.target.value }))
                            }
                          >
                            <option value="fullDay">Full Day</option>
                            <option value="halfDay">Half Day</option>
                            <option value="weeklyOff">Weekly Off</option>
                            <option value="holiday">Holiday</option>
                            <option value="absent">Absent</option>
                            <option value="overtime">Overtime</option>
                          </select>
                        ) : (
                          <input
                            type="time"
                            className="w-full border rounded px-3 py-2"
                            value={editEntry[field] || ""}
                            onChange={(e) =>
                              setEditEntry((prev) => ({ ...prev, [field]: e.target.value }))
                            }
                          />
                        )}
                      </div>
                    ))}

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setEditEntry(null)}
                        disabled={loadingSave}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveAttendance}
                        disabled={loadingSave}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        {loadingSave ? "Saving..." : "Save Changes"}
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