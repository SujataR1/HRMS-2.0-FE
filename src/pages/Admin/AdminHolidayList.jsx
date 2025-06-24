import React from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";
import { FaCalendarAlt } from "react-icons/fa";

const holidayData = [
  { occasion: "New Year", date: "01-01-2025", day: "Wednesday" },
  { occasion: "Netaji Birthday", date: "23-01-2025", day: "Thursday" },
  { occasion: "Doljatra", date: "14-03-2025", day: "Friday" },
  { occasion: "May Day", date: "01-05-2025", day: "Thursday" },
  { occasion: "Independence Day", date: "15-08-2025", day: "Friday" },
  { occasion: "Durgapuga-Saptami", date: "29-09-2025", day: "Monday" },
  { occasion: "Durgapuga-Astomi", date: "30-09-2025", day: "Tuesday" },
  { occasion: "Durgapuga-Navami", date: "01-10-2025", day: "Wednesday" },
  { occasion: "Gandhiji Birth Day", date: "02-10-2025", day: "Thursday" },
  { occasion: "Laksmi Puja", date: "06-10-2025", day: "Monday" },
  { occasion: "Kali Puja", date: "20-10-2025", day: "Monday" },
  { occasion: "Christmas Day", date: "25-12-2025", day: "Thursday" },
];

const AdminHolidayList = () => {
  return (
    <div className="flex min-h-screen bg-yellow-50 font-sans">
      <AdminSidebar />

      <main className="flex-grow p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8 space-x-3">
            <FaCalendarAlt className="text-yellow-600 text-4xl" />
            <h1 className="text-4xl font-extrabold text-yellow-900 tracking-wide">
              Holiday List
            </h1>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-2xl shadow-2xl border border-yellow-300 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-yellow-900 font-semibold uppercase tracking-wider text-sm select-none">
              <div className="px-8 py-4 border-r border-yellow-500">Occasion</div>
              <div className="px-8 py-4 border-r border-yellow-500">Date</div>
              <div className="px-8 py-4">Day</div>
            </div>

            {/* Table body with zebra stripes & hover effect */}
            <div className="divide-y divide-yellow-200">
              {holidayData.map(({ occasion, date, day }, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-3 px-8 py-5 cursor-default transition-all duration-300 ${
                    idx % 2 === 0 ? "bg-yellow-50" : "bg-yellow-100"
                  } hover:bg-yellow-200`}
                >
                  <div className="flex items-center font-semibold text-yellow-900">
                    {/* Icon before occasion (optional) */}
                    <FaCalendarAlt className="mr-3 text-yellow-500" />
                    {occasion}
                  </div>
                  <div className="text-yellow-700 font-mono">{date}</div>
                  <div className="text-yellow-800 font-medium">{day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHolidayList;
