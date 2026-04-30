// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Tooltip as ReactTooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";

// import {
//   MdCheckCircle,
//   MdCancel,
//   MdWatchLater,
//   MdCalendarToday,
// } from "react-icons/md";
// import { FaMoon, FaSun, FaBars } from "react-icons/fa";
// import { Line, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   Legend,
//   Tooltip,
//   PointElement,
// } from "chart.js";
// import EmployeeSidebar from "../components/Common/EmployeeSidebar";

// ChartJS.register(
//   ArcElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   Legend,
//   Tooltip,
//   PointElement
// );

// const EmployeeDashboard = () => {
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem("darkMode");
//     return saved === "true";
//   });

//   useEffect(() => {
//     localStorage.setItem("darkMode", darkMode);
//   }, [darkMode]);

//   const [profile, setProfile] = useState(null);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Attendance counts
//   const [presentDays, setPresentDays] = useState(0);
//   const [absentDays, setAbsentDays] = useState(0);
//   const [lateEntries, setLateEntries] = useState(0);
//   const [weeklyOffCount, setWeeklyOffCount] = useState(0);
//   const [approvedLeavesCount, setApprovedLeavesCount] = useState(0);
//   const [holidaysCount, setHolidaysCount] = useState(0);
//   const [overtimeCount, setOvertimeCount] = useState(0);
//   const [totalCalendarDays, setTotalCalendarDays] = useState(0);

//   // Filters
//   const [filterType, setFilterType] = useState("monthYear");
//   const [filterMonthYear, setFilterMonthYear] = useState(
//     new Date().toISOString().slice(0, 7)
//   );
//   const [filterYear, setFilterYear] = useState(
//     new Date().getFullYear().toString()
//   );

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     fetchAttendance();
//   }, [filterType, filterMonthYear, filterYear]);
//   const sendMonthlyReport = async () => {
//     const token = localStorage.getItem("employee_token");
//     if (!token) {
//       setError("Unauthorized: Token not found. Please log in again.");
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
//           body: JSON.stringify({
//             monthYear: `${filterMonthYear.split("-")[1]}-${filterMonthYear.split("-")[0]}`
//           }),
//         }
//       );

//       const json = await res.json();

//       if (!res.ok) {
//         throw new Error(json?.error || "Failed to send monthly report");
//       }

//       alert(json.message || "Monthly report sent successfully.");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const fetchAttendance = async () => {
//     setLoading(true);
//     setError("");
//     const token = localStorage.getItem("employee_token");
//     if (!token) {
//       setLoading(false);
//       return setError("No token");
//     }

//     let bodyPayload;
//     if (filterType === "monthYear") {
//       const [year, month] = filterMonthYear.split("-");
//       bodyPayload = { monthYear: `${month}-${year}` };
//     } else {
//       bodyPayload = { year: filterYear };
//     }

//     try {
//       const res = await fetch(
//         "https://backend.hrms.transev.site/employee/attendance/view",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,

//             // Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(bodyPayload),
//         }
//       );
//       const result = await res.json();
//       if (result.status !== "success") throw new Error(result.message);

//       const today = new Date();
//       let present = 0,
//         absent = 0,
//         late = 0,
//         weeklyOffs = 0,
//         approvedLeaves = 0,
//         holidays = 0,
//         overtime = 0;

//       result.data.forEach((day) => {
//         const dayDate = new Date(day.date);
//         if (dayDate > today) return;

//         switch (day.status) {
//           case "fullDay":
//           case "halfDay":
//             present++;
//             if (day.flags?.includes("late")) late++;
//             break;

//           case "overtime":
//             present++;      
//             overtime++;     
//             break;
//           case "absent":
//             absent++;
//             break;
//           case "weeklyOff":
//             weeklyOffs++;
//             break;
//           case "approvedLeave":
//             approvedLeaves++;
//             break;
//           case "holiday":
//             // Add more holiday statuses here if any
//             holidays++;
//             break;
//           default:
//             break;
//         }
//       });

//       // ✅ TOTAL DAYS INCLUDING ALL STATUSES
//       const totalDays =
//         present +
//         absent +
//         approvedLeaves +
//         weeklyOffs +
//         holidays;

//       setTotalCalendarDays(totalDays);

