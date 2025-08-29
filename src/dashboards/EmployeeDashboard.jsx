import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import {
  MdCheckCircle,
  MdCancel,
  MdWatchLater,
  MdCalendarToday,
} from "react-icons/md";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
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
} from "chart.js";
import EmployeeSidebar from "../components/Common/EmployeeSidebar";

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
  { label: "Present Days", icon: <MdCheckCircle /> },
  { label: "Absent Days", icon: <MdCancel /> },
  { label: "Late Entries", icon: <MdWatchLater /> },
  { label: "Weekly Offs", icon: <MdCalendarToday /> },
  { label: "Holidays", icon: <MdCalendarToday /> },
  { label: "Approved Leaves", icon: <MdCalendarToday /> },
];

const lineData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Work Hours",
      data: [40, 42, 38, 41],
      borderColor: "#FBBF24",
      fill: false,
      tension: 0.3,
    },
  ],
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem("darkMode");
  return saved === "true";
});

useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            monthYear: `${filterMonthYear.split("-")[1]}-${filterMonthYear.split("-")[0]}`
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to send monthly report");
      }

      alert(json.message || "Monthly report sent successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("employee_token");
    if (!token) return setError("No token");

    try {
      const res = await fetch(
        "https://backend.hrms.transev.site/employee/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed");
      setProfile(result.data);

      const picRes = await fetch(
        "https://backend.hrms.transev.site/employee/profile-picture",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const picResult = await picRes.json();
      if (picResult.status === "success") setProfilePicture(picResult.data);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
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
      const res = await fetch(
        "https://backend.hrms.transev.site/employee/attendance/view",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload),
        }
      );
      const result = await res.json();
      if (result.status !== "success") throw new Error(result.message);

      const today = new Date();
      let present = 0,
        absent = 0,
        late = 0,
        weeklyOffs = 0,
        approvedLeaves = 0,
        holidays = 0;

      result.data.forEach((day) => {
        const dayDate = new Date(day.date);
        if (dayDate > today) return;

        switch (day.status) {
          case "fullDay":
          case "halfDay":
            present++;
            if (day.flags?.includes("late")) late++;
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
            // Add more holiday statuses here if any
            holidays++;
            break;
          default:
            break;
        }
      });

      setPresentDays(present);
      setAbsentDays(absent);
      setLateEntries(late);
      setWeeklyOffCount(weeklyOffs);
      setApprovedLeavesCount(approvedLeaves);
      setHolidaysCount(holidays);
    } catch (err) {
      setError(err.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-yellow-50 text-gray-900"
        } min-h-screen flex`}
    >
      {/* Sidebar Toggle (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-yellow-500 text-white rounded-md md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 z-50 shadow-lg transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static`}
      >
        <EmployeeSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-2 md:ml-28 transition-all duration-300 w-full">
        <header className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <h1 className="text-2xl font-bold">👋 Welcome Back</h1>
          <div className="flex items-center gap-4">
            {darkMode ? (
              <FaSun
                className="cursor-pointer text-yellow-400"
                size={22}
                onClick={() => setDarkMode(false)}
              />
            ) : (
              <FaMoon
                className="cursor-pointer text-gray-700"
                size={22}
                onClick={() => setDarkMode(true)}
              />
            )}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/MyProfile")}
            >
              <img
                src={profilePicture || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-yellow-400"
              />
              <div>
                <div className="font-medium">
                  {loading ? "Loading..." : profile?.name || "Employee"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Employee
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filter */}
        <section
          className={`mb-6 p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"
            }`}
        >
          <h2 className="font-semibold mb-3">📅 Filter Attendance</h2>
          <div className="flex flex-wrap gap-4">
            <select
              className="border rounded px-4 py-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="monthYear">By Month-Year</option>
              <option value="year">By Year</option>
            </select>
            {filterType === "monthYear" ? (
              <input
                type="month"
                className="border rounded px-4 py-2"
                value={filterMonthYear}
                onChange={(e) => setFilterMonthYear(e.target.value)}
              />
            ) : (
              <input
                type="number"
                min="2000"
                max="2100"
                className="border rounded px-4 py-2"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />
            )}

            {/* ADD THIS HERE */}
            {filterType === "monthYear" && (
              <button
                onClick={sendMonthlyReport}
                className="relative text-sm font-semibold text-red-600 hover:text-red-700 border border-red-300 hover:border-red-500 rounded-full px-6 py-2.5 transition-all whitespace-nowrap
             before:absolute before:inset-0 before:rounded-full before:border-2 before:border-red-400 before:animate-glow before:z-[-1]"
              >
                Send Monthly Report
              </button>

            )}
          </div>
        </section>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((item) => {
            const values = {
              "Present Days": presentDays,
              "Absent Days": absentDays,
              "Late Entries": lateEntries,
              "Weekly Offs": weeklyOffCount,
              Holidays: holidaysCount,
              "Approved Leaves": approvedLeavesCount,
            };
            return (
              <div
                key={item.label}
                className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
              >
                <div className="text-3xl text-yellow-500 mb-2">{item.icon}</div>
                <div className="text-sm">{item.label}</div>
                <div className="text-xl font-bold">
                  {loading ? "..." : values[item.label]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <h2 className="font-semibold mb-2">📈 Working Hours Trend</h2>
            <div className="w-full h-[300px]">
              <Line
                data={lineData}
                options={{ maintainAspectRatio: false, responsive: true }}
              />
            </div>
          </div>
          <div
            className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <h2 className="font-semibold mb-2">📊 Attendance Summary</h2>
            <div className="w-full h-[300px]">
              <Pie
                data={{
                  labels: ["Present", "Absent", "Leave", "Holiday", "Weekly Off"],
                  datasets: [
                    {
                      data: [
                        presentDays,
                        absentDays,
                        approvedLeavesCount,
                        holidaysCount,
                        weeklyOffCount,
                      ],
                      backgroundColor: [
                        "#6ed310f3 ",
                        "#dd350aff",
                        "#df7717ff",
                        "#0ed3daf3 ",
                        "#0c08ecff",
                      ],
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false, responsive: true }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;

