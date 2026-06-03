// import React, { useState, useEffect, useRef } from "react";
// import HRSidebar from "../../components/Common/HRSidebar";

// const MultiSelectDropdown = ({
//   label,
//   options,
//   selectedValues,
//   onChange,
//   placeholder,
//   disabled,
// }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleOption = (value) => {
//     let newSelected;
//     if (value === "all") {
//       // If 'all' is clicked, toggle select/deselect all
//       if (selectedValues.length === options.length - 1) {
//         // All selected, so deselect all
//         newSelected = [];
//       } else {
//         // Not all selected, select all (except "all")
//         newSelected = options
//           .filter((opt) => opt.value !== "all")
//           .map((opt) => opt.value);
//       }
//     } else {
//       if (selectedValues.includes(value)) {
//         newSelected = selectedValues.filter((v) => v !== value);
//       } else {
//         newSelected = [...selectedValues, value];
//       }
//     }
//     onChange(newSelected);
//   };

//   const isAllSelected =
//     selectedValues.length === options.length - 1 && options.length > 1;

//   // Display selected count or placeholder
//  const displayText =
//   selectedValues.length === 0
//     ? placeholder
//     : isAllSelected
//     ? `All selected (${selectedValues.length})`
//     : `${selectedValues.length} selected`;


//   return (
//     <div className="relative" ref={dropdownRef}>
//       <label className="block font-semibold text-yellow-900 mb-1">{label}</label>
//       <button
//         type="button"
//         onClick={() => !disabled && setOpen((o) => !o)}
//         className={`w-full text-left border rounded-lg px-3 py-2 ${
//           disabled
//             ? "bg-gray-100 cursor-not-allowed text-gray-500"
//             : "bg-white hover:border-yellow-500"
//         } flex justify-between items-center`}
//       >
//         <span className={selectedValues.length === 0 ? "text-gray-400" : ""}>
//           {displayText}
//         </span>
//         <svg
//           className={`w-5 h-5 ml-2 transition-transform duration-200 ${
//             open ? "transform rotate-180" : ""
//           }`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>
//       {open && (
//         <div className="absolute z-50 mt-1 w-full bg-white border border-yellow-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//           {options.map(({ value, label }) => {
//   const isChecked = value === "all" ? isAllSelected : selectedValues.includes(value);

//   return (
//     <label
//       key={value}
//       className="flex items-center px-4 py-2 hover:bg-yellow-50 cursor-pointer gap-2"
//     >
//       <input
//         type="checkbox"
//         checked={isChecked}
//         onChange={() => toggleOption(value)}
//         className="cursor-pointer"
//         disabled={disabled}
//       />
//       <span className="text-yellow-900">{label}</span>
//     </label>
//   );
// })}



//         </div>
//       )}
//     </div>
//   );
// };

// const HRAttendanceReportGenerate = () => {
//   const [employees, setEmployees] = useState([]);
//   const [shifts, setShifts] = useState([]);
//   const [loadingEmployees, setLoadingEmployees] = useState(true);
//   const [loadingShifts, setLoadingShifts] = useState(true);

//   const [reportType, setReportType] = useState("employee"); // employee or shift

//   // For multi-select: arrays of selected values
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [selectedShifts, setSelectedShifts] = useState([]);

//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [loadingSend, setLoadingSend] = useState(false);

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   // Fetch employees
//   useEffect(() => {
//     fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//       },
//     })
//       .then((res) => res.json().then((d) => (res.ok ? d.data : Promise.reject(d.message))))
//       .then(setEmployees)
//       .catch((err) => setError(err))
//       .finally(() => setLoadingEmployees(false));
//   }, []);

//   // Fetch shifts
//   useEffect(() => {
//     const fetchShifts = async () => {
//       try {
//         const res = await fetch("https://backend.hrms.transev.site/hr/shifts", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//           },
//         });
//         if (!res.ok) throw new Error(res.statusText);
//         const data = await res.json();
//         setShifts(data.data || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoadingShifts(false);
//       }
//     };
//     fetchShifts();
//   }, []);

//   // Prepare options for dropdowns with "all" option
//   const employeeOptions = [
//     { value: "all", label: "All Employees" },
//     ...employees.map((e) => ({
//       value: e.employeeId,
//       label: `${e.name} (${e.employeeId})`,
//     })),
//   ];

