import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";
import { MdOutlineUpdate, MdCheckCircle, MdClose } from "react-icons/md";

const generateFinancialYears = (startYear, count = 10) => {
  const years = [];
  for (let i = 0; i < count; i++) {
    const fromYear = startYear + i;
    const toYear = fromYear + 1;
    years.push(`${fromYear}-${toYear}`);
  }
  return years;
};

// Dummy audit trail data (would come from API in real app)
const dummyAuditTrail = [
  { id: 1, year: "2023-2024", changedBy: "AdminUser1", date: "2024-01-15" },
  { id: 2, year: "2022-2023", changedBy: "AdminUser2", date: "2023-01-10" },
  { id: 3, year: "2021-2022", changedBy: "AdminUser3", date: "2022-01-12" },
];

const Alert = ({ type = "success", children, onClose }) => {
  const colors = {
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    error: "bg-red-50 text-red-700",
  };
  const icons = {
    success: <MdCheckCircle className="w-6 h-6" />,
    warning: <MdOutlineUpdate className="w-6 h-6" />,
    error: <MdClose className="w-6 h-6" />,
  };
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-md ${colors[type]} max-w-md mx-auto mb-6`}
      role="alert"
    >
      <div className="flex items-center space-x-3">
        <div>{icons[type]}</div>
        <p className="font-semibold text-lg">{children}</p>
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss alert"
        className="text-xl font-bold hover:text-opacity-80 transition"
      >
        &times;
      </button>
    </div>
  );
};

const AdminFinancialYear = () => {
  const [currentFY, setCurrentFY] = useState("2024-2025");
  const [selectedFY, setSelectedFY] = useState(currentFY);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  const financialYears = generateFinancialYears(2020, 10);

  const handleChange = (e) => {
    setSelectedFY(e.target.value);
    setMessage("");
  };

  const handleSave = () => {
    if (selectedFY === currentFY) {
      setMessageType("warning");
      setMessage("No changes to save.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setCurrentFY(selectedFY);
      setMessageType("success");
      setMessage(`Financial Year updated to ${selectedFY}`);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 font-sans">
      <AdminSidebar />

      <main className="ml-64 flex flex-col items-center justify-start p-10 w-full min-h-screen">
        <div
          className="max-w-4xl w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-2xl border border-yellow-300 p-14 space-y-12
          hover:shadow-yellow-400 transition-shadow duration-500"
        >
          <header className="flex items-center space-x-4">
            <MdOutlineUpdate size={36} className="text-yellow-600 drop-shadow" />
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-md">
              Financial Year Management
            </h1>
          </header>

          {message && (
            <Alert type={messageType} onClose={() => setMessage("")}>
              {message}
            </Alert>
          )}

          {/* Financial Year Selector */}
          <section className="space-y-6">
            <label
              htmlFor="financialYear"
              className="block text-gray-800 font-semibold text-2xl"
            >
              Select Financial Year
            </label>
            <select
              id="financialYear"
              value={selectedFY}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-gray-900 text-xl
                focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-shadow shadow-sm"
            >
              {financialYears.map((fy) => (
                <option key={fy} value={fy}>
                  {fy}
                </option>
              ))}
            </select>

            <p className="text-gray-700 text-xl">
              <strong>Current Financial Year:</strong>{" "}
              <span className="text-yellow-600 font-extrabold">{currentFY}</span>
            </p>

            <button
              onClick={handleSave}
              disabled={loading}
              className={`mt-4 w-full
                rounded-3xl
                font-bold
                py-4
                text-white
                shadow-lg
                bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700
                active:scale-95
                transition
                flex justify-center items-center
                space-x-3
                ${loading ? "cursor-not-allowed opacity-70" : ""}
              `}
              aria-label="Save financial year"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </section>

          {/* Audit Trail Timeline */}
          <section>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 select-none">
              Audit Trail - Financial Year Changes
            </h2>
            {dummyAuditTrail.length === 0 ? (
              <p className="text-center text-gray-500 italic text-lg">No audit records found.</p>
            ) : (
              <ul className="relative border-l-4 border-yellow-400 ml-6 space-y-8">
                {dummyAuditTrail.map(({ id, year, changedBy, date }, idx) => (
                  <li key={id} className="relative pl-6">
                    {/* Timeline dot */}
                    <span
                      className={`absolute -left-4 top-2 w-6 h-6 rounded-full border-4 border-yellow-400 bg-white shadow-lg`}
                    />
                    <div className="text-gray-900 font-semibold text-xl">{year}</div>
                    <div className="text-yellow-600 font-semibold text-lg">Changed By: {changedBy}</div>
                    <div className="text-gray-600 text-sm mt-1">Date: {date}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminFinancialYear;
