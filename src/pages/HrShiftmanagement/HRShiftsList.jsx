// import React, { useEffect, useState } from "react";
// import HRSidebar from "../../components/Common/HRSidebar";

// const HRShiftsList = () => {
//   const [shifts, setShifts] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [assigned, setAssigned] = useState([]);

//   const [loadingShifts, setLoadingShifts] = useState(true);
//   const [loadingEmployees, setLoadingEmployees] = useState(true);

//   const [errorShifts, setErrorShifts] = useState(null);
//   const [errorEmployees, setErrorEmployees] = useState(null);

//   const [selectedShiftId, setSelectedShiftId] = useState("");
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

//   useEffect(() => {
//     const existing = localStorage.getItem("assignedShifts");
//     if (existing) setAssigned(JSON.parse(existing));
//   }, []);

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
//         setErrorShifts(err.message);
//       } finally {
//         setLoadingShifts(false);
//       }
//     };
//     fetchShifts();
//   }, []);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
//           headers: {
//             "Content-Type": "application/json",
//                         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//             // Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
//           },
//         });
//         if (!res.ok) throw new Error(res.statusText);
//         const data = await res.json();
//         setEmployees(data.data || []);
//       } catch (err) {
//         setErrorEmployees(err.message);
//       } finally {
//         setLoadingEmployees(false);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   const selectedShift = shifts.find(s => s.id === selectedShiftId);
//   const selectedEmployee = employees.find(e => e.employeeId === selectedEmployeeId);

//   const handleSave = () => {
//     if (!selectedShift || !selectedEmployee) return;
//     const newAssign = {
//       employeeId: selectedEmployee.employeeId,
//       employeeName: selectedEmployee.name,
//       shiftId: selectedShift.id,
//       shiftName: selectedShift.shiftName,
//       fullShiftTime: `${selectedShift.fullShiftStartingTime} - ${selectedShift.fullShiftEndingTime}`,
//       halfShiftTime: `${selectedShift.halfShiftStartingTime} - ${selectedShift.halfShiftEndingTime}`,
//     };
//     const updated = [...assigned, newAssign];
//     setAssigned(updated);
//     localStorage.setItem("assignedShifts", JSON.stringify(updated));
//     setSelectedShiftId("");
//     setSelectedEmployeeId("");
//   };

//   const loading = loadingShifts || loadingEmployees;
//   const error = errorShifts || errorEmployees;

//   return (
//     <div className="flex min-h-screen bg-yellow-50">
//       <HRSidebar />

//       <main className="ml-64 flex-1 p-10 max-w-6xl mx-auto">
//         {loading ? (
//           <p className="text-center text-yellow-700 animate-pulse text-lg font-semibold">Loading...</p>
//         ) : error ? (
//           <p className="text-center text-red-600 font-semibold text-lg">{error}</p>
//         ) : (
//           <section className="bg-white rounded-lg shadow-lg p-8">
//             <h1 className="text-4xl font-extrabold text-yellow-900 mb-8 text-center tracking-wide">
//               Assign Shifts to Employees
//             </h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//               <Select label="Shift" options={shifts} value={selectedShiftId} onChange={setSelectedShiftId} />
//               <Select label="Employee" options={employees} value={selectedEmployeeId} onChange={setSelectedEmployeeId} isEmployee />
//             </div>

//             <div className="text-center mb-10">
//               <button
//                 disabled={!selectedShiftId || !selectedEmployeeId}
//                 onClick={handleSave}
//                 className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Assign Shift
//               </button>
//             </div>

//             {assigned.length > 0 && (
//               <div className="overflow-x-auto rounded-lg border border-yellow-200 shadow-sm">
//                 <table className="w-full text-left text-sm text-yellow-900">
//                   <thead className="bg-yellow-100 sticky top-0 shadow-md z-10">
//                     <tr>
//                       <th className="px-6 py-3 font-semibold border-b border-yellow-300">Employee Name</th>
//                       <th className="px-6 py-3 font-semibold border-b border-yellow-300">Employee ID</th>
//                       <th className="px-6 py-3 font-semibold border-b border-yellow-300">Shift Name</th>
//                       <th className="px-6 py-3 font-semibold border-b border-yellow-300">Full Shift Time</th>
//                       <th className="px-6 py-3 font-semibold border-b border-yellow-300">Half Shift Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {assigned.map((a, idx) => (
//                       <tr
//                         key={idx}
//                         className="hover:bg-yellow-50 border-b border-yellow-100 transition-colors duration-150"
//                       >
//                         <td className="px-6 py-4">{a.employeeName}</td>
//                         <td className="px-6 py-4 font-mono">{a.employeeId}</td>
//                         <td className="px-6 py-4">{a.shiftName}</td>
//                         <td className="px-6 py-4">{a.fullShiftTime}</td>
//                         <td className="px-6 py-4">{a.halfShiftTime}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </section>
//         )}
//       </main>
//     </div>
//   );
// };

// const Select = ({ label, options, value, onChange, isEmployee }) => (
//   <div>
//     <label
//       htmlFor={label.toLowerCase()}
//       className="block text-yellow-900 font-semibold mb-2 text-lg"
//     >
//       Select {label}
//     </label>
//     <select
//       id={label.toLowerCase()}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//       className="w-full border border-yellow-300 rounded-md px-4 py-3 text-yellow-900 text-base
//                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition"
//     >
//       <option value="">-- Select {label} --</option>
//       {options.map(o => (
//         <option key={isEmployee ? o.employeeId : o.id} value={isEmployee ? o.employeeId : o.id}>
//           {isEmployee ? `${o.name} (${o.employeeId})` : o.shiftName}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// export default HRShiftsList;


