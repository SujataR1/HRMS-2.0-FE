import React, { useEffect, useState } from "react";
import jsPDF from "jspdf/dist/jspdf.umd.min.js";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);
import HRSidebar from "../../components/Common/HRSidebar";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HRHolidayCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [filterYear, setFilterYear] = useState("all"); // "all" means no year filter
  const [filterMonth, setFilterMonth] = useState("all"); // "all" means no month filter

  const token = localStorage.getItem("hr_token");
  const formatDate = (date) =>
    date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const todayStr = formatDate(new Date());
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://192.168.0.100:9000/hr/holidays/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fromDate: "2025-01-01", toDate: "2025-12-31" }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        const normalized = data.data.map((h) => ({
          ...h,
          date: h.date.includes(".")
            ? h.date.split(".").reverse().join("-")
            : h.date,
        }));
        setHolidays(normalized);
      } else {
        setError("Failed to fetch holidays");
      }
    } catch (err) {
      setError("Error loading holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
    const stored = localStorage.getItem("hr_holiday_reminders");
    if (stored) setReminders(JSON.parse(stored));
  }, []);

  const openModal = (dateStr) => {
    const existingHoliday = holidays.find((h) => h.date === dateStr);
    if (existingHoliday) {
      setNewHoliday({ name: existingHoliday.name, date: existingHoliday.date });
      setSelectedHoliday(existingHoliday);
    } else {
      setNewHoliday({ name: "", date: dateStr });
      setSelectedHoliday(null);
    }
    setCreateModalOpen(true);
  };

  const handleCreateHoliday = async () => {
    if (!newHoliday.date || !newHoliday.name) return;
    try {
      const res = await fetch("http://192.168.0.100:9000/hr/holiday/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHoliday),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewHoliday({ date: "", name: "" });
        setCreateModalOpen(false);
        fetchHolidays();
      } else {
        alert("Failed to create holiday");
      }
    } catch (err) {
      alert("Error creating holiday");
    }
  };

  const handleEditHoliday = async () => {
    try {
      const res = await fetch("http://192.168.0.100:9000/hr/holidays/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          holidayId: selectedHoliday.id,
          name: newHoliday.name,
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setCreateModalOpen(false);
        fetchHolidays();
      } else {
        alert("Failed to edit holiday");
      }
    } catch (err) {
      alert("Error editing holiday");
    }
  };

  const downloadHolidayPDF = () => {
    if (!filteredHolidays || filteredHolidays.length === 0) {
      alert("No holidays to export for the selected month/year.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let heading = "Holiday Calendar";

    if (filterYear !== "all" && filterMonth !== "all") {
      heading += ` - ${monthNames[filterMonth]} ${filterYear}`;
    } else if (filterYear !== "all") {
      heading += ` - ${filterYear}`;
    } else if (filterMonth !== "all") {
      heading += ` - ${monthNames[filterMonth]}`;
    } else {
      heading += " - All Years & Months";
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
          month: "short",
          day: "numeric",
        }),
      ]);

    doc.autoTable({
      head: [["#", "Holiday Name", "Date"]],
      body: rows,
      startY: 30,
      theme: "striped",
      styles: { halign: "left" },
      headStyles: { fillColor: [255, 204, 0] },
    });

    doc.save(`Holiday_Calendar_${filterYear}_${filterMonth + 1}.pdf`);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    calendarDays.push(new Date(year, month, d));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const filteredHolidays = holidays.filter((h) => {
    const d = new Date(h.date);
    const yearMatch = filterYear === "all" || d.getFullYear() === Number(filterYear);
    const monthMatch = filterMonth === "all" || d.getMonth() === Number(filterMonth);
    return yearMatch && monthMatch;
  });

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200 font-sans">
        <HRSidebar />
        <main className="ml-64 flex flex-col justify-center items-center flex-1 p-8">
          <section className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full border border-yellow-300 ring-1 ring-yellow-400 ring-opacity-30">
            <header className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="text-yellow-700 p-2">
                ←
              </button>
              <h1 className="text-3xl font-extrabold text-yellow-900">
                {currentDate.toLocaleString("default", {
                  month: "long",
                })}{" "}
                {year}
              </h1>
              <button onClick={nextMonth} className="text-yellow-700 p-2">
                →
              </button>
            </header>

            <button
              className="mb-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              onClick={() => {
                setCreateModalOpen(true);
                setNewHoliday({ date: "", name: "" });
                setSelectedHoliday(null);
              }}
            >
              + Add Holiday
            </button>

            <div className="grid grid-cols-7 gap-3 mb-4 text-center text-yellow-800 font-semibold uppercase">
              {daysOfWeek.map((day, i) => (
                <div key={i}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3 mb-6">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={idx} />;
                const dateStr = formatDate(date);
                const isToday = dateStr === todayStr;
                const holiday = holidays.find((h) => h.date === dateStr);
                const isWeekend =
                  date.getDay() === 0 || date.getDay() === 6;
                const remind = reminders[dateStr];

                return (
                  <button
                    key={idx}
                    onClick={() => openModal(dateStr)}
                    className={`cursor-pointer p-3 rounded-lg flex flex-col justify-between shadow-sm
                      hover:scale-[1.05] transition-transform
                      focus:outline-none focus:ring-4 focus:ring-yellow-400
                      ${isToday
                        ? "bg-yellow-300 ring-2 ring-yellow-500 font-bold"
                        : holiday
                          ? "bg-yellow-100"
                          : isWeekend
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-white"
                      }`}
                    title={holiday ? `${holiday.name} (${dateStr})` : dateStr}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg">{date.getDate()}</span>
                      {remind && (
                        <span className="ml-2 text-xs bg-red-400 rounded px-1 text-white">
                          ⏰
                        </span>
                      )}
                    </div>
                    {holiday && (
                      <div className="mt-1 text-xs font-semibold">
                        {holiday.name}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Filters for Month and Year */}
            <div className="mb-4 flex gap-4 items-center">
              <label className="font-semibold text-yellow-800" htmlFor="filterYear">
                Year:
              </label>
              <select
                id="filterYear"
                className="border border-yellow-300 rounded p-1"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">All Years</option>
                {[2023, 2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}

              </select>

              <label className="font-semibold text-yellow-800" htmlFor="filterMonth">
                Month:
              </label>
              <select
                id="filterMonth"
                className="border border-yellow-300 rounded p-1"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtered Upcoming Holidays */}
            <div className="mt-8 w-full">
              <h2 className="text-xl font-bold mb-4 text-yellow-800">
                {filterYear === "all" && filterMonth === "all"
                  ? "All Holidays"
                  : `Holidays${filterMonth !== "all" ? " in " + [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ][filterMonth] : ""}${filterYear !== "all" ? " " + filterYear : ""}`}
              </h2>

              <ul className="bg-white p-4 rounded-xl shadow border border-yellow-300 max-h-60 overflow-y-auto">
                {filteredHolidays.length > 0 ? (
                  filteredHolidays
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((holiday) => (
                      <li
                        key={holiday.id}
                        className="flex justify-between py-2 border-b border-yellow-100"
                      >
                        <span className="font-medium text-yellow-700">{holiday.name}</span>
                        <span className="text-sm text-gray-600">
                          {new Date(holiday.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </li>
                    ))
                ) : (
                  <li className="text-gray-500 italic">No holidays found.</li>
                )}
              </ul>
              <button
                onClick={downloadHolidayPDF}
                className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Download Holiday List (PDF)
              </button>
            </div>
          </section>
        </main>
      </div>

      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-yellow-900 mb-4">
              {selectedHoliday ? "Edit Holiday" : "Create Holiday"}
            </h3>
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) =>
                setNewHoliday({ ...newHoliday, date: e.target.value })
              }
              className="w-full p-2 mb-3 border border-yellow-300 rounded"
              readOnly={!!selectedHoliday}
            />
            <input
              type="text"
              placeholder="Holiday Name"
              value={newHoliday.name}
              onChange={(e) =>
                setNewHoliday({ ...newHoliday, name: e.target.value })
              }
              className="w-full p-2 mb-4 border border-yellow-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={
                  selectedHoliday ? handleEditHoliday : handleCreateHoliday
                }
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
              >
                {selectedHoliday ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HRHolidayCalendar;
