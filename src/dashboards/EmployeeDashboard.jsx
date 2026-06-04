// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   MdCheckCircle,
//   MdCancel,
//   MdWatchLater,
//   MdCalendarToday,
//   MdTrendingUp,
//   MdWork,
//   MdEventAvailable,
//   MdMonetizationOn,
// } from "react-icons/md";
// import { 
//   FaSpinner, 
//   FaChartLine, 
//   FaFilter, 
//   FaDownload,
//   FaUserCircle,
//   FaBell,
//   FaRegClock,
//   FaMoneyBillWave,
// } from "react-icons/fa";
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
//   Filler,
// } from "chart.js";
// import EmployeeSidebar from "../components/Common/EmployeeSidebar";

// ChartJS.register(
//   ArcElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   Legend,
//   Tooltip,
//   PointElement,
//   Filler
// );

// const EmployeeDashboard = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Raw data from APIs
//   const [regularPresentDays, setRegularPresentDays] = useState(0); // From attendance API (full day + half day without overtime)
//   const [absentDays, setAbsentDays] = useState(0);
//   const [lateEntries, setLateEntries] = useState(0);
//   const [weeklyOffCount, setWeeklyOffCount] = useState(0);
//   const [paidLeavesCount, setPaidLeavesCount] = useState(0);
//   const [unpaidLeavesCount, setUnpaidLeavesCount] = useState(0);
//   const [holidaysCount, setHolidaysCount] = useState(0);
//   const [overtimeDays, setOvertimeDays] = useState(0);
  
//   // Derived counts
//   const [totalPresent, setTotalPresent] = useState(0); // regularPresentDays + overtimeDays
//   const [totalDays, setTotalDays] = useState(0);

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
//     fetchLeaves();
//   }, [filterType, filterMonthYear, filterYear]);

//   const fetchProfile = async () => {
//     const token = localStorage.getItem("employee_token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("https://backend.hrms.transev.site/employee/profile", {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       const result = await res.json();
//       if (result.status === "success") {
//         setProfile(result.data);
//         if (result.data.profilePicture) setProfilePicture(result.data.profilePicture);
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     }
//   };

//   const fetchLeaves = async () => {
//     const token = localStorage.getItem("employee_token");
//     if (!token) return;

//     try {
//       const res = await fetch("https://backend.hrms.transev.site/employee/leave/view", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json", 
//           Authorization: `Bearer ${token}` 
//         },
//         body: JSON.stringify({}),
//       });
//       const result = await res.json();
      
//       if (result.status === "success") {
//         let filteredLeaves = result.data;
        
//         if (filterType === "monthYear") {
//           const [year, month] = filterMonthYear.split("-");
//           const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
//           const endDate = new Date(parseInt(year), parseInt(month), 0);
          
//           filteredLeaves = result.data.filter(leave => {
//             const leaveDate = new Date(leave.fromDate);
//             return leaveDate >= startDate && leaveDate <= endDate && leave.status === "approved";
//           });
//         } else {
//           const year = parseInt(filterYear);
//           filteredLeaves = result.data.filter(leave => {
//             const leaveDate = new Date(leave.fromDate);
//             return leaveDate.getFullYear() === year && leave.status === "approved";
//           });
//         }
        
//         let paid = 0;
//         let unpaid = 0;
        
//         filteredLeaves.forEach((leave) => {
//           if (leave.status !== "approved") return;
          
//           const isPaid = leave.leaveType && leave.leaveType.includes("PAID");
          
//           const fromDate = new Date(leave.fromDate);
//           const toDate = new Date(leave.toDate);
//           const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
          
//           if (isPaid) {
//             paid += daysDiff;
//           } else {
//             unpaid += daysDiff;
//           }
//         });
        