import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

/* ---------------- Glass Select ---------------- */
const GlassSelect = ({ label, options, value, onChange, isEmployee }) => (
  <div className="space-y-2">
    <label className="text-yellow-800 font-semibold text-lg">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-yellow-300 px-4 py-3 rounded-xl"
    >
      <option value="">-- Select {label} --</option>
      {options.map((o) => (
        <option
          key={isEmployee ? o.employeeId : o.id}
          value={isEmployee ? o.employeeId : o.id}
        >
          {isEmployee
            ? `${o.name} (${o.employeeId})`
            : o.shiftName}
        </option>
      ))}
    </select>
  </div>
);

/* ---------------- MAIN COMPONENT ---------------- */
const HRShiftsList = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assigned, setAssigned] = useState([]);

  const [selectedShiftId, setSelectedShiftId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const handleDelete = (index) => {
  if (!window.confirm("Are you sure you want to remove this assignment?")) return;

  const updated = assigned.filter((_, i) => i !== index);
  setAssigned(updated);
  localStorage.setItem("assignedShifts", JSON.stringify(updated));
};


  /* -------- Load assigned list from localStorage -------- */
  useEffect(() => {
    const stored = localStorage.getItem("assignedShifts");
    if (stored) {
      setAssigned(JSON.parse(stored));
    }
  }, []);

  /* ---------------- Fetch Shifts ---------------- */
  useEffect(() => {
    fetch("https://backend.hrms.transev.site/hr/shifts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShifts(data.data || []))
      .catch(console.error);
  }, []);

  /* ---------------- Fetch Employees ---------------- */
  useEffect(() => {
    fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data.data || []))
      .catch(console.error);
  }, []);

  const selectedShift = shifts.find((s) => s.id === selectedShiftId);
  const selectedEmployee = employees.find(
    (e) => e.employeeId === selectedEmployeeId
  );

  /* ---------------- Assign Shift ---------------- */
  const handleSave = async () => {
    if (!selectedShift || !selectedEmployee) return;

    try {
      const res = await fetch(
        "https://backend.hrms.transev.site/hr/assign-shift",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
          body: JSON.stringify({
            employeeId: selectedEmployee.employeeId,
            shiftId: selectedShift.id,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to assign shift");
      }

      /* ---------- Build row for table ---------- */
      const newAssign = {
        employeeId: result.data.employeeId,
        employeeName: selectedEmployee.name,
        shiftId: result.data.assignedShiftId,
        shiftName: selectedShift.shiftName,
        fullShiftTime: `${selectedShift.fullShiftStartingTime} - ${selectedShift.fullShiftEndingTime}`,
        halfShiftTime: `${selectedShift.halfShiftStartingTime || "-"} - ${
          selectedShift.halfShiftEndingTime || "-"
        }`,
      };

      /* ---------- Update list ---------- */
      const updated = [...assigned, newAssign];
      setAssigned(updated);
      localStorage.setItem("assignedShifts", JSON.stringify(updated));

      setSelectedShiftId("");
      setSelectedEmployeeId("");

      alert("Shift assigned successfully ✅");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] px-6 py-8">
      <HRSidebar />

      <main className="ml-64 flex-1 p-10 max-w-7xl mx-auto">
        <section className="bg-white rounded-3xl shadow-xl p-12">
          <h1 className="text-4xl font-extrabold text-yellow-900 mb-10 text-center">
            Assign Shifts to Employees
          </h1>

          {/* Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <GlassSelect
              label="Shift"
              options={shifts}
              value={selectedShiftId}
              onChange={setSelectedShiftId}
            />
            <GlassSelect
              label="Employee"
              options={employees}
              value={selectedEmployeeId}
              onChange={setSelectedEmployeeId}
              isEmployee
            />
          </div>

          {/* Button */}
          <div className="text-center mb-14">
            <button
              onClick={handleSave}
              disabled={!selectedShiftId || !selectedEmployeeId}
              className="px-10 py-4 bg-yellow-500 text-yellow-900 font-bold rounded-2xl"
            >
              Assign Shift
            </button>
          </div>

          {/* -------- Assigned Table -------- */}
          {assigned.length > 0 && (
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left">
                <thead className="bg-yellow-100">
  <tr>
    <th className="px-6 py-4">Employee Name</th>
    <th className="px-6 py-4">Employee ID</th>
    <th className="px-6 py-4">Shift Name</th>
    <th className="px-6 py-4">Full Shift</th>
    <th className="px-6 py-4">Half Shift</th>
    <th className="px-6 py-4 text-center">Action</th>
  </tr>
</thead>

                <tbody>
                  {assigned.map((a, i) => (
<tr key={i} className="border-t hover:bg-yellow-50 transition">
  <td className="px-6 py-4 font-semibold">{a.employeeName}</td>
  <td className="px-6 py-4 font-mono">{a.employeeId}</td>
  <td className="px-6 py-4">{a.shiftName}</td>
  <td className="px-6 py-4">{a.fullShiftTime}</td>
  <td className="px-6 py-4">{a.halfShiftTime}</td>

  {/* ✅ DELETE BUTTON */}
  <td className="px-6 py-4 text-center">
    <button
      onClick={() => handleDelete(i)}
      className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-xl
                 hover:bg-red-200 hover:text-red-900 transition"
    >
      Delete
    </button>
  </td>
</tr>

                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HRShiftsList;
