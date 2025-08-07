// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import EmployeeSidebar from '../components/Common/EmployeeSidebar';
// import {
//   MdCheckCircle,
//   MdCancel,
//   MdWatchLater,
//   MdCalendarToday,
// } from 'react-icons/md';
// import { FaMoon, FaSun } from 'react-icons/fa';
// import { Line, Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   Legend,
//   Tooltip,
//   PointElement,
// } from 'chart.js';

// ChartJS.register(
//   ArcElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   Legend,
//   Tooltip,
//   PointElement
// );

// const overviewCards = [
//   { label: 'Present Days', icon: <MdCheckCircle /> },
//   { label: 'Absent Days', icon: <MdCancel /> },
//   { label: 'Late Entries', icon: <MdWatchLater /> },
//   { label: 'Leave Balance', icon: <MdCalendarToday /> },
// ];

// const lineData = {
//   labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//   datasets: [
//     {
//       label: 'Work Hours',
//       data: [40, 42, 38, 41],
//       borderColor: '#FBBF24', // yellow-400
//       fill: false,
//       tension: 0.3,
//     },
//   ],
// };

// const pieData = {
//   labels: ['Present', 'Leave', 'Absent'],
//   datasets: [
//     {
//       data: [20, 3, 2],
//       backgroundColor: ['#FBBF24', '#F59E0B', '#D97706'], // yellow shades
//     },
//   ],
// };

// const lightChartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: 'top',
//       labels: {
//         color: '#92400E', // darker yellow-brown for legend text
//       },
//     },
//   },
//   scales: {
//     x: {
//       ticks: {
//         color: '#92400E',
//       },
//       grid: {
//         color: '#FDE68A',
//       },
//     },
//     y: {
//       ticks: {
//         color: '#92400E',
//       },
//       grid: {
//         color: '#FDE68A',
//       },
//     },
//   },
// };

// const darkChartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: 'top',
//       labels: {
//         color: '#DDD',
//       },
//     },
//   },
//   scales: {
//     x: {
//       ticks: {
//         color: '#DDD',
//       },
//       grid: {
//         color: '#444',
//       },
//     },
//     y: {
//       ticks: {
//         color: '#DDD',
//       },
//       grid: {
//         color: '#444',
//       },
//     },
//   },
// };

// const EmployeeDashboard = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [darkMode, setDarkMode] = useState(false);
//   const navigate = useNavigate();
//   const [profilePicture, setProfilePicture] = useState(null);


//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem("employee_token");
//       if (!token) {
//         setError("No token found. Please login.");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch profile data
//         const profileRes = await fetch("https://backend.hrms.transev.site/employee/profile", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const profileResult = await profileRes.json();

//         if (!profileRes.ok) {
//           throw new Error(profileResult.message || "Failed to fetch profile");
//         }

//         setProfile(profileResult.data);

//         // Fetch profile picture
//         const pictureRes = await fetch("https://backend.hrms.transev.site/employee/profile-picture", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const pictureResult = await pictureRes.json();

//         if (pictureResult.status === "success" && pictureResult.data) {
//           setProfilePicture(pictureResult.data); // It's already base64 image
//         } else {
//           console.warn("Profile picture not found.");
//         }

//         setError("");
//       } catch (err) {
//         console.error("❌ Fetch error:", err);
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);


//   return (
//     <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-yellow-50 text-yellow-900"}`}>

//       {/* Sidebar */}
//       <aside className="w-64 h-screen fixed top-0 left-0 bg-white dark:bg-gray-800 shadow-lg z-20">
//         <EmployeeSidebar />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 ml-64 p-6 transition-colors duration-300 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
//           <div className="flex items-center gap-4">
//             {darkMode ? (
//               <FaSun
//                 className="text-yellow-500 cursor-pointer"
//                 onClick={() => setDarkMode(false)}
//                 title="Switch to Light Mode"
//                 size={20}
//               />
//             ) : (
//               <FaMoon
//                 className="text-yellow-700 cursor-pointer"
//                 onClick={() => setDarkMode(true)}
//                 title="Switch to Dark Mode"
//                 size={20}
//               />
//             )}
//             {/* Profile section */}
//             <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/MyProfile")}>
//               <img
//                 src={profilePicture || "https://via.placeholder.com/40"}
//                 alt="profile"
//                 className="w-8 h-8 rounded-full object-cover"
//               />

//               <div>
//                 <div className={`font-semibold ${darkMode ? "text-gray-200" : "text-yellow-800"}`}>
//                   {loading ? "Loading..." : error ? "Employee" : profile?.name || "Employee"}
//                 </div>
//                 <div className={darkMode ? "text-gray-400 text-xs" : "text-yellow-600 text-xs"}>
//                   Employee
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//           {overviewCards.map((item, index) => (
//             <div
//               key={index}
//               className={`p-5 rounded-lg flex flex-col items-center text-center shadow-md transition-colors duration-300 ${darkMode
//                   ? "bg-gray-800 text-gray-200 shadow-gray-700 hover:bg-yellow-600 hover:text-gray-900"
//                   : "bg-white text-yellow-700 shadow hover:bg-yellow-100"
//                 }`}
//             >
//               <div className={`text-4xl mb-2 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`}>
//                 {item.icon}
//               </div>
//               <div className="text-lg font-medium">{item.label}</div>
//               <div className={`text-3xl font-bold mt-1 ${darkMode ? "text-yellow-300" : "text-yellow-600"}`}>
//                 5
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <section
//             className={`p-6 rounded-lg shadow-md h-72 transition-colors duration-300 ${darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white shadow"
//               }`}
//           >
//             <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>
//               Work Hour Trend
//             </h2>
//             <div className="h-48">
//               <Line data={lineData} options={darkMode ? darkChartOptions : lightChartOptions} />
//             </div>
//           </section>

//           <section
//             className={`p-6 rounded-lg shadow-md h-72 transition-colors duration-300 ${darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white shadow"
//               }`}
//           >
//             <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>
//               Attendance Summary
//             </h2>
//             <div className="h-48">
//               <Pie data={pieData} options={darkMode ? darkChartOptions : lightChartOptions} />
//             </div>
//           </section>
//         </div>

//         {/* Footer */}
//         <footer className={`text-right text-xs mt-10 mb-4 ${darkMode ? "text-gray-500" : "text-yellow-400"}`}>
//           Powered by Transmogrify
//         </footer>
//       </main>
//     </div>
//   );
// };

// export default EmployeeDashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeSidebar from '../components/Common/EmployeeSidebar';
import {
  MdCheckCircle,
  MdCancel,
  MdWatchLater,
  MdCalendarToday,
} from 'react-icons/md';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement
);

const overviewCards = [
  { label: 'Present Days', icon: <MdCheckCircle /> },
  { label: 'Absent Days', icon: <MdCancel /> },
  { label: 'Late Entries', icon: <MdWatchLater /> },
  { label: 'Weekly Offs', icon: <MdCalendarToday /> },  // New field
];

const lineData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Work Hours',
      data: [40, 42, 38, 41],
      borderColor: '#FBBF24',
      fill: false,
      tension: 0.3,
    },
  ],
};

const pieData = {
  labels: ['Present', 'Leave', 'Absent'],
  datasets: [
    {
      data: [20, 3, 2],
      backgroundColor: ['#FBBF24', '#F59E0B', '#D97706'],
    },
  ],
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [lateEntries, setLateEntries] = useState(0);
  const [weeklyOffCount, setWeeklyOffCount] = useState(0);

  const [filterType, setFilterType] = useState("monthYear");
  const [filterMonthYear, setFilterMonthYear] = useState(new Date().toISOString().slice(0,7)); // current month
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  useEffect(() => { fetchProfile(); }, []);
  useEffect(() => { fetchAttendance(); }, [filterType, filterMonthYear, filterYear]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("employee_token");
    if (!token) { setError("No token"); setLoading(false); return; }
    try {
      const profileRes = await fetch("https://backend.hrms.transev.site/employee/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileResult = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileResult.message || "Failed");
      setProfile(profileResult.data);

      const pictureRes = await fetch("https://backend.hrms.transev.site/employee/profile-picture", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pictureResult = await pictureRes.json();
      if (pictureResult.status === "success") setProfilePicture(pictureResult.data);

      setError("");
      setLoading(false);
    } catch (err) {
      setError(err.message || "Error");
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("employee_token");
    if (!token) { setError("No token"); setLoading(false); return; }

    let bodyPayload;
    if (filterType === "monthYear") {
      const [year, month] = filterMonthYear.split("-");
      bodyPayload = { monthYear: `${month}-${year}` };
    } else {
      bodyPayload = { year: filterYear };
    }

    try {
      const attendanceRes = await fetch("https://backend.hrms.transev.site/employee/attendance/view", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });
      const attendanceResult = await attendanceRes.json();
      if (attendanceResult.status !== "success") throw new Error(attendanceResult.message);

      const today = new Date();
      const data = attendanceResult.data;

      let present = 0, absent = 0, late = 0, weeklyOffs = 0;
      data.forEach(day => {
        const dayDate = new Date(day.date);
        if (dayDate > today) return;  // only up to today

        if (day.status === "fullDay" || day.status === "halfDay") {
          present++;
          if (day.flags?.includes("late")) late++;
        } else if (day.status === "absent") {
          absent++;
        } else if (day.status === "weeklyOff") {
          weeklyOffs++;
        }
      });

      setPresentDays(present);
      setAbsentDays(absent);
      setLateEntries(late);
      setWeeklyOffCount(weeklyOffs);
      setError("");
    } catch (err) {
      setError(err.message || "Error fetching attendance");
      setPresentDays(0);
      setAbsentDays(0);
      setLateEntries(0);
      setWeeklyOffCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-yellow-50 text-yellow-900"}`}>
      <aside className="w-64 fixed top-0 left-0 h-screen z-30 bg-white dark:bg-gray-800 shadow-lg">
  <EmployeeSidebar />
</aside>

      <main className="flex-1 ml-64 p-6 max-w-7xl mx-auto">
        <header className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
          <div className="flex items-center gap-4">
            {darkMode
              ? <FaSun className="cursor-pointer" onClick={() => setDarkMode(false)} size={20}/>
              : <FaMoon className="cursor-pointer" onClick={() => setDarkMode(true)} size={20}/>}
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/MyProfile")}>
              <img src={profilePicture||"https://via.placeholder.com/40"} alt="profile" className="w-8 h-8 rounded-full"/>
              <div className="ml-2">
                <div>{loading ? "Loading..." : profile?.name || "Employee"}</div>
                <div className="text-xs">Employee</div>
              </div>
            </div>
          </div>
        </header>
        <section className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Filter Attendance</h2>
          <div className="flex gap-4">
            <select
              className="border px-3 py-2"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}>
              <option value="monthYear">By Month-Year</option>
              <option value="year">By Year</option>
            </select>
            {filterType === "monthYear" && (
              <input
                type="month"
                className="border px-3 py-2"
                value={filterMonthYear}
                onChange={e => setFilterMonthYear(e.target.value)}
              />
            )}
            {filterType === "year" && (
              <input
                type="number"
                min="2000" max="2100"
                placeholder="2025"
                className="border px-3 py-2"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
              />
            )}
          </div>
        </section>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((item, i) => {
            const vals = { "Present Days": presentDays, "Absent Days": absentDays, "Late Entries": lateEntries, "Weekly Offs": weeklyOffCount };
            return (
              <div key={i} className="p-5 bg-white rounded shadow flex flex-col items-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="font-medium">{item.label}</div>
                <div className="text-3xl font-bold">{loading ? "..." : vals[item.label] ?? "-"}</div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow" style={{height:"350px"}}>
            <h2 className="mb-4">Working Hours Trend</h2>
            <Line data={lineData}/>
          </div>
          <div className="bg-white p-6 rounded shadow" style={{height:"350px"}}>
            <h2 className="mb-4">Attendance Summary</h2>
            <Pie data={pieData}/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
