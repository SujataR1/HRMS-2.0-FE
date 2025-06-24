import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HRHolidayCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [modalText, setModalText] = useState("");

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    setLoading(true);
    setError(null);

    const holidayList2025 = [
      { date: "2025-01-01", name: "New Year" },
      { date: "2025-01-23", name: "Netaji Birthday" },
      { date: "2025-03-14", name: "Doljatra" },
      { date: "2025-05-01", name: "May Day" },
      { date: "2025-08-15", name: "Independence Day" },
      { date: "2025-09-29", name: "Durgapuga‑Saptami" },
      { date: "2025-09-30", name: "Durgapuga‑Astomi" },
      { date: "2025-10-01", name: "Durgapuga‑Navami" },
      { date: "2025-10-02", name: "Gandhiji Birth Day" },
      { date: "2025-10-06", name: "Laksmi Puja" },
      { date: "2025-10-20", name: "Kali Puja" },
      { date: "2025-12-25", name: "Christmas Day" },
    ];

    setTimeout(() => {
      setHolidays(holidayList2025);
      setLoading(false);
    }, 300);
  }, [currentDate]);

  useEffect(() => {
    const stored = localStorage.getItem("hr_holiday_reminders");
    if (stored) setReminders(JSON.parse(stored));
  }, []);

  // Open modal on date click
  const openModal = (dateStr) => {
    setModalDate(dateStr);
    setModalText(reminders[dateStr] || "");
    setModalOpen(true);
  };

  // Save reminder and close modal
  const saveReminder = () => {
    const updated = { ...reminders };
    if (modalText.trim() === "") delete updated[modalDate];
    else updated[modalDate] = modalText.trim();

    setReminders(updated);
    localStorage.setItem("hr_holiday_reminders", JSON.stringify(updated));
    setModalOpen(false);
  };

  const cancelModal = () => {
    setModalOpen(false);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(year, month, d));

  const todayStr = formatDate(new Date());
  const todayISO = todayStr;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const upcomingHolidays = holidays
    .filter((h) => h.date >= todayISO)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200 font-sans">
        <HRSidebar />

        <main className="ml-64 flex flex-col justify-center items-center flex-1 p-8">
          <section
            className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full
                     border border-yellow-300 ring-1 ring-yellow-400 ring-opacity-30"
          >
            <header className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="text-yellow-700 hover:text-yellow-900 p-2 rounded-full focus:ring-4 focus:ring-yellow-400"
                aria-label="Previous Month"
              >
                ←
              </button>
              <h1 className="text-3xl font-extrabold text-yellow-900 tracking-wide" aria-live="polite">
                {currentDate.toLocaleString("default", { month: "long" })} {year}
              </h1>
              <button
                onClick={nextMonth}
                className="text-yellow-700 hover:text-yellow-900 p-2 rounded-full focus:ring-4 focus:ring-yellow-400"
                aria-label="Next Month"
              >
                →
              </button>
            </header>

            {loading ? (
              <p className="text-center text-yellow-700 animate-pulse font-semibold">Loading…</p>
            ) : error ? (
              <p className="text-center text-red-600 font-semibold">{error}</p>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-3 mb-4 text-center text-yellow-800 font-semibold uppercase select-none">
                  {daysOfWeek.map((day, i) => (
                    <div key={i} className={i === 0 || i === 6 ? "text-yellow-600" : ""}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-3 mb-6">
                  {calendarDays.map((date, idx) => {
                    if (!date) return <div key={idx} />;

                    const dateStr = formatDate(date);
                    const isToday = dateStr === todayStr;
                    const holiday = holidays.find((h) => h.date === dateStr);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const remind = reminders[dateStr];

                    return (
                      <button
                        key={idx}
                        onClick={() => openModal(dateStr)}
                        className={`cursor-pointer p-3 rounded-lg flex flex-col justify-between shadow-sm
                          hover:scale-[1.05] transition-transform
                          focus:outline-none focus:ring-4 focus:ring-yellow-400
                          ${
                            isToday
                              ? "bg-yellow-300 ring-2 ring-yellow-500 font-bold"
                              : holiday
                              ? "bg-yellow-100"
                              : isWeekend
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-white"
                          }
                        `}
                        title={holiday ? `${holiday.name} (${dateStr})` : dateStr}
                        aria-label={`Set reminder for ${dateStr}${holiday ? ", holiday: " + holiday.name : ""}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-lg">{date.getDate()}</span>
                          {remind && (
                            <span
                              className="ml-2 text-xs bg-red-400 rounded px-1 text-white select-none"
                              aria-hidden="true"
                            >
                              ⏰
                            </span>
                          )}
                        </div>
                        {holiday && <div className="mt-1 text-xs font-semibold">{holiday.name}</div>}
                      </button>
                    );
                  })}
                </div>

                <section className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
                  <h2 className="text-yellow-900 font-bold mb-2">Upcoming Holidays</h2>
                  <ul className="space-y-1">
                    {upcomingHolidays.length === 0 ? (
                      <li>No upcoming holidays</li>
                    ) : (
                      upcomingHolidays.map((h, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{h.name}</span>
                          <span className="font-mono">{h.date}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </section>

                <section className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
                  <h2 className="text-yellow-900 font-bold mb-2">My Reminders</h2>
                  {Object.keys(reminders).length === 0 ? (
                    <p>No reminders set.</p>
                  ) : (
                    <ul className="space-y-1">
                      {Object.entries(reminders).map(([d, text]) => (
                        <li key={d} className="flex justify-between">
                          <span>{d}</span>
                          <span className="italic">{text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}
          </section>
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={cancelModal}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title" className="text-xl font-bold text-yellow-900 mb-4">
              Set Reminder for {modalDate}
            </h3>

            <textarea
              autoFocus
              rows={4}
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder="Type your reminder here..."
              className="w-full p-3 border border-yellow-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={cancelModal}
                className="px-4 py-2 rounded-lg bg-yellow-200 text-yellow-900 font-semibold hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Cancel
              </button>
              <button
                onClick={saveReminder}
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HRHolidayCalendar;