//         setPaidLeavesCount(paid);
//         setUnpaidLeavesCount(unpaid);
//       }
//     } catch (err) {
//       console.error("Error fetching leaves:", err);
//     }
//   };

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
//           headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//           body: JSON.stringify({ monthYear: `${filterMonthYear.split("-")[1]}-${filterMonthYear.split("-")[0]}` }),
//         }
//       );
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.error || "Failed to send monthly report");
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
//       const res = await fetch("https://backend.hrms.transev.site/employee/attendance/view", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify(bodyPayload),
//       });
//       const result = await res.json();
//       if (result.status !== "success") throw new Error(result.message);

//       const today = new Date();
//       let regularPresent = 0;
//       let absent = 0;
//       let late = 0;
//       let weeklyOffs = 0;
//       let holidays = 0;
//       let overtime = 0;

//       result.data.forEach((day) => {
//         const dayDate = new Date(day.date);
//         if (dayDate > today) return;

//         switch (day.status) {
//           case "fullDay":
//           case "halfDay":
//             regularPresent++;
//             if (day.flags?.includes("late")) late++;
//             break;
//           case "overtime":
//             overtime++;
//             break;
//           case "absent":
//             absent++;
//             break;
//           case "weeklyOff":
//             weeklyOffs++;
//             break;
//           case "holiday":
//             holidays++;
//             break;
//           default:
//             break;
//         }
//       });

//       setRegularPresentDays(regularPresent);
//       setAbsentDays(absent);
//       setLateEntries(late);
//       setWeeklyOffCount(weeklyOffs);
//       setHolidaysCount(holidays);
//       setOvertimeDays(overtime);
//     } catch (err) {
//       setError(err.message || "Error fetching attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate derived counts
//   useEffect(() => {
//     // Total Present = Regular Present + Overtime Days
//     const present = regularPresentDays + overtimeDays;
//     setTotalPresent(present);
//   }, [regularPresentDays, overtimeDays]);

//   useEffect(() => {
//     // Total Days = Total Present + Absent + Weekly Off + Holidays
//     const total = totalPresent + absentDays + weeklyOffCount + holidaysCount;
//     setTotalDays(total);
//   }, [totalPresent, absentDays, weeklyOffCount, holidaysCount]);

//   // Get total days in selected period
//   const getTotalDaysInPeriod = () => {
//     if (filterType === "monthYear") {
//       const [year, month] = filterMonthYear.split("-");
//       return new Date(parseInt(year), parseInt(month), 0).getDate();
//     } else {
//       const year = parseInt(filterYear);
//       const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
//       return isLeapYear ? 366 : 365;
//     }
//   };

//   // Chart data for attendance distribution
//   const attendanceData = {
//     labels: ["Present", "Absent", "Paid Leave", "Unpaid Leave", "Holiday", "Week Off"],
//     datasets: [
//       {
//         data: [totalPresent, absentDays, paidLeavesCount, unpaidLeavesCount, holidaysCount, weeklyOffCount],
//         backgroundColor: ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#6b7280"],
//         borderWidth: 0,
//         borderRadius: 8,
//       },
//     ],
//   };

//   // Weekly data
//   const weeklyData = {
//     labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
//     datasets: [
//       {
//         label: "Regular Hours",
//         data: [40, 38, 42, 36],
//         borderColor: "#3b82f6",
//         backgroundColor: "rgba(59, 130, 246, 0.1)",
//         fill: true,
//         tension: 0.4,
//       },
//       {
//         label: "Overtime Hours",
//         data: [overtimeDays * 2, 2, 4, 1],
//         borderColor: "#f59e0b",
//         backgroundColor: "rgba(245, 158, 11, 0.1)",
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } },
//     },
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gray-50">
//         <EmployeeSidebar />
//         <div className="flex-1 ml-70 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
//             <p className="mt-4 text-gray-500 text-sm">Loading dashboard...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const getFilterDisplayText = () => {
//     if (filterType === "monthYear") {
//       const [year, month] = filterMonthYear.split("-");
//       const date = new Date(parseInt(year), parseInt(month) - 1);
//       return date.toLocaleString('default', { month: 'long', year: 'numeric' });
//     } else {
//       return filterYear;
//     }
//   };

