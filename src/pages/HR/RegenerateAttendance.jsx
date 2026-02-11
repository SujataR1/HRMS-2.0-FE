import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const REGENERATE_ATTENDANCE_API =
    "https://backend.hrms.transev.site/hr/attendance/generate";

const RegenerateAttendance = () => {
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [error, setError] = useState("");

    const [regenEmployeeId, setRegenEmployeeId] = useState("");
    const [regenType, setRegenType] = useState("date");
    const [regenDate, setRegenDate] = useState("");
    const [regenMonth, setRegenMonth] = useState(
        String(new Date().getMonth() + 1)
    );
    const [regenYear, setRegenYear] = useState(
        String(new Date().getFullYear())
    );

    const [regenLoading, setRegenLoading] = useState(false);
    const [regenMessage, setRegenMessage] = useState("");
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [progressText, setProgressText] = useState("");


    // ================= FETCH ALL EMPLOYEES (FIXED & SAFE) =================
    useEffect(() => {
        setLoadingEmployees(true);
        fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
            },
        })
            .then((res) =>
                res.json().then((d) => (res.ok ? d.data : Promise.reject(d.message)))
            )
            .then((data) => {
                setEmployees(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                setError(err || "Failed to load employees");
                setEmployees([]);
            })
            .finally(() => setLoadingEmployees(false));
    }, []);

    // ================= REGENERATE HANDLER =================
const handleRegenerate = async () => {
  if (regenLoading) return;

  setRegenLoading(true);
  setRegenMessage("");
  setProgressText("Starting regeneration...");

  try {
    let payload = {};

    if (regenEmployeeId) payload.employeeId = regenEmployeeId;

    if (regenType === "date") {
      if (!regenDate) {
        alert("Please select a date");
        setRegenLoading(false);
        return;
      }
      payload.date = regenDate;
    }

    if (regenType === "month") {
      payload.monthYear = `${String(regenMonth).padStart(2, "0")}-${regenYear}`;
    }

    if (regenType === "year") {
      payload.year = String(regenYear);
    }

    setProgressText(
      isAllSelected
        ? "Regenerating attendance for all employees..."
        : "Regenerating attendance..."
    );

    const res = await fetch(REGENERATE_ATTENDANCE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed");

    setRegenMessage("✅ Attendance regenerated successfully");
    setProgressText("Completed successfully");
  } catch (error) {
    setRegenMessage(`❌ ${error.message}`);
    setProgressText("");
  } finally {
    setRegenLoading(false);
  }
};


    return (
  <div className="flex min-h-screen bg-yellow-50">
    <HRSidebar />

    <main className="flex-1 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-yellow-200 overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-yellow-200 bg-yellow-50">
          <h1 className="text-2xl font-bold text-yellow-800">
            Regenerate Attendance
          </h1>
          <p className="text-sm text-yellow-700 mt-1">
            Safely rebuild attendance records with controlled regeneration
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {loadingEmployees ? (
            <p className="text-yellow-700">Loading employees...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Employee */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-yellow-800 mb-1">
                  Employee
                </label>
                <select
                  value={regenEmployeeId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRegenEmployeeId(value);
                    setIsAllSelected(value === "");
                  }}
                  className="w-full rounded-lg border border-yellow-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>

                {isAllSelected && (
                  <div className="mt-2 rounded-lg bg-yellow-100 border border-yellow-300 px-3 py-2 text-xs text-yellow-800">
                    ⚠️ You are about to regenerate attendance for <b>ALL employees</b>
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-yellow-800 mb-1">
                  Regenerate Type
                </label>
                <select
                  value={regenType}
                  onChange={(e) => setRegenType(e.target.value)}
                  className="w-full rounded-lg border border-yellow-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="date">Specific Date</option>
                  <option value="month">Full Month</option>
                  <option value="year">Full Year</option>
                </select>
              </div>

              {/* Date */}
              {regenType === "date" && (
                <div>
                  <label className="block text-sm font-semibold text-yellow-800 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={regenDate}
                    onChange={(e) => setRegenDate(e.target.value)}
                    className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              )}

              {/* Month */}
              {regenType === "month" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-yellow-800 mb-1">
                      Month
                    </label>
                    <select
                      value={regenMonth}
                      onChange={(e) => setRegenMonth(e.target.value)}
                      className="w-full rounded-lg border border-yellow-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {[
                        "January", "February", "March", "April",
                        "May", "June", "July", "August",
                        "September", "October", "November", "December"
                      ].map((month, index) => (
                        <option key={index} value={String(index + 1)}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-yellow-800 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={regenYear}
                      onChange={(e) => setRegenYear(e.target.value)}
                      className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </>
              )}

              {/* Year */}
              {regenType === "year" && (
                <div>
                  <label className="block text-sm font-semibold text-yellow-800 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={regenYear}
                    onChange={(e) => setRegenYear(e.target.value)}
                    className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action */}
          <button
            onClick={() => {
              if (isAllSelected) {
                setShowConfirmModal(true);
              } else {
                handleRegenerate();
              }
            }}
            disabled={regenLoading}
            className="w-full rounded-xl bg-yellow-500 py-3 text-sm font-semibold text-white
                       shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2
                       focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {regenLoading ? "Processing..." : "Regenerate Attendance"}
          </button>

          {regenMessage && (
            <p className="text-center text-sm font-medium text-gray-700">
              {regenMessage}
            </p>
          )}
        </div>
      </div>
    </main>

    {/* Confirm Modal */}
    {showConfirmModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
          <div className="px-6 py-4 border-b border-yellow-200">
            <h2 className="text-lg font-bold text-yellow-800">
              Confirm Bulk Regeneration
            </h2>
          </div>

          <div className="px-6 py-5 text-sm text-gray-700">
            This will regenerate attendance for <b>ALL employees</b>.
            <br />
            This action may take several minutes and cannot be undone.
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                setShowConfirmModal(false);
                handleRegenerate();
              }}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              Yes, Regenerate
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default RegenerateAttendance;