//   const shiftOptions = [
//     { value: "all", label: "All Shifts" },
//     ...shifts.map((s) => ({
//       value: s.id,
//       label: s.shiftName,
//     })),
//   ];

//   const handleSendReport = async () => {
//     setError("");
//     setMessage("");

//     if (!month || !year) {
//       setError("⚠️ Month and year are required.");
//       return;
//     }

//     if (reportType === "employee" && selectedEmployees.length === 0) {
//       setError("⚠️ Please select at least one employee.");
//       return;
//     }

//     if (reportType === "shift" && selectedShifts.length === 0) {
//       setError("⚠️ Please select at least one shift.");
//       return;
//     }

//     setLoadingSend(true);

//     const employeeIds =
//       reportType === "employee"
//         ? selectedEmployees
//         : employees.map((e) => e.employeeId);

//     const shiftIds =
//       reportType === "shift"
//         ? selectedShifts
//         : shifts.map((s) => s.id);

//     // Format monthYear as MM-YYYY
//     const formattedMonthYear = `${month.toString().padStart(2, "0")}-${year}`;

//     try {
//       const res = await fetch(
//         "https://backend.hrms.transev.site/hr/attendance/send-monthly-reports",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//           },
//           body: JSON.stringify({
//             monthYear: formattedMonthYear,
//             employeeIds,
//             shiftIds,
//           }),
//         }
//       );

//       const json = await res.json();
//       if (!res.ok || !json.success)
//         throw new Error(json.message || "Failed to send report");
//       setMessage("Report Sent Successfully!");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingSend(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-yellow-50">
//       <HRSidebar />
//       <main className="ml-64 flex-1 p-8">
//         <div className="bg-white shadow-lg rounded-2xl border border-yellow-200 p-8 max-w-xl mx-auto space-y-8">
//           <h1 className="text-3xl font-bold text-yellow-800 text-center">
//             Monthly Attendance Report
//           </h1>

//           {(loadingEmployees || loadingShifts) && (
//             <p className="text-yellow-600 text-center animate-pulse">
//               Loading {loadingEmployees ? "employees" : "shifts"}...
//             </p>
//           )}

//           {!loadingEmployees && !loadingShifts && (
//             <>
//               {error && (
//                 <p className="text-red-600 text-center font-semibold">{error}</p>
//               )}

//               {message && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                   <div className="bg-yellow-50 border border-yellow-400 rounded-xl shadow-lg max-w-sm w-full p-6 text-center space-y-4">
//                     <h2 className="text-2xl font-bold text-yellow-900">
//                       {message}
//                     </h2>
//                     <button
//                       onClick={() => setMessage("")}
//                       className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
//                     >
//                       OK
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Report Type Selector */}
//               <div>
//                 <label className="block font-semibold text-yellow-900 mb-2">
//                   Select Report Type
//                 </label>
//                 <div className="flex space-x-6">
//                   <label className="inline-flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="reportType"
//                       value="employee"
//                       checked={reportType === "employee"}
//                       onChange={() => {
//                         setReportType("employee");
//                         setSelectedShifts([]);
//                       }}
//                       className="form-radio text-yellow-600"
//                       disabled={loadingSend}
//                     />
//                     <span className="ml-2 text-yellow-900 font-semibold">
//                       Select by Employee
//                     </span>
//                   </label>

//                   <label className="inline-flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="reportType"
//                       value="shift"
//                       checked={reportType === "shift"}
//                       onChange={() => {
//                         setReportType("shift");
//                         setSelectedEmployees([]);
//                       }}
//                       className="form-radio text-yellow-600"
//                       disabled={loadingSend}
//                     />
//                     <span className="ml-2 text-yellow-900 font-semibold">
//                       Select by Shift
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               {/* Month */}
//               <div>
//                 <label className="block font-semibold text-yellow-900 mb-1">
//                   Month
//                 </label>
//                 <select
//                   className="w-full border rounded-lg px-3 py-2"
//                   value={month}
//                   onChange={(e) => setMonth(Number(e.target.value))}
//                   disabled={loadingSend}
//                 >
//                   {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
//                     <option key={m} value={m}>
//                       {new Date(0, m - 1).toLocaleString("en-US", {
//                         month: "long",
//                       })}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Year */}
//               <div>
//                 <label className="block font-semibold text-yellow-900 mb-1">
//                   Year
//                 </label>
//                 <select
//                   className="w-full border rounded-lg px-3 py-2"
//                   value={year}
//                   onChange={(e) => setYear(Number(e.target.value))}
//                   disabled={loadingSend}
//                 >
//                   {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
//                     (y) => (
//                       <option key={y} value={y}>
//                         {y}
//                       </option>
//                     )
//                   )}
//                 </select>
//               </div>