//   const totalDaysInPeriod = getTotalDaysInPeriod();

//   // Stat cards
//   const statCards = [
//     { 
//       label: "Present", 
//       value: totalPresent, 
//       icon: MdCheckCircle, 
//       color: "text-emerald-600", 
//       bg: "bg-emerald-50", 
//       border: "border-emerald-200",
//       description: `${regularPresentDays} Regular + ${overtimeDays} Overtime = ${totalPresent} Total Present`
//     },
//     { 
//       label: "Overtime", 
//       value: overtimeDays, 
//       icon: MdTrendingUp, 
//       color: "text-blue-600", 
//       bg: "bg-blue-50", 
//       border: "border-blue-200",
//       description: "Days with overtime work (included in Present)"
//     },
//     { 
//       label: "Late", 
//       value: lateEntries, 
//       icon: MdWatchLater, 
//       color: "text-amber-600", 
//       bg: "bg-amber-50", 
//       border: "border-amber-200",
//       description: "Days with late check-in (included in Present)"
//     },
//     { 
//       label: "Paid Leave", 
//       value: paidLeavesCount, 
//       icon: MdMonetizationOn, 
//       color: "text-cyan-600", 
//       bg: "bg-cyan-50", 
//       border: "border-cyan-200",
//       description: `Paid leave days for ${getFilterDisplayText()}`
//     },
//     { 
//       label: "Unpaid Leave", 
//       value: unpaidLeavesCount, 
//       icon: FaMoneyBillWave, 
//       color: "text-orange-600", 
//       bg: "bg-orange-50", 
//       border: "border-orange-200",
//       description: `Unpaid leave days for ${getFilterDisplayText()}`
//     },
//     { 
//       label: "Absent", 
//       value: absentDays, 
//       icon: MdCancel, 
//       color: "text-rose-600", 
//       bg: "bg-rose-50", 
//       border: "border-rose-200",
//       description: "Days marked absent"
//     },
//     { 
//       label: "Weekly Off", 
//       value: weeklyOffCount, 
//       icon: FaRegClock, 
//       color: "text-gray-600", 
//       bg: "bg-gray-50", 
//       border: "border-gray-200",
//       description: "Scheduled weekly offs"
//     },
//     { 
//       label: "Holidays", 
//       value: holidaysCount, 
//       icon: MdEventAvailable, 
//       color: "text-purple-600", 
//       bg: "bg-purple-50", 
//       border: "border-purple-200",
//       description: "Company holidays"
//     },
//     { 
//       label: "Total Days", 
//       value: totalDays, 
//       icon: MdCalendarToday, 
//       color: "text-gray-700", 
//       bg: "bg-gray-100", 
//       border: "border-gray-300",
//       description: `Present + Absent + Weekly Off + Holidays = ${totalDays} / ${totalDaysInPeriod} days`
//     },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <EmployeeSidebar onClose={() => setSidebarOpen(false)} />
      
//       <div className="flex-1 ml-70">
//         <div className="max-w-7xl mx-auto px-8 py-8">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
//               <p className="text-gray-500 text-sm mt-1">
//                 Welcome back, {profile?.name?.split(' ')[0] || "Employee"}
//               </p>
//             </div>
//             <div className="flex items-center gap-4">
//               <button className="relative p-2 text-gray-400 hover:text-gray-600">
//                 <FaBell size={18} />
//                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
//               <div className="flex items-center gap-3">
//                 <div className="text-right hidden sm:block">
//                   <p className="text-sm font-medium text-gray-700">{profile?.name || "Employee"}</p>
//                   <p className="text-xs text-gray-400">ID: {profile?.employeeId || "N/A"}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
//                   {profilePicture ? (
//                     <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full bg-blue-100 flex items-center justify-center">
//                       <FaUserCircle className="text-blue-500 text-2xl" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filter Bar */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <FaFilter className="text-gray-400 text-sm" />
//                 <span className="text-sm text-gray-600">Filter:</span>
//               </div>
//               <select
//                 className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="monthYear">Month-Year</option>
//                 <option value="year">Year</option>
//               </select>
//               {filterType === "monthYear" ? (
//                 <input
//                   type="month"
//                   className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
//                   value={filterMonthYear}
//                   onChange={(e) => setFilterMonthYear(e.target.value)}
//                 />
//               ) : (
//                 <input
//                   type="number"
//                   min="2000"
//                   max="2100"
//                   className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none w-24"
//                   value={filterYear}
//                   onChange={(e) => setFilterYear(e.target.value)}
//                 />
//               )}
//               {filterType === "monthYear" && (
//                 <button
//                   onClick={sendMonthlyReport}
//                   className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
//                 >
//                   <FaDownload size={12} />
//                   Export Report
//                 </button>
//               )}
//             </div>
//           </div>