//       setPresentDays(present);
//       setAbsentDays(absent);
//       setLateEntries(late);
//       setWeeklyOffCount(weeklyOffs);
//       setApprovedLeavesCount(approvedLeaves);
//       setHolidaysCount(holidays);
//       setOvertimeCount(overtime);
//     } catch (err) {
//       setError(err.message || "Error fetching attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`${darkMode ? "bg-gray-900 text-white" : "bg-yellow-50 text-gray-900"
//         } min-h-screen flex`}
//     >
//       {/* Sidebar Toggle (Mobile) */}
//       <button
//         className="fixed top-4 left-4 z-50 p-2 bg-yellow-500 text-white rounded-md md:hidden"
//         onClick={() => setSidebarOpen(true)}
//       >
//         <FaBars size={20} />
//       </button>

//       {/* Sidebar Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}


//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 z-50 shadow-lg transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
//           } md:translate-x-0 md:static`}
//       >
//         <EmployeeSidebar onClose={() => setSidebarOpen(false)} />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-4 md:p-2 md:ml-28 transition-all duration-300 w-full">
//         <header className="flex justify-between items-center flex-wrap gap-4 mb-8">
//           <h1 className="text-2xl font-bold">👋 Welcome Back</h1>
//           <div className="flex items-center gap-4">
//             {darkMode ? (
//               <FaSun
//                 className="cursor-pointer text-yellow-400"
//                 size={22}
//                 onClick={() => setDarkMode(false)}
//               />
//             ) : (
//               <FaMoon
//                 className="cursor-pointer text-gray-700"
//                 size={22}
//                 onClick={() => setDarkMode(true)}
//               />
//             )}
//             <div
//               className="flex items-center gap-2 cursor-pointer"
//               onClick={() => navigate("/MyProfile")}
//             >
//               <img
//                 src={profilePicture || "https://via.placeholder.com/40"}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full border-2 border-yellow-400"
//               />
//               <div>
//                 <div className="font-medium">
//                   {loading ? "Loading..." : profile?.name || "Employee"}
//                 </div>
//                 <div className="text-xs text-gray-500 dark:text-gray-400">
//                   Employee
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

// {/* filter of the attendance is set to a basic point  */}
//         {/* Filter */}
//         <section
//           className={`mb-6 p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"
//             }`}
//         >
//           {/*  */}
//           <h2 className="font-semibold mb-3">📅 Filter Attendance</h2>
//           <div className="flex flex-wrap gap-4">
//             <select
//               className="border rounded px-4 py-2"
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//             >
//               <option value="monthYear">By Month-Year</option>
//               <option value="year">By Year</option>
//             </select>
//             {filterType === "monthYear" ? (
//               <input
//                 type="month"
//                 className="border rounded px-4 py-2"
//                 value={filterMonthYear}
//                 onChange={(e) => setFilterMonthYear(e.target.value)}
//               />
//             ) : (
//               <input
//                 type="number"
//                 min="2000"
//                 max="2100"
//                 className="border rounded px-4 py-2"
//                 value={filterYear}
//                 onChange={(e) => setFilterYear(e.target.value)}
//               />
//             )}

//             {/* ADD THIS HERE */}
//             {filterType === "monthYear" && (
//               <button
//                 onClick={sendMonthlyReport}
//                 className="relative text-sm font-semibold text-red-600 hover:text-red-700 border border-red-300 hover:border-red-500 rounded-full px-6 py-2.5 transition-all whitespace-nowrap
//              before:absolute before:inset-0 before:rounded-full before:border-2 before:border-red-400 before:animate-glow before:z-[-1]"
//               >
//                 Send Monthly Report
//               </button>

