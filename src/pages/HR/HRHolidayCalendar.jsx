// Dynamic HR holiday calendar with create, fetch, and edit API integration
import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HRHolidayCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [modalText, setModalText] = useState("");

  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const token = localStorage.getItem("hr_token");

  const formatDate = (date) => date.toISOString().split("T")[0];

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://192.168.0.100:9000/hr/holidays/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fromDate: "2025-01-01", toDate: "2025-12-31" })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setHolidays(data.data);
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
    setModalDate(dateStr);
    setModalText(reminders[dateStr] || "");
    const existingHoliday = holidays.find(h => h.date === dateStr);
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
          name: newHoliday.name
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

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200 font-sans">
        <HRSidebar />
        <main className="ml-64 flex flex-col justify-center items-center flex-1 p-8">
          <section className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full border border-yellow-300 ring-1 ring-yellow-400 ring-opacity-30">
            <header className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="text-yellow-700 hover:text-yellow-900 p-2">←</button>
              <h1 className="text-3xl font-extrabold text-yellow-900">
                {currentDate.toLocaleString("default", { month: "long" })} {year}
              </h1>
              <button onClick={nextMonth} className="text-yellow-700 hover:text-yellow-900 p-2">→</button>
            </header>

            <button
              className="mb-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              onClick={() => { setCreateModalOpen(true); setNewHoliday({ date: "", name: "" }); setSelectedHoliday(null); }}
            >
              + Add Holiday
            </button>

            <div className="grid grid-cols-7 gap-3 mb-4 text-center text-yellow-800 font-semibold uppercase">
              {daysOfWeek.map((day, i) => <div key={i}>{day}</div>)}
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
                        isToday ? "bg-yellow-300 ring-2 ring-yellow-500 font-bold" :
                        holiday ? "bg-yellow-100" :
                        isWeekend ? "bg-yellow-50 text-yellow-600" : "bg-white"
                      }`}
                    title={holiday ? `${holiday.name} (${dateStr})` : dateStr}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg">{date.getDate()}</span>
                      {remind && <span className="ml-2 text-xs bg-red-400 rounded px-1 text-white">⏰</span>}
                    </div>
                    {holiday && <div className="mt-1 text-xs font-semibold">{holiday.name}</div>}
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-yellow-900 mb-4">{selectedHoliday ? "Edit Holiday" : "Create Holiday"}</h3>
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
              className="w-full p-2 mb-3 border border-yellow-300 rounded"
              readOnly={!!selectedHoliday}
            />
            <input
              type="text"
              placeholder="Holiday Name"
              value={newHoliday.name}
              onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
              className="w-full p-2 mb-4 border border-yellow-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setCreateModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button
                onClick={selectedHoliday ? handleEditHoliday : handleCreateHoliday}
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




// import React, { useEffect, useState } from "react";
// import HRSidebar from "../../components/Common/HRSidebar";

// const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// const HRHolidayCalendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [holidays, setHolidays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reminders, setReminders] = useState({});

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalDate, setModalDate] = useState("");
//   const [modalText, setModalText] = useState("");
//   const [editingHoliday, setEditingHoliday] = useState(null); // null = create mode

//   const formatDate = (date) => date.toISOString().split("T")[0];

//   // Fetch holidays for current year
//   const fetchHolidays = async () => {
//     const token = localStorage.getItem("hr_token");
//     if (!token) {
//       setError("Authentication token not found");
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     setError(null);

//     const year = currentDate.getFullYear();
//     try {
//       const res = await fetch("http://192.168.0.100:9000/hr/holidays/view", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           fromDate: `${year}-01-01`,
//           toDate: `${year}-12-31`,
//         }),
//       });
//       const data = await res.json();
//       if (data.status === "success" && Array.isArray(data.data)) {
//         setHolidays(data.data);
//       } else {
//         setError("Failed to load holidays");
//       }
//     } catch {
//       setError("Network error loading holidays");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHolidays();
//   }, [currentDate]);

//   useEffect(() => {
//     const stored = localStorage.getItem("hr_holiday_reminders");
//     if (stored) setReminders(JSON.parse(stored));
//   }, []);

//   // Open modal for given date; editingHoliday null means create mode
//   const openModal = (dateStr = "", holiday = null) => {
//     setModalDate(dateStr);
//     setEditingHoliday(holiday);
//     setModalText(holiday ? holiday.name : "");
//     setModalOpen(true);
//   };

//   const saveReminderToLocal = (dateStr, text) => {
//     const updated = { ...reminders };
//     if (text.trim() === "") delete updated[dateStr];
//     else updated[dateStr] = text.trim();

//     setReminders(updated);
//     localStorage.setItem("hr_holiday_reminders", JSON.stringify(updated));
//   };

//   // Save (create or edit) holiday
//   const handleModalSave = async () => {
//     if (!modalDate) {
//       alert("Please select a date");
//       return;
//     }
//     const trimmedText = modalText.trim();
//     if (trimmedText === "") {
//       alert("Holiday name cannot be empty");
//       return;
//     }

//     const token = localStorage.getItem("hr_token");
//     if (!token) {
//       alert("Authentication token missing");
//       return;
//     }

//     try {
//       if (editingHoliday) {
//         // Edit existing holiday
//         const res = await fetch("http://192.168.0.100:9000/hr/holidays/edit", {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             holidayId: editingHoliday.id,
//             name: trimmedText,
//           }),
//         });
//         const data = await res.json();
//         if (data.status === "success") {
//           setHolidays((prev) =>
//             prev.map((h) =>
//               h.id === editingHoliday.id ? { ...h, name: trimmedText } : h
//             )
//           );
//           saveReminderToLocal(modalDate, "");
//           setModalOpen(false);
//         } else {
//           alert("Failed to update holiday");
//         }
//       } else {
//         // Create new holiday
//         const res = await fetch("http://192.168.0.100:9000/hr/holiday/create", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             date: modalDate,
//             name: trimmedText,
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           setHolidays((prev) => [
//             ...prev,
//             {
//               id: data.data.id,
//               name: data.data.name,
//               date: modalDate,
//               forShiftId: data.data.forShiftId,
//               isActive: data.data.isActive,
//             },
//           ]);
//           saveReminderToLocal(modalDate, "");
//           setModalOpen(false);
//         } else {
//           alert("Failed to create holiday");
//         }
//       }
//     } catch {
//       alert("Network error saving holiday");
//     }
//   };

//   const cancelModal = () => setModalOpen(false);

//   // Calendar setup
//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();
//   const firstDayOfMonth = new Date(year, month, 1);
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const startDay = firstDayOfMonth.getDay();

//   const calendarDays = [];
//   for (let i = 0; i < startDay; i++) calendarDays.push(null);
//   for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(year, month, d));

//   const todayStr = formatDate(new Date());

//   const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
//   const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

//   const upcomingHolidays = holidays
//     .filter((h) => h.date >= todayStr)
//     .sort((a, b) => (a.date > b.date ? 1 : -1))
//     .slice(0, 5);

//   return (
//     <>
//       <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200 font-sans">
//         <HRSidebar />

//         <main className="ml-64 flex flex-col justify-center items-center flex-1 p-8">
//           <section
//             className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full border border-yellow-300 ring-1 ring-yellow-400 ring-opacity-30"
//           >
//             <header className="flex items-center justify-between mb-6">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={prevMonth}
//                   className="text-yellow-700 hover:text-yellow-900 p-2 rounded-full focus:ring-4 focus:ring-yellow-400"
//                   aria-label="Previous Month"
//                 >
//                   ←
//                 </button>

//                 <h1 className="text-3xl font-extrabold text-yellow-900 tracking-wide" aria-live="polite">
//                   {currentDate.toLocaleString("default", { month: "long" })} {year}
//                 </h1>

//                 <button
//                   onClick={nextMonth}
//                   className="text-yellow-700 hover:text-yellow-900 p-2 rounded-full focus:ring-4 focus:ring-yellow-400"
//                   aria-label="Next Month"
//                 >
//                   →
//                 </button>
//               </div>

//               <button
//                 onClick={() => openModal(formatDate(new Date(year, month, 1)), null)}
//                 className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-400"
//                 aria-label="Add Holiday"
//               >
//                 Add Holiday
//               </button>
//             </header>

//             {loading ? (
//               <p className="text-center text-yellow-700 animate-pulse font-semibold">Loading…</p>
//             ) : error ? (
//               <p className="text-center text-red-600 font-semibold">{error}</p>
//             ) : (
//               <>
//                 <div className="grid grid-cols-7 gap-3 mb-4 text-center text-yellow-800 font-semibold uppercase select-none">
//                   {daysOfWeek.map((day, i) => (
//                     <div key={i} className={i === 0 || i === 6 ? "text-yellow-600" : ""}>
//                       {day}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-7 gap-3 mb-6">
//                   {calendarDays.map((date, idx) => {
//                     if (!date) return <div key={idx} />;

//                     const dateStr = formatDate(date);
//                     const isToday = dateStr === todayStr;
//                     const holiday = holidays.find((h) => h.date === dateStr);
//                     const isWeekend = date.getDay() === 0 || date.getDay() === 6;
//                     const remind = reminders[dateStr];

//                     return (
//                       <button
//                         key={idx}
//                         onClick={() => openModal(dateStr, holiday)}
//                         className={`cursor-pointer p-3 rounded-lg flex flex-col justify-between shadow-sm
//                           hover:scale-[1.05] transition-transform
//                           focus:outline-none focus:ring-4 focus:ring-yellow-400
//                           ${
//                             isToday
//                               ? "bg-yellow-300 ring-2 ring-yellow-500 font-bold"
//                               : holiday
//                               ? "bg-yellow-100"
//                               : isWeekend
//                               ? "bg-yellow-50 text-yellow-600"
//                               : "bg-white"
//                           }
//                         `}
//                         title={holiday ? `${holiday.name} (${dateStr})` : dateStr}
//                         aria-label={`Set holiday or reminder for ${dateStr}${holiday ? ", holiday: " + holiday.name : ""}`}
//                       >
//                         <div className="flex justify-between items-center">
//                           <span className="text-lg">{date.getDate()}</span>
//                           {remind && (
//                             <span
//                               className="ml-2 text-xs bg-red-400 rounded px-1 text-white select-none"
//                               aria-hidden="true"
//                             >
//                               ⏰
//                             </span>
//                           )}
//                         </div>
//                         {holiday && <div className="mt-1 text-xs font-semibold">{holiday.name}</div>}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <section className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
//                   <h2 className="text-yellow-900 font-bold mb-2">Upcoming Holidays</h2>
//                   <ul className="space-y-1">
//                     {upcomingHolidays.length === 0 ? (
//                       <li>No upcoming holidays</li>
//                     ) : (
//                       upcomingHolidays.map((h) => (
//                         <li key={h.id} className="flex justify-between items-center">
//                           <span>{h.name}</span>
//                           <div className="flex items-center space-x-4">
//                             <span className="font-mono">{h.date}</span>
//                             <button
//                               onClick={() => openModal(h.date, h)}
//                               className="text-yellow-700 hover:text-yellow-900 font-semibold text-sm px-2 py-1 border border-yellow-700 rounded"
//                               aria-label={`Edit holiday ${h.name} on ${h.date}`}
//                             >
//                               Edit
//                             </button>
//                           </div>
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 </section>

//                 <section className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
//                   <h2 className="text-yellow-900 font-bold mb-2">My Reminders</h2>
//                   {Object.keys(reminders).length === 0 ? (
//                     <p>No reminders set.</p>
//                   ) : (
//                     <ul className="space-y-1">
//                       {Object.entries(reminders).map(([d, text]) => (
//                         <li key={d} className="flex justify-between">
//                           <span>{d}</span>
//                           <span className="italic">{text}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </section>
//               </>
//             )}
//           </section>
//         </main>
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <div
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-title"
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
//         >
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
//             <h3
//               id="modal-title"
//               className="text-xl font-semibold text-yellow-900 mb-4"
//             >
//               {editingHoliday ? "Edit Holiday" : "Add Holiday"}
//             </h3>

//             <label htmlFor="holiday-date" className="block text-yellow-700 font-semibold mb-1">
//               Date
//             </label>
//             <input
//               type="date"
//               id="holiday-date"
//               className="w-full border border-yellow-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               value={modalDate}
//               onChange={(e) => setModalDate(e.target.value)}
//               disabled={!!editingHoliday}
//             />

//             <label htmlFor="holiday-name" className="block text-yellow-700 font-semibold mb-1">
//               Holiday Name
//             </label>
//             <input
//               type="text"
//               id="holiday-name"
//               className="w-full border border-yellow-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               value={modalText}
//               onChange={(e) => setModalText(e.target.value)}
//               placeholder="Enter holiday name"
//             />

//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={cancelModal}
//                 className="px-4 py-2 rounded-lg border border-yellow-400 text-yellow-700 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleModalSave}
//                 className="px-4 py-2 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default HRHolidayCalendar;