//           {error && (
//             <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}

//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
//             {statCards.map((stat, idx) => (
//               <div
//                 key={idx}
//                 className={`${stat.bg} ${stat.border} border rounded-xl p-4 transition-all hover:shadow-md group relative`}
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="relative">
//                     <stat.icon className={`${stat.color} text-xl`} />
//                     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
//                       {stat.description}
//                     </div>
//                   </div>
//                   <span className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</span>
//                 </div>
//                 <p className="text-sm text-gray-600">{stat.label}</p>
//               </div>
//             ))}
//           </div>

//           {/* Summary Section */}
//           <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
//             <h3 className="font-medium text-gray-700 mb-3">📊 Period Summary - {getFilterDisplayText()}</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-gray-500 mb-1">Present Days Breakdown</p>
//                 <p className="text-gray-800">
//                   Regular Present: <strong className="text-emerald-600">{regularPresentDays}</strong> days
//                   <br />
//                   Overtime Days: <strong className="text-blue-600">{overtimeDays}</strong> days
//                   <br />
//                   <span className="text-gray-600 mt-1 block pt-1 border-t border-gray-200">
//                     Total Present: <strong className="text-emerald-700">{totalPresent}</strong> days
//                   </span>
//                 </p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-gray-500 mb-1">Total Days Calculation</p>
//                 <p className="text-gray-800">
//                   Present: {totalPresent} + Absent: {absentDays} + Weekly Off: {weeklyOffCount} + Holidays: {holidaysCount}
//                   <br />
//                   <span className="text-gray-600 mt-1 block pt-1 border-t border-gray-200">
//                     Total: <strong className="text-emerald-700">{totalDays}</strong> / {totalDaysInPeriod} days
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Charts */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white rounded-xl border border-gray-200 p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-medium text-gray-700">Weekly Hours Overview</h3>
//                 <div className="flex items-center gap-3 text-xs">
//                   <div className="flex items-center gap-1">
//                     <div className="w-3 h-0.5 bg-blue-500"></div>
//                     <span className="text-gray-500">Regular Hours</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <div className="w-3 h-0.5 bg-amber-500"></div>
//                     <span className="text-gray-500">Overtime Hours</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="h-64">
//                 <Line data={weeklyData} options={chartOptions} />
//               </div>
//             </div>

//             <div className="bg-white rounded-xl border border-gray-200 p-5">
//               <h3 className="font-medium text-gray-700 mb-4">Attendance Distribution</h3>
//               <div className="h-64">
//                 <Pie data={attendanceData} options={chartOptions} />
//               </div>
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
//             <h3 className="font-medium text-gray-700 mb-3">📋 Understanding Your Stats</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-emerald-500 rounded"></div>
//                 <span className="text-gray-600"><strong>Present:</strong> Regular attendance + Overtime days</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-500 rounded"></div>
//                 <span className="text-gray-600"><strong>Overtime:</strong> Days with extra hours (included in Present)</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-amber-500 rounded"></div>
//                 <span className="text-gray-600"><strong>Late:</strong> Late check-in days (included in Present)</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-cyan-500 rounded"></div>
//                 <span className="text-gray-600"><strong>Paid Leave:</strong> Paid time off</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-orange-500 rounded"></div>
//                 <span className="text-gray-600"><strong>Unpaid Leave:</strong> Unpaid time off</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-rose-500 rounded"></div>
//                 <span className="text-gray-600"><strong>Absent:</strong> No show</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-gray-500 rounded"></div>
//                 <span className="text-gray-600"><strong>Weekly Off:</strong> Scheduled days off</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-purple-500 rounded"></div>
//                 <span className="text-gray-600"><strong>Holidays:</strong> Company holidays</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-gray-700 rounded"></div>
//                 <span className="text-gray-600"><strong>Total Days =</strong> Present + Absent + Week Off + Holidays</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
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
  MdMonetizationOn,
} from "react-icons/md";
import { 
  FaSpinner, 
  FaChartLine, 
  FaFilter, 
  FaDownload,
  FaUserCircle,
  FaBell,
  FaRegClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Raw data from APIs
  const [regularPresentDays, setRegularPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [lateEntries, setLateEntries] = useState(0);
  const [weeklyOffCount, setWeeklyOffCount] = useState(0);
  const [paidLeavesCount, setPaidLeavesCount] = useState(0);
  const [unpaidLeavesCount, setUnpaidLeavesCount] = useState(0);
  const [holidaysCount, setHolidaysCount] = useState(0);
  const [overtimeDays, setOvertimeDays] = useState(0);
  
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

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
    fetchLeaves();
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
    }
  };

  const fetchLeaves = async () => {
    const token = localStorage.getItem("employee_token");
    if (!token) return;

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/leave/view", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({}),
      });
      const result = await res.json();
      
      if (result.status === "success") {
        let filteredLeaves = result.data;
        
        if (filterType === "monthYear") {
          const [year, month] = filterMonthYear.split("-");
          const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
          const endDate = new Date(parseInt(year), parseInt(month), 0);
          
          filteredLeaves = result.data.filter(leave => {
            const leaveDate = new Date(leave.fromDate);
            return leaveDate >= startDate && leaveDate <= endDate && leave.status === "approved";
          });
        } else {
          const year = parseInt(filterYear);
          filteredLeaves = result.data.filter(leave => {
            const leaveDate = new Date(leave.fromDate);
            return leaveDate.getFullYear() === year && leave.status === "approved";
          });
        }
        
        let paid = 0;
        let unpaid = 0;
        
        filteredLeaves.forEach((leave) => {
          if (leave.status !== "approved") return;
          
          const isPaid = leave.leaveType && leave.leaveType.includes("PAID");
          
          const fromDate = new Date(leave.fromDate);
          const toDate = new Date(leave.toDate);
          const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
          
          if (isPaid) {
            paid += daysDiff;
          } else {
            unpaid += daysDiff;
          }
        });
        
        setPaidLeavesCount(paid);
        setUnpaidLeavesCount(unpaid);
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
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
      let regularPresent = 0;
      let absent = 0;
      let late = 0;
      let weeklyOffs = 0;
      let holidays = 0;
      let overtime = 0;

      result.data.forEach((day) => {
        const dayDate = new Date(day.date);
        if (dayDate > today) return;

        switch (day.status) {
          case "fullDay":
          case "halfDay":
            regularPresent++;
            if (day.flags?.includes("late")) late++;
            break;
          case "overtime":
            overtime++;
            break;
          case "absent":
            absent++;
            break;
          case "weeklyOff":
            weeklyOffs++;
            break;
          case "holiday":
            holidays++;
            break;
          default:
            break;
        }
      });

      setRegularPresentDays(regularPresent);
      setAbsentDays(absent);
      setLateEntries(late);
      setWeeklyOffCount(weeklyOffs);
      setHolidaysCount(holidays);
      setOvertimeDays(overtime);
    } catch (err) {
      setError(err.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const present = regularPresentDays + overtimeDays;
    setTotalPresent(present);
  }, [regularPresentDays, overtimeDays]);

  useEffect(() => {
    const total = totalPresent + absentDays + weeklyOffCount + holidaysCount;
    setTotalDays(total);
  }, [totalPresent, absentDays, weeklyOffCount, holidaysCount]);

  const getTotalDaysInPeriod = () => {
    if (filterType === "monthYear") {
      const [year, month] = filterMonthYear.split("-");
      return new Date(parseInt(year), parseInt(month), 0).getDate();
    } else {
      const year = parseInt(filterYear);
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      return isLeapYear ? 366 : 365;
    }
  };

  const attendanceData = {
    labels: ["Present", "Absent", "Paid Leave", "Unpaid Leave", "Holiday", "Week Off"],
    datasets: [
      {
        data: [totalPresent, absentDays, paidLeavesCount, unpaidLeavesCount, holidaysCount, weeklyOffCount],
        backgroundColor: ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#6b7280"],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const weeklyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Regular Hours",
        data: [40, 38, 42, 36],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Overtime Hours",
        data: [overtimeDays * 2, 2, 4, 1],
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex">
          <EmployeeSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          <div className="flex-1 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getFilterDisplayText = () => {
    if (filterType === "monthYear") {
      const [year, month] = filterMonthYear.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else {
      return filterYear;
    }
  };

  const totalDaysInPeriod = getTotalDaysInPeriod();

  const statCards = [
    { 
      label: "Present", 
      value: totalPresent, 
      icon: MdCheckCircle, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50", 
      border: "border-emerald-200",
      description: `${regularPresentDays} Regular + ${overtimeDays} Overtime = ${totalPresent} Total Present`
    },
    { 
      label: "Overtime", 
      value: overtimeDays, 
      icon: MdTrendingUp, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      border: "border-blue-200",
      description: "Days with overtime work (included in Present)"
    },
    { 
      label: "Late", 
      value: lateEntries, 
      icon: MdWatchLater, 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      border: "border-amber-200",
      description: "Days with late check-in (included in Present)"
    },
    { 
      label: "Paid Leave", 
      value: paidLeavesCount, 
      icon: MdMonetizationOn, 
      color: "text-cyan-600", 
      bg: "bg-cyan-50", 
      border: "border-cyan-200",
      description: `Paid leave days for ${getFilterDisplayText()}`
    },
    { 
      label: "Unpaid Leave", 
      value: unpaidLeavesCount, 
      icon: FaMoneyBillWave, 
      color: "text-orange-600", 
      bg: "bg-orange-50", 
      border: "border-orange-200",
      description: `Unpaid leave days for ${getFilterDisplayText()}`
    },
    { 
      label: "Absent", 
      value: absentDays, 
      icon: MdCancel, 
      color: "text-rose-600", 
      bg: "bg-rose-50", 
      border: "border-rose-200",
      description: "Days marked absent"
    },
    { 
      label: "Weekly Off", 
      value: weeklyOffCount, 
      icon: FaRegClock, 
      color: "text-gray-600", 
      bg: "bg-gray-50", 
      border: "border-gray-200",
      description: "Scheduled weekly offs"
    },
    { 
      label: "Holidays", 
      value: holidaysCount, 
      icon: MdEventAvailable, 
      color: "text-purple-600", 
      bg: "bg-purple-50", 
      border: "border-purple-200",
      description: "Company holidays"
    },
    { 
      label: "Total Days", 
      value: totalDays, 
      icon: MdCalendarToday, 
      color: "text-gray-700", 
      bg: "bg-gray-100", 
      border: "border-gray-300",
      description: `Present + Absent + Weekly Off + Holidays = ${totalDays} / ${totalDaysInPeriod} days`
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <EmployeeSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        {/* Main Content - Centered */}
        <div className="flex-1 w-full min-w-0">
          <div className="px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Welcome back, {profile?.name?.split(' ')[0] || "Employee"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="relative p-2 text-slate-400 hover:text-slate-600 transition">
                    <FaBell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-slate-700">{profile?.name || "Employee"}</p>
                      <p className="text-xs text-slate-400">ID: {profile?.employeeId || "N/A"}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full overflow-hidden shadow-sm">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                          <FaUserCircle className="text-amber-500 text-2xl" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-slate-400 text-sm" />
                    <span className="text-sm text-slate-600">Filter:</span>
                  </div>
                  <select
                    className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:border-amber-400 focus:outline-none bg-white"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="monthYear">Month-Year</option>
                    <option value="year">Year</option>
                  </select>
                  {filterType === "monthYear" ? (
                    <input
                      type="month"
                      className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:border-amber-400 focus:outline-none bg-white"
                      value={filterMonthYear}
                      onChange={(e) => setFilterMonthYear(e.target.value)}
                    />
                  ) : (
                    <input
                      type="number"
                      min="2000"
                      max="2100"
                      className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:border-amber-400 focus:outline-none w-24 bg-white"
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                    />
                  )}
                  {filterType === "monthYear" && (
                    <button
                      onClick={sendMonthlyReport}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-amber-600 hover:text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-50 transition"
                    >
                      <FaDownload size={12} />
                      Export Report
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-rose-600 text-sm">{error}</p>
                </div>
              )}

              {/* Stats Grid - Responsive */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
                {statCards.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`${stat.bg} ${stat.border} border rounded-xl p-3 md:p-4 transition-all hover:shadow-md group relative`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="relative">
                        <stat.icon className={`${stat.color} text-lg md:text-xl`} />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 hidden md:block">
                          {stat.description}
                        </div>
                      </div>
                      <span className={`text-xl md:text-2xl font-semibold ${stat.color}`}>{stat.value}</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="mb-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5">
                <h3 className="font-medium text-slate-700 mb-3 text-sm md:text-base">📊 Period Summary - {getFilterDisplayText()}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-500 mb-1 text-xs md:text-sm">Present Days Breakdown</p>
                    <p className="text-slate-800 text-xs md:text-sm">
                      Regular Present: <strong className="text-emerald-600">{regularPresentDays}</strong> days
                      <br />
                      Overtime Days: <strong className="text-blue-600">{overtimeDays}</strong> days
                      <br />
                      <span className="text-slate-600 mt-1 block pt-1 border-t border-slate-200">
                        Total Present: <strong className="text-emerald-700">{totalPresent}</strong> days
                      </span>
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-500 mb-1 text-xs md:text-sm">Total Days Calculation</p>
                    <p className="text-slate-800 text-xs md:text-sm">
                      Present: {totalPresent} + Absent: {absentDays} + Weekly Off: {weeklyOffCount} + Holidays: {holidaysCount}
                      <br />
                      <span className="text-slate-600 mt-1 block pt-1 border-t border-slate-200">
                        Total: <strong className="text-emerald-700">{totalDays}</strong> / {totalDaysInPeriod} days
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Charts - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className="font-medium text-slate-700 text-sm md:text-base">Weekly Hours Overview</h3>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-blue-500"></div>
                        <span className="text-slate-500">Regular</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-amber-500"></div>
                        <span className="text-slate-500">Overtime</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-64">
                    <Line data={weeklyData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5">
                  <h3 className="font-medium text-slate-700 mb-4 text-sm md:text-base">Attendance Distribution</h3>
                  <div className="h-64">
                    <Pie data={attendanceData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5">
                <h3 className="font-medium text-slate-700 mb-3 text-sm md:text-base">📋 Understanding Your Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                    <span className="text-slate-600"><strong>Present:</strong> Regular + Overtime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-slate-600"><strong>Overtime:</strong> Extra hours days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span className="text-slate-600"><strong>Late:</strong> Late check-in days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                    <span className="text-slate-600"><strong>Paid Leave:</strong> Paid time off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-slate-600"><strong>Unpaid Leave:</strong> Unpaid time off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose-500 rounded"></div>
                    <span className="text-slate-600"><strong>Absent:</strong> No show</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    <span className="text-slate-600"><strong>Weekly Off:</strong> Scheduled off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-slate-600"><strong>Holidays:</strong> Company holidays</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;