//               {/* Conditional Multi-Select Dropdown */}
//               {reportType === "employee" ? (
//                 <MultiSelectDropdown
//                   label="Employees"
//                   options={employeeOptions}
//                   selectedValues={selectedEmployees}
//                   onChange={setSelectedEmployees}
//                   placeholder="Select employees..."
//                   disabled={loadingSend}
//                 />
//               ) : (
//                 <MultiSelectDropdown
//                   label="Shifts"
//                   options={shiftOptions}
//                   selectedValues={selectedShifts}
//                   onChange={setSelectedShifts}
//                   placeholder="Select shifts..."
//                   disabled={loadingSend}
//                 />
//               )}

//               {/* Submit Button */}
//               <div className="text-center">
//                 <button
//                   onClick={handleSendReport}
//                   disabled={loadingSend}
//                   className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition"
//                 >
//                   {loadingSend ? "Sending..." : "Send Report"}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HRAttendanceReportGenerate;

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleOption = (value) => {
    let newSelected;
    if (value === "all") {
      if (selectedValues.length === options.length - 1) {
        newSelected = [];
      } else {
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

  const displayText =
    selectedValues.length === 0
      ? placeholder
      : isAllSelected
      ? `All employees (${selectedValues.length})`
      : `${selectedValues.length} selected`;

  // Filter options based on search
  const filteredOptions = options.filter(option => {
    if (option.value === "all") return true;
    return option.label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        
        <button
          type="button"
          onClick={() => !disabled && setIsModalOpen(true)}
          disabled={disabled}
          className={`w-full text-left border rounded-xl px-4 py-3 transition-all duration-200 ${
            disabled
              ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-200"
              : "bg-white hover:border-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          } flex justify-between items-center`}
        >
          <span className={selectedValues.length === 0 ? "text-gray-400" : "text-gray-900 font-medium"}>
            {displayText}
          </span>
          <svg
            className="w-5 h-5 text-gray-400"
            
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsModalOpen(false)} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Select Employees
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search employees by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Options List - This will show ALL items without cutting off */}
              <div className="flex-1 overflow-y-auto p-2">
                {filteredOptions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No employees found</p>
                  </div>
                ) : (
                  <>
                    {/* Select All Option */}
                    <label className="flex items-center p-4 mb-2 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={() => toggleOption("all")}
                        className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                      />
                      <span className="ml-3 font-medium text-gray-900">
                        Select All Employees
                      </span>
                      <span className="ml-auto text-sm text-gray-500">
                        {selectedValues.length} / {options.length - 1} selected
                      </span>
                    </label>

                    {/* Individual Employees */}
                    <div className="space-y-1">
                      {filteredOptions.map(({ value, label }) => {
                        if (value === "all") return null;
                        const isChecked = selectedValues.includes(value);
                        return (
                          <label
                            key={value}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                              isChecked ? "bg-gray-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleOption(value)}
                              className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                            />
                            <span className="ml-3 text-gray-700 flex-1">
                              {label}
                            </span>
                            {isChecked && (
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="text-sm text-gray-600">
                  {selectedValues.length} employee{selectedValues.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onChange([]);
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const HRAttendanceReportGenerate = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingShifts, setLoadingShifts] = useState(true);

  const [reportType, setReportType] = useState("employee");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loadingSend, setLoadingSend] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
        
        const employeesData = data.data || [];
        setEmployees(employeesData);
        
      } catch (err) {
        console.error("Employee fetch error:", err);
        setError(err.message);
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch("https://backend.hrms.transev.site/hr/shifts", {
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

  const employeeOptions = [
    { value: "all", label: "Select All Employees" },
    ...employees.map((e) => ({
      value: e.employeeId,
      label: `${e.name} • ${e.employeeId}`,
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
      setError("Month and year are required.");
      return;
    }

    if (reportType === "employee") {
      if (selectedEmployees.length === 0) {
        setError("Please select at least one employee.");
        return;
      }
    }

    if (reportType === "shift") {
      if (selectedShifts.length === 0) {
        setError("Please select at least one shift.");
        return;
      }
    }

    setLoadingSend(true);

    let employeeIds = [];
    let shiftIds = [];

    if (reportType === "employee") {
      employeeIds = [...selectedEmployees];
      shiftIds = [];
    } 
    else if (reportType === "shift") {
      employeeIds = [];
      shiftIds = [...selectedShifts];
    }

    const formattedMonthYear = `${month.toString().padStart(2, "0")}-${year}`;

    try {
      const res = await fetch(
        "https://backend.hrms.transev.site/hr/attendance/send-monthly-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
          body: JSON.stringify({
            monthYear: formattedMonthYear,
            employeeIds: employeeIds,
            shiftIds: shiftIds,
          }),
        }
      );

      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to send report");
      }
      
      if (reportType === "employee") {
        setMessage(`Report sent for ${employeeIds.length} employee(s)`);
      } else {
        setMessage(`Report sent for ${selectedShifts.length} shift(s)`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSend(false);
    }
  };

  const handleSendAllEmployeesReport = async () => {
    setError("");
    setMessage("");

    if (!month || !year) {
      setError("Month and year are required.");
      return;
    }

    if (employees.length === 0) {
      setError("No employees found.");
      return;
    }

    setLoadingSend(true);

    const allEmployeeIds = employees.map((e) => e.employeeId);
    const formattedMonthYear = `${month.toString().padStart(2, "0")}-${year}`;

    try {
      const res = await fetch(
        "https://backend.hrms.transev.site/hr/attendance/send-monthly-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
          body: JSON.stringify({
            monthYear: formattedMonthYear,
            employeeIds: allEmployeeIds,
            shiftIds: [],
          }),
        }
      );

      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to send report");
      }
      
      setMessage(`Report sent to all ${allEmployeeIds.length} employees`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HRSidebar />
      <main className="ml-64 flex-1">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">
              Attendance Reports
            </h1>
            <p className="text-gray-500 mt-2">
              Generate and send monthly attendance reports
            </p>
          </div>

          {(loadingEmployees || loadingShifts) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading...</p>
              </div>
            </div>
          )}

          {!loadingEmployees && !loadingShifts && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Report Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="reportType"
                        value="employee"
                        checked={reportType === "employee"}
                        onChange={() => {
                          setReportType("employee");
                          setSelectedShifts([]);
                        }}
                        className="w-4 h-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                        disabled={loadingSend}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        By Employee
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="reportType"
                        value="shift"
                        checked={reportType === "shift"}
                        onChange={() => {
                          setReportType("shift");
                          setSelectedEmployees([]);
                        }}
                        className="w-4 h-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                        disabled={loadingSend}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        By Shift
                      </span>
                    </label>
                  </div>
                </div>

                {/* Month & Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
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
                </div>

                {/* Selection Dropdown - Using Modal-based dropdown */}
                {reportType === "employee" ? (
                  <MultiSelectDropdown
                    label="Select Employees"
                    options={employeeOptions}
                    selectedValues={selectedEmployees}
                    onChange={setSelectedEmployees}
                    placeholder="Choose employees..."
                    disabled={loadingSend}
                  />
                ) : (
                  <MultiSelectDropdown
                    label="Select Shifts"
                    options={shiftOptions}
                    selectedValues={selectedShifts}
                    onChange={setSelectedShifts}
                    placeholder="Choose shifts..."
                    disabled={loadingSend}
                  />
                )}

                {/* Buttons */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleSendReport}
                    disabled={loadingSend}
                    className="w-full bg-gray-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    {loadingSend ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </span>
                    ) : (
                      "Send Report"
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-400">or</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSendAllEmployeesReport}
                    disabled={loadingSend || employees.length === 0}
                    className="w-full border border-gray-200 text-gray-700 rounded-xl px-4 py-3 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    Send to All Employees
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {message && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Success
                  </h3>
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                  <button
                    onClick={() => setMessage("")}
                    className="mt-6 w-full bg-gray-900 text-white rounded-xl px-4 py-2 font-medium hover:bg-gray-800 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRAttendanceReportGenerate;