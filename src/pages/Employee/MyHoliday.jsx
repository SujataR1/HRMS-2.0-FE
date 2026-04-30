// import React, { useEffect, useState } from "react";
// import jsPDF from "jspdf/dist/jspdf.umd.min.js";
// import { applyPlugin } from "jspdf-autotable";
// applyPlugin(jsPDF);
// import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

// const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// const MyHoliday = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [holidays, setHolidays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterYear, setFilterYear] = useState("all");
//   const [filterMonth, setFilterMonth] = useState("all");

//   // Assuming employee token stored separately, or no token if public access
//   const token = localStorage.getItem("employee_token");
//   const formatDate = (date) =>
//     date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
//   const todayStr = formatDate(new Date());

//   const fetchHolidays = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         "https://backend.hrms.transev.site/employee/holidays/view",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token ? `Bearer ${token}` : undefined,
//           },
//           body: JSON.stringify({
//   fromDate: `${year - 1}-01-01`,
//   toDate: `${year + 2}-12-31`,
// }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok && (data.status === "success" || data.success === true)) {
//         const normalized = data.data.map((h) => ({
//   ...h,
//   date: new Date(h.date).toLocaleDateString("en-CA"),
// }));

//         setHolidays(normalized);
//       } else {
//         setError("Failed to fetch holidays");
//       }
//     } catch (err) {
//       setError("Error loading holidays");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHolidays();
//   }, []);

//   const downloadHolidayPDF = () => {
//     if (!filteredHolidays || filteredHolidays.length === 0) {
//       alert("No holidays to export for the selected month/year.");
//       return;
//     }

//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     const monthNames = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     let heading = "Holiday Calendar";

//     if (filterYear !== "all" && filterMonth !== "all") {
//       heading += ` - ${monthNames[filterMonth]} ${filterYear}`;
//     } else if (filterYear !== "all") {
//       heading += ` - ${filterYear}`;
//     } else if (filterMonth !== "all") {
//       heading += ` - ${monthNames[filterMonth]}`;
//     } else {
//       heading += " - All Years & Months";
//     }

//     doc.text(heading, 14, 22);

//     const rows = filteredHolidays
//       .sort((a, b) => new Date(a.date) - new Date(b.date))
//       .map((h, index) => [
//         index + 1,
//         h.name,
//         new Date(h.date).toLocaleDateString("en-IN", {
//           weekday: "long",
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//         }),
//       ]);

//     doc.autoTable({
//       head: [["#", "Holiday Name", "Date"]],
//       body: rows,
//       startY: 30,
//       theme: "striped",
//       styles: { halign: "left" },
//       headStyles: { fillColor: [255, 204, 0] },
//     });

//     doc.save(`Holiday_Calendar_${filterYear}_${filterMonth + 1}.pdf`);
//   };

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();
//   const firstDayOfMonth = new Date(year, month, 1);
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const startDay = firstDayOfMonth.getDay();
//   const calendarDays = [];
//   for (let i = 0; i < startDay; i++) calendarDays.push(null);
//   for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(year, month, d));
//   const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
//   const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

//   const filteredHolidays = holidays.filter((h) => {
//     const d = new Date(h.date);
//     const yearMatch = filterYear === "all" || d.getFullYear() === Number(filterYear);
//     const monthMatch = filterMonth === "all" || d.getMonth() === Number(filterMonth);
//     return yearMatch && monthMatch;
//   });
//   // Find upcoming holiday + days left
//   const upcomingHoliday = holidays
//     .filter((h) => new Date(h.date) >= new Date())
//     .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

//   const daysLeft = upcomingHoliday
//     ? Math.ceil(
//       (new Date(upcomingHoliday.date) - new Date()) / (1000 * 60 * 60 * 24)
//     )
//     : null;

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200 font-sans">
//       <EmployeeSidebar />
//       <main className="ml-64 flex flex-col justify-center items-center flex-1 p-8">
//         <section className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full border border-yellow-300 ring-1 ring-yellow-400 ring-opacity-30">
//           <header className="flex items-center justify-between mb-6">
//             <button onClick={prevMonth} className="text-yellow-700 p-2">
//               ←
//             </button>
//             <h1 className="text-3xl font-extrabold text-yellow-900">
//               {currentDate.toLocaleString("default", { month: "long" })} {year}
//             </h1>
//             <button onClick={nextMonth} className="text-yellow-700 p-2">
//               →
//             </button>
//           </header>

//           {/* Ultra-Sleek Premium Upcoming Holiday Banner */}
//           {upcomingHoliday && (
//             <div className="
//     w-full mb-7 px-6 py-5
//     rounded-2xl
//     bg-white/40
//     backdrop-blur-xl
//     border border-slate-200
//     shadow-[0_8px_20px_rgba(0,0,0,0.06)]
//     flex flex-col items-center text-center
//     transition-all duration-300
//   ">

//               {/* Title */}
//               <div className="text-xs font-semibold tracking-[0.12em] text-slate-600 uppercase">
//                 🎉 Upcoming Holiday
//               </div>

//               {/* Holiday Name */}
//               <div className="mt-1 text-xl font-semibold text-slate-900">
//                 {upcomingHoliday.name}
//               </div>

//               {/* Date */}
//               <div className="mt-1 text-sm text-slate-500">
//                 {new Date(upcomingHoliday.date).toLocaleDateString('en-IN', {
//                   weekday: "long",
//                   day: "2-digit",
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </div>

//               {/* Days Left Badge */}
//               <div className="
//       mt-3 text-xs font-medium
//       px-4 py-1.5
//       rounded-full
//       bg-gradient-to-r from-slate-900 to-slate-700
//       text-white shadow-md
//       tracking-wide
//     ">
//                 {daysLeft} DAYS LEFT
//               </div>
//             </div>
//           )}

//           {/* No Add Holiday button for employee */}

//           <div className="grid grid-cols-7 gap-3 mb-4 text-center text-yellow-800 font-semibold uppercase">
//             {daysOfWeek.map((day, i) => (
//               <div key={i}>{day}</div>
//             ))}
//           </div>

//           <div className="grid grid-cols-7 gap-3 mb-6">
//             {calendarDays.map((date, idx) => {
//               if (!date) return <div key={idx} />;
//               const dateStr = formatDate(date);
//               const isToday = dateStr === todayStr;
//               const holiday = holidays.find((h) => h.date === dateStr);
//               const isWeekend = date.getDay() === 0 || date.getDay() === 6;

//               return (
//                 <div
//                   key={idx}
//                   className={`p-3 rounded-lg flex flex-col justify-between shadow-sm
//                     ${isToday
//                       ? "bg-yellow-300 ring-2 ring-yellow-500 font-bold"
//                       : holiday
//                         ? "bg-yellow-100"
//                         : isWeekend
//                           ? "bg-yellow-50 text-yellow-600"
//                           : "bg-white"
//                     }`}
//                   title={holiday ? `${holiday.name} (${dateStr})` : dateStr}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span className="text-lg">{date.getDate()}</span>
//                   </div>
//                   {holiday && <div className="mt-1 text-xs font-semibold">{holiday.name}</div>}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Filters for Month and Year */}
//           <div className="mb-4 flex gap-4 items-center">
//             <label className="font-semibold text-yellow-800" htmlFor="filterYear">
//               Year:
//             </label>
//             <select
//               id="filterYear"
//               className="border border-yellow-300 rounded p-1"
//               value={filterYear}
//               onChange={(e) => setFilterYear(e.target.value)}
//             >
//               <option value="all">All Years</option>
//               {[2023, 2024, 2025, 2026, 2027].map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>

//             <label className="font-semibold text-yellow-800" htmlFor="filterMonth">
//               Month:
//             </label>
//             <select
//               id="filterMonth"
//               className="border border-yellow-300 rounded p-1"
//               value={filterMonth}
//               onChange={(e) => setFilterMonth(e.target.value)}
//             >
//               <option value="all">All Months</option>
//               {[
//                 "January",
//                 "February",
//                 "March",
//                 "April",
//                 "May",
//                 "June",
//                 "July",
//                 "August",
//                 "September",
//                 "October",
//                 "November",
//                 "December",
//               ].map((m, i) => (
//                 <option key={i} value={i}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Filtered Upcoming Holidays */}
//           <div className="mt-8 w-full">
//             <h2 className="text-xl font-bold mb-4 text-yellow-800">
//               {filterYear === "all" && filterMonth === "all"
//                 ? "All Holidays"
//                 : `Holidays${filterMonth !== "all" ? " in " + [
//                   "January",
//                   "February",
//                   "March",
//                   "April",
//                   "May",
//                   "June",
//                   "July",
//                   "August",
//                   "September",
//                   "October",
//                   "November",
//                   "December",
//                 ][filterMonth] : ""}${filterYear !== "all" ? " " + filterYear : ""}`}
//             </h2>

//             <ul className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl shadow-md border border-slate-200 max-h-64 overflow-y-auto divide-y divide-slate-100">
//               {filteredHolidays.length > 0 ? (
//                 filteredHolidays
//                   .sort((a, b) => new Date(a.date) - new Date(b.date))
//                   .map((holiday) => (
//                     <li
//                       key={holiday.id}
//                       className="
//             flex items-center justify-between py-3 
//             transition-all duration-200 
//             hover:bg-slate-50 hover:shadow-sm hover:rounded-xl px-3
//           "
//                     >
//                       {/* Holiday Name */}
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-slate-800 text-sm">
//                           {holiday.name}
//                         </span>
//                         <span className="text-xs text-slate-500 mt-[2px]">
//                           {new Date(holiday.date).toLocaleDateString("en-IN", {
//                             weekday: "short",
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                           })}
//                         </span>
//                       </div>

//                       {/* Date Badge */}
//                       <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-medium shadow-sm">
//                         {new Date(holiday.date).toLocaleDateString("en-IN", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </div>

//                     </li>
//                   ))
//               ) : (
//                 <li className="text-gray-500 italic text-center py-4">No holidays found.</li>
//               )}
//             </ul>

//             <button
//               onClick={downloadHolidayPDF}
//               className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
//             >
//               Download Holiday List (PDF)
//             </button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default MyHoliday;

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf/dist/jspdf.umd.min.js";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaDownload, 
  FaCalendarAlt, 
  FaGift, 
  FaSpinner,
  FaRegClock,
  FaMapMarkerAlt,
  FaSnowflake,
  FaSun,
  FaCloudSun,
  FaStar,
  FaFire,
  FaHeart,
  FaLeaf,
  FaCrown
} from "react-icons/fa";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Seasonal backgrounds
const seasonalGradients = {
  winter: "from-blue-50 via-indigo-50 to-purple-50",
  spring: "from-emerald-50 via-teal-50 to-cyan-50",
  summer: "from-orange-50 via-amber-50 to-yellow-50",
  autumn: "from-rose-50 via-orange-50 to-amber-50"
};

const getSeason = (date) => {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};

