import React, { useState, useEffect, useRef } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const MultiSelectDropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    let newSelected;
    if (value === "all") {
      // If 'all' is clicked, toggle select/deselect all
      if (selectedValues.length === options.length - 1) {
        // All selected, so deselect all
        newSelected = [];
      } else {
        // Not all selected, select all (except "all")
        newSelected = options
          .filter((opt) => opt.value !== "all")
          .map((opt) => opt.value);
      }
    } else {
      if (selectedValues.includes(value)) {
        newSelected = selectedValues.filter((v) => v !== value);
      } else {
        newSelected = [...selectedValues, value];
      }
    }
    onChange(newSelected);
  };

  const isAllSelected =
    selectedValues.length === options.length - 1 && options.length > 1;

  // Display selected count or placeholder
  const displayText =
    selectedValues.length === 0
      ? placeholder
      : isAllSelected
      ? `All selected (${selectedValues.length})`
      : `${selectedValues.length} selected`;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block font-semibold text-yellow-900 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full text-left border rounded-lg px-3 py-2 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-500"
            : "bg-white hover:border-yellow-500"
        } flex justify-between items-center`}
      >
        <span className={selectedValues.length === 0 ? "text-gray-400" : ""}>
          {displayText}
        </span>
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            open ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-yellow-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-yellow-50"
            >
              <input
                type="checkbox"
                checked={value === "all" ? isAllSelected : selectedValues.includes(value)}
                onChange={() => toggleOption(value)}
                className="mr-3 cursor-pointer"
                disabled={disabled}
              />
              <span className="text-yellow-900">{label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const HRAttendanceReportGenerate = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingShifts, setLoadingShifts] = useState(true);

  const [reportType, setReportType] = useState("employee"); // employee or shift

  // For multi-select: arrays of selected values
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loadingSend, setLoadingSend] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch employees
  useEffect(() => {
    fetch("http://192.168.0.100:9000/admin/employee-profiles", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      },
    })
      .then((res) => res.json().then((d) => (res.ok ? d.data : Promise.reject(d.message))))
      .then(setEmployees)
      .catch((err) => setError(err))
      .finally(() => setLoadingEmployees(false));
  }, []);

  // Fetch shifts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch("http://192.168.0.100:9000/hr/shifts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setShifts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingShifts(false);
      }
    };
    fetchShifts();
  }, []);

  // Prepare options for dropdowns with "all" option
  const employeeOptions = [
    { value: "all", label: "All Employees" },
    ...employees.map((e) => ({
      value: e.employeeId,
      label: `${e.name} (${e.employeeId})`,
    })),
  ];

  const shiftOptions = [
    { value: "all", label: "All Shifts" },
    ...shifts.map((s) => ({
      value: s.id,
      label: s.shiftName,
    })),
  ];

  const handleSendReport = async () => {
    setError("");
    setMessage("");

    if (!month || !year) {
      setError("⚠️ Month and year are required.");
      return;
    }

    if (reportType === "employee" && selectedEmployees.length === 0) {
      setError("⚠️ Please select at least one employee.");
      return;
    }

    if (reportType === "shift" && selectedShifts.length === 0) {
      setError("⚠️ Please select at least one shift.");
      return;
    }

    setLoadingSend(true);

    const employeeIds =
      reportType === "employee"
        ? selectedEmployees
        : employees.map((e) => e.employeeId);

    const shiftIds =
      reportType === "shift"
        ? selectedShifts
        : shifts.map((s) => s.id);

    // Format monthYear as MM-YYYY
    const formattedMonthYear = `${month.toString().padStart(2, "0")}-${year}`;

    try {
      const res = await fetch(
        "http://192.168.0.100:9000/hr/attendance/send-monthly-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
          body: JSON.stringify({
            monthYear: formattedMonthYear,
            employeeIds,
            shiftIds,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || "Failed to send report");
      setMessage("Report Sent Successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <HRSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="bg-white shadow-lg rounded-2xl border border-yellow-200 p-8 max-w-xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-yellow-800 text-center">
            Monthly Attendance Report
          </h1>

          {(loadingEmployees || loadingShifts) && (
            <p className="text-yellow-600 text-center animate-pulse">
              Loading {loadingEmployees ? "employees" : "shifts"}...
            </p>
          )}

          {!loadingEmployees && !loadingShifts && (
            <>
              {error && (
                <p className="text-red-600 text-center font-semibold">{error}</p>
              )}

              {message && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-yellow-50 border border-yellow-400 rounded-xl shadow-lg max-w-sm w-full p-6 text-center space-y-4">
                    <h2 className="text-2xl font-bold text-yellow-900">
                      {message}
                    </h2>
                    <button
                      onClick={() => setMessage("")}
                      className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}

              {/* Report Type Selector */}
              <div>
                <label className="block font-semibold text-yellow-900 mb-2">
                  Select Report Type
                </label>
                <div className="flex space-x-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="reportType"
                      value="employee"
                      checked={reportType === "employee"}
                      onChange={() => {
                        setReportType("employee");
                        setSelectedShifts([]);
                      }}
                      className="form-radio text-yellow-600"
                      disabled={loadingSend}
                    />
                    <span className="ml-2 text-yellow-900 font-semibold">
                      Select by Employee
                    </span>
                  </label>

                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="reportType"
                      value="shift"
                      checked={reportType === "shift"}
                      onChange={() => {
                        setReportType("shift");
                        setSelectedEmployees([]);
                      }}
                      className="form-radio text-yellow-600"
                      disabled={loadingSend}
                    />
                    <span className="ml-2 text-yellow-900 font-semibold">
                      Select by Shift
                    </span>
                  </label>
                </div>
              </div>

              {/* Month */}
              <div>
                <label className="block font-semibold text-yellow-900 mb-1">
                  Month
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  disabled={loadingSend}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString("en-US", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block font-semibold text-yellow-900 mb-1">
                  Year
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  disabled={loadingSend}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
                    (y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Conditional Multi-Select Dropdown */}
              {reportType === "employee" ? (
                <MultiSelectDropdown
                  label="Employees"
                  options={employeeOptions}
                  selectedValues={selectedEmployees}
                  onChange={setSelectedEmployees}
                  placeholder="Select employees..."
                  disabled={loadingSend}
                />
              ) : (
                <MultiSelectDropdown
                  label="Shifts"
                  options={shiftOptions}
                  selectedValues={selectedShifts}
                  onChange={setSelectedShifts}
                  placeholder="Select shifts..."
                  disabled={loadingSend}
                />
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={handleSendReport}
                  disabled={loadingSend}
                  className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition"
                >
                  {loadingSend ? "Sending..." : "Send Report"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRAttendanceReportGenerate;