//             )}
//           </div>
//         </section>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         {/* Overview Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {overviewCards.map((item) => {
//             const values = {
//               "Present Days": presentDays,
//               "Absent Days": absentDays,
//               "Late Entries": lateEntries,
//               "Overtime Days": overtimeCount,
//               "Weekly Offs": weeklyOffCount,
//               Holidays: holidaysCount,
//               "Approved Leaves": approvedLeavesCount,
//               "Total Days": totalCalendarDays,
//             };
//             return (
//               <div
//                 key={item.label}
//                 onClick={() =>
//                   navigate("/MyAttendance", {
//                     state: { type: item.label },
//                   })
//                 }
//                 className={`p-4 rounded-lg shadow cursor-pointer hover:scale-105 transition-transform
//     ${darkMode ? "bg-gray-800" : "bg-white"}`}
//               >
//                 <div className="text-3xl text-yellow-500 mb-2">{item.icon}</div>
//                 <div className="text-sm">{item.label}</div>
//                 <div className="text-xl font-bold">
//                   {loading ? "..." : values[item.label]}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div
//             className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"
//               }`}
//           >
//             <h2 className="font-semibold mb-2">📈 Working Hours Trend</h2>
//             <div className="w-full h-[300px]">
//               <Line
//                 data={lineData}
//                 options={{ maintainAspectRatio: false, responsive: true }}
//               />
//             </div>
//           </div>
//           <div
//             className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"
//               }`}
//           >
//             <h2 className="font-semibold mb-2">📊 Attendance Summary</h2>
//             <div className="w-full h-[300px]">
//               <Pie
//                 data={{
//                   labels: ["Present", "Absent", "Leave", "Holiday", "Weekly Off"],
//                   datasets: [
//                     {
//                       data: [
//                         presentDays,
//                         absentDays,
//                         approvedLeavesCount,
//                         holidaysCount,
//                         weeklyOffCount,
//                       ],
//                       backgroundColor: [
//                         "#6ed310f3 ",
//                         "#dd350aff",
//                         "#df7717ff",
//                         "#0ed3daf3 ",
//                         "#0c08ecff",
//                       ],
//                     },
//                   ],
//                 }}
//                 options={{ maintainAspectRatio: false, responsive: true }}
//               />
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default EmployeeDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCheckCircle,
  MdCancel,
  MdWatchLater,
  MdCalendarToday,
  MdTrendingUp,
  MdWork,
  MdEventAvailable,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { 
  FaSpinner, 
  FaChartLine, 
  FaFilter, 
  FaDownload,
  FaUserCircle,
  FaBell,
  FaRegClock,
} from "react-icons/fa";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement,
  Filler,
} from "chart.js";
import EmployeeSidebar from "../components/Common/EmployeeSidebar";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement,
  Filler
);

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Attendance counts
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [lateEntries, setLateEntries] = useState(0);
  const [weeklyOffCount, setWeeklyOffCount] = useState(0);
  const [approvedLeavesCount, setApprovedLeavesCount] = useState(0);
  const [holidaysCount, setHolidaysCount] = useState(0);
  const [overtimeCount, setOvertimeCount] = useState(0);
  const [totalCalendarDays, setTotalCalendarDays] = useState(0);

  // Filters
  const [filterType, setFilterType] = useState("monthYear");
  const [filterMonthYear, setFilterMonthYear] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filterType, filterMonthYear, filterYear]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("employee_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result.status === "success") {
        setProfile(result.data);
        if (result.data.profilePicture) setProfilePicture(result.data.profilePicture);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const sendMonthlyReport = async () => {
    const token = localStorage.getItem("employee_token");
    if (!token) {
      setError("Unauthorized: Token not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(
        "https://backend.hrms.transev.site/employee/attendance/send-monthly-reports",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ monthYear: `${filterMonthYear.split("-")[1]}-${filterMonthYear.split("-")[0]}` }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to send monthly report");
      alert(json.message || "Monthly report sent successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("employee_token");
    if (!token) {
      setLoading(false);
      return setError("No token");
    }

    let bodyPayload;
    if (filterType === "monthYear") {
      const [year, month] = filterMonthYear.split("-");
      bodyPayload = { monthYear: `${month}-${year}` };
    } else {
      bodyPayload = { year: filterYear };
    }

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/attendance/view", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      const result = await res.json();
      if (result.status !== "success") throw new Error(result.message);

      const today = new Date();
      let present = 0, absent = 0, late = 0, weeklyOffs = 0, approvedLeaves = 0, holidays = 0, overtime = 0;

      result.data.forEach((day) => {
        const dayDate = new Date(day.date);
        if (dayDate > today) return;

        switch (day.status) {
          case "fullDay": case "halfDay":
            present++;
            if (day.flags?.includes("late")) late++;
            break;
          case "overtime":
            present++;
            overtime++;
            break;
          case "absent":
            absent++;
            break;
          case "weeklyOff":
            weeklyOffs++;
            break;
          case "approvedLeave":
            approvedLeaves++;
            break;
          case "holiday":
            holidays++;
            break;
          default: break;
        }
      });

      const totalDays = present + absent + approvedLeaves + weeklyOffs + holidays;
      setTotalCalendarDays(totalDays);
      setPresentDays(present);
      setAbsentDays(absent);
      setLateEntries(late);
      setWeeklyOffCount(weeklyOffs);
      setApprovedLeavesCount(approvedLeaves);
      setHolidaysCount(holidays);
      setOvertimeCount(overtime);
    } catch (err) {
      setError(err.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const attendanceData = {
    labels: ["Present", "Absent", "Leave", "Holiday", "Week Off"],
    datasets: [
      {
        data: [presentDays, absentDays, approvedLeavesCount, holidaysCount, weeklyOffCount],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const weeklyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Hours Worked",
        data: [40, 38, 42, 36],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Overtime",
        data: [2, 1, 4, 0],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <EmployeeSidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500 text-sm">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Stat cards data
  const statCards = [
    { label: "Present", value: presentDays, icon: MdCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    { label: "Absent", value: absentDays, icon: MdCancel, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
    { label: "Late", value: lateEntries, icon: MdWatchLater, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    { label: "Overtime", value: overtimeCount, icon: MdTrendingUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    { label: "Weekly Off", value: weeklyOffCount, icon: FaRegClock, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    { label: "Holidays", value: holidaysCount, icon: MdEventAvailable, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
    { label: "Leaves", value: approvedLeavesCount, icon: MdWork, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
    { label: "Total Days", value: totalCalendarDays, icon: MdCalendarToday, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back, {profile?.name?.split(' ')[0] || "Employee"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <FaBell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{profile?.name || "Employee"}</p>
                  <p className="text-xs text-gray-400">Employee</p>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <FaUserCircle className="text-blue-500 text-2xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400 text-sm" />
                <span className="text-sm text-gray-600">Filter:</span>
              </div>
              <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="monthYear">Month-Year</option>
                <option value="year">Year</option>
              </select>
              {filterType === "monthYear" ? (
                <input
                  type="month"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
                  value={filterMonthYear}
                  onChange={(e) => setFilterMonthYear(e.target.value)}
                />
              ) : (
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none w-24"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                />
              )}
              {filterType === "monthYear" && (
                <button
                  onClick={sendMonthlyReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                >
                  <FaDownload size={12} />
                  Export Report
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, idx) => (
              <div
                key={idx}
                onClick={() => navigate("/MyAttendance", { state: { type: stat.label } })}
                className={`${stat.bg} ${stat.border} border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`${stat.color} text-xl`} />
                  <span className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Hours Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Weekly Hours</h3>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-blue-500"></div>
                    <span className="text-gray-500">Work Hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-amber-500"></div>
                    <span className="text-gray-500">Overtime</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <Line data={weeklyData} options={chartOptions} />
              </div>
            </div>

            {/* Attendance Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-medium text-gray-700 mb-4">Attendance Distribution</h3>
              <div className="h-64">
                <Pie data={attendanceData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-medium text-gray-700 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => navigate("/MyAttendance")}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <MdCalendarToday className="text-blue-500 text-lg mb-1" />
                <p className="text-sm font-medium text-gray-700">View Attendance</p>
                <p className="text-xs text-gray-400">Check your records</p>
              </button>
              <button
                onClick={() => navigate("/MyLeaves")}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <MdWork className="text-emerald-500 text-lg mb-1" />
                <p className="text-sm font-medium text-gray-700">Apply Leave</p>
                <p className="text-xs text-gray-400">Request time off</p>
              </button>
              <button
                onClick={() => navigate("/MyProfile")}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <FaUserCircle className="text-purple-500 text-lg mb-1" />
                <p className="text-sm font-medium text-gray-700">My Profile</p>
                <p className="text-xs text-gray-400">Update information</p>
              </button>
              <button
                onClick={() => navigate("/MyHoliday")}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <MdEventAvailable className="text-amber-500 text-lg mb-1" />
                <p className="text-sm font-medium text-gray-700">Holidays</p>
                <p className="text-xs text-gray-400">Upcoming holidays</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;