const MyHoliday = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [downloading, setDownloading] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");

  const token = localStorage.getItem("employee_token");
  
  const formatDate = (date) =>
    date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const todayStr = formatDate(new Date());

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const year = new Date().getFullYear();
      const res = await fetch(
        "https://backend.hrms.transev.site/employee/holidays/view",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            fromDate: `${year - 2}-01-01`,
            toDate: `${year + 3}-12-31`,
          }),
        }
      );
      const data = await res.json();
      if (res.ok && (data.status === "success" || data.success === true)) {
        const normalized = data.data.map((h) => ({
          ...h,
          date: new Date(h.date).toLocaleDateString("en-CA"),
        }));
        setHolidays(normalized);
      } else {
        setError("Failed to fetch holidays");
      }
    } catch (err) {
      setError("Error loading holidays");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const downloadHolidayPDF = async () => {
    if (!filteredHolidays || filteredHolidays.length === 0) {
      alert("No holidays to export for the selected month/year.");
      return;
    }

    setDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(245, 158, 11);
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    let heading = "🏖️ Holiday Calendar";
    if (filterYear !== "all" && filterMonth !== "all") {
      heading += ` - ${monthNames[filterMonth]} ${filterYear}`;
    } else if (filterYear !== "all") {
      heading += ` - ${filterYear}`;
    } else if (filterMonth !== "all") {
      heading += ` - ${monthNames[filterMonth]}`;
    }

    doc.text(heading, 14, 22);

    const rows = filteredHolidays
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((h, index) => [
        index + 1,
        h.name,
        new Date(h.date).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ]);

    doc.autoTable({
      head: [["#", "Holiday Name", "Date"]],
      body: rows,
      startY: 35,
      theme: "striped",
      styles: { halign: "left", fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255], fontSize: 11, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 247, 237] },
    });

    doc.save(`Holiday_Calendar_${new Date().getFullYear()}.pdf`);
    setDownloading(false);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
  
  const calendarDays = [];
  for (let i = 0; i < adjustedStartDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(year, month, d));
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const filteredHolidays = holidays.filter((h) => {
    const d = new Date(h.date);
    const yearMatch = filterYear === "all" || d.getFullYear() === Number(filterYear);
    const monthMatch = filterMonth === "all" || d.getMonth() === Number(filterMonth);
    return yearMatch && monthMatch;
  });

  const upcomingHolidays = holidays
    .filter((h) => new Date(h.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const currentSeason = getSeason(currentDate);
  const seasonIcon = {
    winter: <FaSnowflake className="text-blue-400" />,
    spring: <FaLeaf className="text-emerald-400" />,
    summer: <FaSun className="text-amber-400" />,
    autumn: <FaCloudSun className="text-orange-400" />
  }[currentSeason];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
        <EmployeeSidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-100 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaCalendarAlt className="text-amber-500 text-2xl animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-500 font-medium">Loading holiday calendar...</p>
            <p className="text-gray-400 text-sm mt-1">Getting ready for your days off 🎉</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gradient-to-br ${seasonalGradients[currentSeason]} transition-all duration-1000`}>
      <EmployeeSidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Animated Header */}
          <div className="mb-10 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaCalendarAlt className="text-white text-2xl" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Holiday Calendar</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {seasonIcon}
                    <p className="text-gray-500 text-sm capitalize">{currentSeason} vibes</p>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <p className="text-gray-500 text-sm">{holidays.length} holidays total</p>
                  </div>
                </div>
              </div>
              
              {/* View Toggle */}
              <div className="flex gap-2 bg-white rounded-xl shadow-sm p-1">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "calendar" 
                      ? "bg-amber-500 text-white shadow-md" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  📅 Calendar
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "list" 
                      ? "bg-amber-500 text-white shadow-md" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  📋 List View
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Holidays Cards */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <FaStar className="text-amber-400 text-sm" />
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Upcoming Celebrations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {upcomingHolidays.map((holiday, idx) => {
                const daysUntil = Math.ceil(
                  (new Date(holiday.date) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={holiday.id}
                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-3xl"></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                          {daysUntil === 0 ? (
                            <FaFire className="text-amber-500 text-lg" />
                          ) : (
                            <FaGift className="text-amber-500 text-lg" />
                          )}
                        </div>
                        {daysUntil === 0 ? (
                          <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold animate-pulse">
                            TODAY
                          </span>
                        ) : daysUntil <= 3 ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-lg text-xs font-semibold">
                            {daysUntil} days left
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">
                            {daysUntil} days left
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{holiday.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(holiday.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long'
                        })}
                      </p>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {viewMode === "calendar" ? (
            // Calendar View
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevMonth}
                      className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all duration-200 group"
                    >
                      <FaChevronLeft className="text-gray-500 group-hover:text-amber-500 transition-colors" />
                    </button>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {currentDate.toLocaleString("default", { month: "long" })}
                      </h2>
                      <p className="text-gray-400 text-sm">{year}</p>
                    </div>
                    <button
                      onClick={nextMonth}
                      className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all duration-200 group"
                    >
                      <FaChevronRight className="text-gray-500 group-hover:text-amber-500 transition-colors" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Week starting from Monday</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-7 gap-3 mb-4">
                  {daysOfWeek.map((day, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {calendarDays.map((date, idx) => {
                    if (!date) return <div key={idx} className="h-28" />;
                    
                    const dateStr = formatDate(date);
                    const isToday = dateStr === todayStr;
                    const holiday = holidays.find((h) => h.date === dateStr);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <div
                        key={idx}
                        onClick={() => holiday && setSelectedHoliday(holiday)}
                        className={`
                          relative h-28 rounded-xl p-2 transition-all duration-300 cursor-pointer
                          ${isToday 
                            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 ring-2 ring-amber-400 shadow-lg' 
                            : holiday 
                              ? 'bg-gradient-to-br from-amber-50/50 to-yellow-50/50 hover:shadow-md' 
                              : isWeekend 
                                ? 'bg-gray-50/50' 
                                : 'bg-white hover:bg-gray-50 hover:shadow-md'
                          }
                        `}
                      >
                        <div className="flex flex-col h-full">
                          <span className={`
                            text-sm font-medium 
                            ${isToday ? 'text-amber-700' : holiday ? 'text-amber-600' : isWeekend ? 'text-gray-400' : 'text-gray-700'}
                          `}>
                            {date.getDate()}
                          </span>
                          {holiday && (
                            <div className="mt-auto">
                              <div className="px-2 py-1 bg-amber-100 rounded-lg text-center">
                                <p className="text-[10px] font-semibold text-amber-700 truncate">
                                  {holiday.name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        {isToday && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-gray-800">🎯 All Holidays</h3>
                  
                  <div className="flex flex-wrap gap-3">
                    <select
                      className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50 focus:border-amber-400 focus:outline-none transition-colors"
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                    >
                      <option value="all">📅 All Years</option>
                      {[2023, 2024, 2025, 2026, 2027].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>

                    <select
                      className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50 focus:border-amber-400 focus:outline-none transition-colors"
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                    >
                      <option value="all">🗓️ All Months</option>
                      {[
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December",
                      ].map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="max-h-96 overflow-y-auto custom-scroll">
                  {filteredHolidays.length > 0 ? (
                    <div className="space-y-2">
                      {filteredHolidays
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((holiday, idx) => {
                          const holidayDate = new Date(holiday.date);
                          const isPast = holidayDate < new Date();
                          const isToday = formatDate(holidayDate) === todayStr;
                          
                          return (
                            <div
                              key={holiday.id}
                              className={`
                                group flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer
                                ${isToday 
                                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500' 
                                  : isPast 
                                    ? 'hover:bg-gray-50' 
                                    : 'hover:bg-amber-50/30'
                                }
                              `}
                              onClick={() => setSelectedHoliday(holiday)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`
                                  w-12 h-12 rounded-xl flex items-center justify-center text-lg
                                  ${isToday ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600'}
                                `}>
                                  {isToday ? <FaFire /> : <FaCrown />}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                                    {holiday.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-gray-500">
                                      {holidayDate.toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: 'long'
                                      })}
                                    </p>
                                    {isToday && (
                                      <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[10px] font-semibold">
                                        Today
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                  <FaHeart className="text-gray-400 group-hover:text-amber-500 text-sm transition-colors" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCalendarAlt className="text-gray-400 text-2xl" />
                      </div>
                      <p className="text-gray-500 font-medium">No holidays found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={downloadHolidayPDF}
                    disabled={downloading}
                    className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {downloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FaDownload className="group-hover:-translate-y-0.5 transition-transform" />
                        Download Holiday List
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Holiday Detail Modal */}
      {selectedHoliday && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn" onClick={() => setSelectedHoliday(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-amber-100 text-xs font-semibold uppercase tracking-wide">Holiday Details</p>
                  <h3 className="text-white text-2xl font-bold mt-1">{selectedHoliday.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedHoliday(null)}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaCalendarAlt className="text-amber-500 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedHoliday.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaRegClock className="text-amber-500 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedHoliday.date) > new Date() ? 'Upcoming' : 'Past'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedHoliday(null)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>
    </div>
  );
};

export default MyHoliday;