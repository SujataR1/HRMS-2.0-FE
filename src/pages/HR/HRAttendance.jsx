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



  const formatTime = (time) => {
    if (!time) return "-";

    // If already in am/pm format, return as is
    if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) {
      return time;
    }

    // Otherwise, parse 24-hour format and convert
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minuteStr.padStart(2, "0")}:00 ${ampm}`;
  };

  // Update date range based on selected filter
  useEffect(() => {
    const now = new Date();
    let start, end;

    if (filterType === "today") {
      const d = now.toISOString().slice(0, 10);
      start = end = d;
    } else if (filterType === "month") {
      const year = filterYear;
      const month = filterMonth; // 1-12

      const startDateObj = new Date(year, month - 1, 1); // ✅ Corrected
      const today = new Date();
      const isCurrentMonth =
        today.getFullYear() === year && today.getMonth() === month - 1;

      const endDateObj = isCurrentMonth
        ? today
        : new Date(year, month, 0); // ✅ Last day of selected month

      start = startDateObj.toISOString().slice(0, 10);
      end = endDateObj.toISOString().slice(0, 10);
    } else {
      start = `${filterYear}-01-01`;
      end = `${filterYear}-12-31`;
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

  const fetchAttendance = async () => {
    if (!selectedEmpId) {
      alert("⚠️ Employee is required");
      return;
    }

    if (filterType === "month") {
      if (!filterMonth) {
        alert("⚠️ Month is required");
        return;
      }
      if (!filterYear) {
        alert("⚠️ Year is required");
        return;
      }
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

      // Create a map for quick access
      const dataMap = {};
      (json.data || []).forEach((entry) => {
        dataMap[entry.date] = entry;
      });

      // Create full date range and fill missing days
      const fullData = [];
      let current = new Date(startDate);
      const last = new Date(endDate);
      const todayStr = new Date().toISOString().slice(0, 10);

      while (current <= last) {
        const dateStr = current.toISOString().slice(0, 10);

        // Prevent showing future dates
        if (dateStr > todayStr) break;

        const entry = dataMap[dateStr];
        fullData.push({
          id: entry?.id || dateStr,
          date: dateStr,
          punchIn: entry?.punchIn || null,
          punchOut: entry?.punchOut || null,
          status: entry?.status || "Holiday",
          comments: entry?.comments || "",
        });

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

      const res = await fetch("https://backend.hrms.transev.site/hr/edit-attendance-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmpId,
          attendanceDate,
          punchIn: new Date(`${editEntry.date}T${editEntry.punchIn}`).toISOString(),
          punchOut: new Date(`${editEntry.date}T${editEntry.punchOut}`).toISOString(),
          status: editEntry.status,
          flags: ["manualEntry", "edited"],
          comments: editEntry.comments,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.status !== "success") throw new Error(json.message || "Save failed");

      setAttendanceData((prev) =>
        prev.map((it) => (it.id === editEntry.id ? { ...editEntry } : it))
      );
      setEditEntry(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <HRSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="bg-white shadow-lg rounded-2xl border border-yellow-200 p-8 space-y-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-800 text-center">Attendance Check</h1>

          {loadingEmployees ? (
            <p className="text-yellow-600 animate-pulse text-center">Loading employees...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 items-end">
                {/* Employee */}
                <div className="flex-1">
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

                {/* Filter Type */}
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

                {/* Month Selector */}
                {filterType === "month" && (
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
                )}

                {/* Year Selector */}
                {filterType === "year" && (
                  <div>
                    <label className="block text-yellow-900 font-semibold mb-1">Year</label>
                    <select
                      className="border rounded-lg px-3 py-2"
                      value={filterYear}
                      onChange={(e) => setFilterYear(Number(e.target.value))}
                    >
                      {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Fetch Button */}
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

              {/* Results */}
              {attendanceData.length === 0 && !loadingAttendance ? (
                <p className="text-yellow-700 italic text-center mt-6">No records found</p>
              ) : (
                <table className="w-full border divide-y divide-yellow-200 mt-6">
                  <thead className="bg-yellow-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-yellow-800 font-semibold">SL</th> {/* Added SL header */}
                      {["Date", "Punch In", "Punch Out", "Status", "Comments", "Action"].map((h) => (
                        <th key={h} className="px-4 py-2 text-left text-yellow-800 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-100">
                    {attendanceData.map((row, index) => (
                      <tr key={row.id} className="hover:bg-yellow-50">
                        <td className="px-4 py-2">{new Date(row.date).getDate()}</td>

                        <td className="px-4 py-2">{row.date}</td>
                        <td className="px-4 py-2">{formatTime(row.punchIn)}</td>
                        <td className="px-4 py-2">{formatTime(row.punchOut)}</td>
                        <td className="px-4 py-2">{row.status}</td>
                        <td className="px-4 py-2">{row.comments || "-"}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => setEditEntry(row)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Edit Modal */}
              {editEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold text-yellow-900 mb-4">
                      Edit ({editEntry.date})
                    </h2>

                    {["punchIn", "punchOut", "status", "comments"].map((field) => (
                      <div key={field} className="mb-4">
                        <label className="block font-semibold text-yellow-900 mb-1">
                          {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </label>
                        {field === "comments" ? (
                          <textarea
                            rows={3}
                            className="w-full border rounded px-3 py-2"
                            value={editEntry.comments}
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
                            <option value="absent">Absent</option>
                          </select>
                        ) : (
                          <input
                            type="time"
                            className="w-full border rounded px-3 py-2"
                            value={editEntry[field]}
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

//   const [filters, setFilters] = useState({ employeeId: "", month: "" });
//   const [generating, setGenerating] = useState(false);
//   const [attendanceReady, setAttendanceReady] = useState(false);

//   const formatTime = (time) => {
//     if (!time) return "-";
//     if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) return time;
//     const [hourStr, minuteStr] = time.split(":");
//     let hour = parseInt(hourStr, 10);
//     const ampm = hour >= 12 ? "pm" : "am";
//     hour = hour % 12 || 12;
//     return `${hour.toString().padStart(2, "0")}:${minuteStr.padStart(2, "0")}:00 ${ampm}`;
//   };

//   useEffect(() => {
//     const now = new Date();
//     let start, end;

//     if (filterType === "today") {
//       const d = now.toISOString().slice(0, 10);
//       start = end = d;
//     } else if (filterType === "month") {
//       const year = filterYear;
//       const month = filterMonth - 1;
//       const startDateObj = new Date(year, month, 1);
//       const today = new Date();
//       const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
//       const endDateObj = isCurrentMonth ? today : new Date(year, month + 1, 0);
//       start = startDateObj.toISOString().slice(0, 10);
//       end = endDateObj.toISOString().slice(0, 10);
//     } else {
//       start = `${filterYear}-01-01`;
//       end = `${filterYear}-12-31`;
//     }

//     setStartDate(start);
//     setEndDate(end);
//   }, [filterType, filterMonth, filterYear]);

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

//   const handleGenerateAttendance = async () => {
//     if (!filters.employeeId || !filters.month) {
//       alert("Please fill both Employee ID and Month to generate attendance.");
//       return;
//     }

//     const token = localStorage.getItem("admin_token");
//     if (!token) {
//       alert("Admin authentication token missing. Please log in.");
//       return;
//     }

//     setGenerating(true);

//     try {
//       const response = await fetch("https://backend.hrms.transev.site/admin/attendance/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           employeeId: filters.employeeId,
//           monthYear: filters.month.split("-").reverse().join("-"),
//         }),
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         alert(result.message || "Attendance generated successfully.");
//         setAttendanceReady(true);
//         setSelectedEmpId(filters.employeeId);
//         setFilterType("month");

//         const date = new Date(filters.month);
//         setFilterMonth(date.getMonth() + 1);
//         setFilterYear(date.getFullYear());

//         setTimeout(() => fetchAttendance(), 1000);
//       } else {
//         alert("Failed: " + (result.message || result.error || "Unknown error"));
//       }
//     } catch (err) {
//       console.error("Error generating attendance:", err);
//       alert("An error occurred while generating attendance.");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const fetchAttendance = async () => {
//     if (!selectedEmpId) {
//       alert("⚠️ Employee is required");
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
//         body: JSON.stringify({ employeeId: selectedEmpId, startDate, endDate }),
//       });

//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message || "Failed to fetch attendance");

//       const dataMap = {};
//       (json.data || []).forEach((entry) => (dataMap[entry.date] = entry));

//       const fullData = [];
//       let current = new Date(startDate);
//       const last = new Date(endDate);
//       const todayStr = new Date().toISOString().slice(0, 10);

//       while (current <= last) {
//         const dateStr = current.toISOString().slice(0, 10);
//         if (dateStr > todayStr) break;

//         const entry = dataMap[dateStr];
//         fullData.push({
//           id: entry?.id || dateStr,
//           date: dateStr,
//           punchIn: entry?.punchIn || null,
//           punchOut: entry?.punchOut || null,
//           status: entry?.status || "Holiday",
//           comments: entry?.comments || "",
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

//       const res = await fetch("https://backend.hrms.transev.site/hr/edit-attendance-entry", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//         },
//         body: JSON.stringify({
//           employeeId: selectedEmpId,
//           attendanceDate,
//           punchIn: new Date(`${editEntry.date}T${editEntry.punchIn}`).toISOString(),
//           punchOut: new Date(`${editEntry.date}T${editEntry.punchOut}`).toISOString(),
//           status: editEntry.status,
//           flags: ["manualEntry", "edited"],
//           comments: editEntry.comments,
//         }),
//       });

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

//   return (
//     <div className="flex min-h-screen bg-yellow-50">
//       <HRSidebar />
//       <main className="ml-64 flex-1 p-8">
//         <div className="bg-white shadow-lg rounded-2xl border border-yellow-200 p-8 space-y-6 max-w-5xl mx-auto">
//           <h1 className="text-3xl font-bold text-yellow-800 text-center">Attendance Check</h1>

//           {/* Generate Attendance Section */}
//           <section className="mb-6">
//             <h3 className="text-xl font-bold text-yellow-700 mb-4 text-center">
//               Generate Attendance
//             </h3>
//             <div className="flex flex-wrap justify-center gap-4 items-center">
//               <select
//                 className="px-3 py-2 w-52 border border-yellow-500 rounded-md text-yellow-900"
//                 value={filters.employeeId}
//                 onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((e) => (
//                   <option key={e.employeeId} value={e.employeeId}>
//                     {e.name} ({e.employeeId})
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="month"
//                 value={filters.month}
//                 onChange={(e) => setFilters({ ...filters, month: e.target.value })}
//                 className="px-3 py-2 w-44 border border-yellow-500 rounded-md text-yellow-900"
//               />

//               <button
//                 onClick={handleGenerateAttendance}
//                 className={`px-5 py-2 font-bold rounded-md text-white ${
//                   generating ? "bg-yellow-400 cursor-not-allowed" : "bg-yellow-700 hover:bg-yellow-600"
//                 }`}
//                 disabled={generating}
//               >
//                 {generating ? "Generating..." : "Generate"}
//               </button>
//             </div>
//           </section>

//           {/* Attendance UI */}
//           {attendanceReady ? (
//             <>
//               {/* Your full attendance UI already written below — employee, filter, table, edit modal */}
//               {/* You can paste that entire block of UI back in here if needed */}
//               <p>✅ Attendance generated. You can now view and edit records.</p>
//             </>
//           ) : (
//             <p className="text-yellow-600 text-center italic">
//               Please generate attendance to continue.
//             </p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HRAttendance;
