// import React, { useEffect, useState } from "react";
// import HRSidebar from "../../components/Common/HRSidebar";

// /* ---------------- Glass Select ---------------- */
// const GlassSelect = ({ label, options, value, onChange, isEmployee }) => (
//   <div className="space-y-2">
//     <label className="text-yellow-800 font-semibold text-lg">{label}</label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full bg-white border border-yellow-300 px-4 py-3 rounded-xl"
//     >
//       <option value="">-- Select {label} --</option>
//       {options.map((o) => (
//         <option
//           key={isEmployee ? o.employeeId : o.id}
//           value={isEmployee ? o.employeeId : o.id}
//         >
//           {isEmployee ? `${o.name} (${o.employeeId})` : o.shiftName}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// /* ---------------- MAIN COMPONENT ---------------- */
// const HRShiftsList = () => {
//   const [shifts, setShifts] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [assigned, setAssigned] = useState([]);

//   const [selectedShiftId, setSelectedShiftId] = useState("");
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

//   // 🔹 EDIT FEATURE
//   const [showEdit, setShowEdit] = useState(false);
//   const [editForm, setEditForm] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [isAssigning, setIsAssigning] = useState(false);


//   const handleDelete = (index) => {
//     if (!window.confirm("Are you sure you want to remove this assignment?")) return;
//     const updated = assigned.filter((_, i) => i !== index);
//     setAssigned(updated);
//     localStorage.setItem("assignedShifts", JSON.stringify(updated));
//   };

//   /* -------- Load assigned list from localStorage -------- */
//   useEffect(() => {
//     const stored = localStorage.getItem("assignedShifts");
//     if (stored) setAssigned(JSON.parse(stored));
//   }, []);

//   /* ---------------- Fetch Shifts ---------------- */
//   useEffect(() => {
//     fetch("https://backend.hrms.transev.site/hr/shifts", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("hr_token")}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setShifts(data.data || []));
//   }, []);

//   /* ---------------- Fetch Employees ---------------- */
//   useEffect(() => {
//     fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("hr_token")}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setEmployees(data.data || []));
//   }, []);

//   const selectedShift = shifts.find((s) => s.id === selectedShiftId);
//   const selectedEmployee = employees.find((e) => e.employeeId === selectedEmployeeId);

//   // 🔹 Populate edit form when Edit clicked
//   const handleEditClick = () => {
//     if (!selectedShift) return;
//     setEditForm({
//       ...selectedShift,
//       shiftId: selectedShift.id,
//     });
//     setShowEdit(true);
//   };

//   /* ---------------- Assign Shift ---------------- */
// const handleSave = async () => {
//   if (!selectedShift || !selectedEmployee) return;

//   setIsAssigning(true); // start loading

//   try {
//     const res = await fetch(
//       "https://backend.hrms.transev.site/hr/assign-shift",
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//         },
//         body: JSON.stringify({
//           employeeId: selectedEmployee.employeeId,
//           shiftId: selectedShift.id,
//         }),
//       }
//     );

//     const result = await res.json();
//     if (!res.ok) throw new Error(result.message);

//     const newAssign = {
//       employeeId: result.data.employeeId,
//       employeeName: selectedEmployee.name,
//       shiftId: result.data.assignedShiftId,
//       shiftName: selectedShift.shiftName,
//       fullShiftTime: `${selectedShift.fullShiftStartingTime} - ${selectedShift.fullShiftEndingTime}`,
//       halfShiftTime: `${selectedShift.halfShiftStartingTime || "-"} - ${selectedShift.halfShiftEndingTime || "-"}`
//     };

//     const updated = [...assigned, newAssign];
//     setAssigned(updated);
//     localStorage.setItem("assignedShifts", JSON.stringify(updated));

//     setSelectedShiftId("");
//     setSelectedEmployeeId("");
//     alert("Shift assigned successfully ✅");
//   } catch (err) {
//     alert(err.message);
//   } finally {
//     setIsAssigning(false); // stop loading
//   }
// };


//   /* ---------------- UPDATE SHIFT ---------------- */
//   const handleUpdateShift = async () => {
//     setUpdating(true);
//     try {
//       const res = await fetch(
//         "https://backend.hrms.transev.site/hr/edit-shift",
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//           },
//           body: JSON.stringify(editForm),
//         }
//       );

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message);

//       setShifts((prev) =>
//         prev.map((s) => (s.id === result.data.id ? result.data : s))
//       );

//       alert("Shift updated successfully ✅");
//       setShowEdit(false);
//     } catch (e) {
//       alert(e.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#f3f4f6] px-6 py-8">
//       <HRSidebar />

//       <main className="ml-64 flex-1 p-10 max-w-7xl mx-auto">
//         <section className="bg-white rounded-3xl shadow-xl p-12">
//           <h1 className="text-4xl font-extrabold text-yellow-900 mb-10 text-center">
//             Assign Shifts to Employees
//           </h1>

//           {/* Selects */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-4">
//             <div>
//               <GlassSelect
//                 label="Shift"
//                 options={shifts}
//                 value={selectedShiftId}
//                 onChange={setSelectedShiftId}
//               />
//               {selectedShiftId && (
//                 <button
//                   onClick={handleEditClick}
//                   className="
//       mt-4 inline-flex items-center gap-2
//       px-5 py-2.5
//       text-sm font-bold tracking-wide
//       text-yellow-900
//       bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500
//       rounded-full
//       shadow-md shadow-yellow-400/40
//       hover:shadow-lg hover:shadow-yellow-500/50
//       hover:-translate-y-[1px]
//       transition-all duration-300
//     "
//                 >
//                   ✨ Edit Shift
//                 </button>
//               )}



//             </div>

//             <GlassSelect
//               label="Employee"
//               options={employees}
//               value={selectedEmployeeId}
//               onChange={setSelectedEmployeeId}
//               isEmployee
//             />
//           </div>

//           {/* Assign Button */}
//           <div className="text-center mb-10">
//             <button
//   onClick={handleSave}
//   disabled={!selectedShiftId || !selectedEmployeeId || isAssigning}
//   className={`
//     relative px-10 py-4 font-bold rounded-2xl
//     transition-all duration-300
//     bg-yellow-500 text-yellow-900
//     ${isAssigning ? "opacity-70 blur-[1px] cursor-not-allowed" : "hover:scale-105"}
//   `}
// >
//   {isAssigning ? (
//     <span className="flex items-center justify-center gap-3">
//       <span className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full animate-spin"></span>
//       Assigning...
//     </span>
//   ) : (
//     "Assign Shift"
//   )}
// </button>

//           </div>

//           {showEdit && editForm && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
//               <div className="
//       w-full max-w-4xl
//       bg-[#fff8dc]
//       rounded-3xl
//       shadow-2xl
//       p-8
//       border border-yellow-400
//     ">
//                 {/* Close */}
//                 <button
//                   onClick={() => setShowEdit(false)}
//                   className="absolute top-5 right-6 text-2xl font-bold text-yellow-800 hover:text-red-600"
//                 >
//                   ✕
//                 </button>

//                 {/* Header */}
//                 <h2 className="text-3xl font-extrabold text-yellow-900 mb-8 text-center">
//                   Edit Shift Details
//                 </h2>

//                 {/* Sections */}
//                 <div className="space-y-10 max-h-[65vh] overflow-y-auto pr-2">

//                   {/* BASIC INFO */}
//                   <section>
//                     <h3 className="text-xl font-bold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
//                       Basic Information
//                     </h3>

//                     <div className="grid md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-yellow-900 mb-1">
//                           Shift Name
//                         </label>
//                         <input
//                           value={editForm.shiftName}
//                           onChange={(e) =>
//                             setEditForm({ ...editForm, shiftName: e.target.value })
//                           }
//                           className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-yellow-900 mb-1">
//                           Weekly Days Off (comma separated)
//                         </label>
//                         <input
//                           value={editForm.weeklyDaysOff.join(",")}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               weeklyDaysOff: e.target.value.split(","),
//                             })
//                           }
//                           className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400"
//                         />
//                       </div>
//                     </div>
//                   </section>

//                   {/* FULL SHIFT TIMING */}
//                   <section>
//                     <h3 className="text-xl font-bold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
//                       Full Shift Timing
//                     </h3>

//                     <div className="grid md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-yellow-900 mb-1">
//                           Full Shift Start Time
//                         </label>
//                         <input
//                           type="datetime-local"
//                           value={editForm.fullShiftStartingTime?.slice(0, 16)}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               fullShiftStartingTime: e.target.value,
//                             })
//                           }
//                           className="w-full px-4 py-2 rounded-xl border border-yellow-300"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-yellow-900 mb-1">
//                           Full Shift End Time
//                         </label>
//                         <input
//                           type="datetime-local"
//                           value={editForm.fullShiftEndingTime?.slice(0, 16)}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               fullShiftEndingTime: e.target.value,
//                             })
//                           }
//                           className="w-full px-4 py-2 rounded-xl border border-yellow-300"
//                         />
//                       </div>
//                     </div>
//                   </section>

//                   {/* RULES */}
//                   <section>
//                     <h3 className="text-xl font-bold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
//                       Attendance Rules
//                     </h3>

//                     <div className="grid md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-yellow-900 mb-1">
//                           Grace In (Minutes)
//                         </label>
//                         <input
//                           type="number"
//                           value={editForm.fullShiftGraceInTimingInMinutes}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               fullShiftGraceInTimingInMinutes: Number(e.target.value),
//                             })
//                           }
//                           className="w-full px-4 py-2 rounded-xl border border-yellow-300"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-yellow-900 mb-1">
//                           Grace Out (Minutes)
//                         </label>
//                         <input
//                           type="number"
//                           value={editForm.fullShiftGraceOutTimingInMinutes}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               fullShiftGraceOutTimingInMinutes: Number(e.target.value),
//                             })
//                           }
//                           className="w-full px-4 py-2 rounded-xl border border-yellow-300"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-yellow-900 mb-1">
//                           Late Punch → Mark Absent (Minutes)
//                         </label>
//                         <input
//                           type="number"
//                           value={
//                             editForm.fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes
//                           }
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes:
//                                 Number(e.target.value),
//                             })
//                           }
//                           className="w-full px-4 py-2 rounded-xl border border-yellow-300"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-yellow-900 mb-1">
//                           Max Overtime (Minutes)
//                         </label>
//                         <input
//                           type="number"
//                           value={editForm.overtimeMaximumAllowableLimitInMinutes}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               overtimeMaximumAllowableLimitInMinutes: Number(e.target.value),
//                             })
//                           }
//                           className="w-full px-4 py-2 rounded-xl border border-yellow-300"
//                         />
//                       </div>
//                     </div>
//                   </section>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex justify-center gap-6 mt-10">
//                   <button
//                     onClick={() => setShowEdit(false)}
//                     className="px-8 py-3 rounded-xl bg-gray-200 font-semibold"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     onClick={handleUpdateShift}
//                     disabled={updating}
//                     className="
//             px-10 py-3 rounded-xl
//             bg-gradient-to-r from-yellow-500 to-amber-500
//             text-yellow-900 font-extrabold
//             shadow-lg hover:scale-105 transition
//           "
//                   >
//                     {updating ? "Updating..." : "Update Shift"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}


//           {/* Assigned Table — UNCHANGED */}
//           {assigned.length > 0 && (
//             <div className="overflow-x-auto border rounded-xl">
//               <table className="w-full text-left">
//                 <thead className="bg-yellow-100">
//                   <tr>
//                     <th className="px-6 py-4">Employee Name</th>
//                     <th className="px-6 py-4">Employee ID</th>
//                     <th className="px-6 py-4">Shift Name</th>
//                     <th className="px-6 py-4">Full Shift</th>
//                     <th className="px-6 py-4">Half Shift</th>
//                     <th className="px-6 py-4 text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {assigned.map((a, i) => (
//                     <tr key={i}>
//                       <td className="px-6 py-4">{a.employeeName}</td>
//                       <td className="px-6 py-4">{a.employeeId}</td>
//                       <td className="px-6 py-4">{a.shiftName}</td>
//                       <td className="px-6 py-4">{a.fullShiftTime}</td>
//                       <td className="px-6 py-4">{a.halfShiftTime}</td>
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => handleDelete(i)}
//                           className="px-4 py-2 bg-red-100 text-red-700 rounded-xl"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default HRShiftsList;



import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

/* ---------------- Elegant Select Component ---------------- */
const ElegantSelect = ({ label, options, value, onChange, isEmployee, icon }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
      <i className={`fas fa-${icon} text-amber-500 text-sm`}></i>
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-stone-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none transition-all duration-200 text-stone-700 cursor-pointer hover:border-amber-300"
      >
        <option value="">— Select {label.toLowerCase()} —</option>
        {options.map((o) => (
          <option
            key={isEmployee ? o.employeeId : o.id}
            value={isEmployee ? o.employeeId : o.id}
          >
            {isEmployee ? `${o.name} (${o.employeeId})` : o.shiftName}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <i className="fas fa-chevron-down text-stone-400 text-xs"></i>
      </div>
    </div>
  </div>
);

/* ---------------- Shift Card Component ---------------- */
const ShiftCard = ({ shift, onEdit, isSelected, onSelect }) => {
  const formatBreakPolicy = (policy) => {
    if (!policy) return { text: "No policy", color: "text-stone-400 bg-stone-50" };
    const totalMins = policy.totalBreakDurationMinutes;
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const breakText = hrs > 0 ? `${hrs}h ${mins > 0 ? mins + 'm' : ''}` : `${mins}m`;
    return { text: breakText, color: "text-emerald-600 bg-emerald-50" };
  };

  const breakInfo = formatBreakPolicy(shift.breakPolicy);
  const startTime = shift.fullShiftStartingTime ? new Date(shift.fullShiftStartingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
  const endTime = shift.fullShiftEndingTime ? new Date(shift.fullShiftEndingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <div 
      className={`rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
        isSelected 
          ? 'bg-amber-50/80 border-amber-300 shadow-md' 
          : 'bg-white border-stone-100 hover:border-amber-200 hover:shadow-sm'
      }`}
      onClick={() => onSelect(shift.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-stone-800">{shift.shiftName}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${breakInfo.color}`}>
              ☕ {breakInfo.text}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <i className="far fa-clock text-amber-500"></i> {startTime} - {endTime}
            </span>
            <span className="flex items-center gap-1">
              <i className="far fa-calendar-alt text-amber-500"></i> Off: {shift.weeklyDaysOff?.join(', ') || 'None'}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(shift); }}
          className="text-stone-400 hover:text-amber-600 transition-colors p-1"
        >
          <i className="fas fa-pen text-sm"></i>
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mt-3 pt-2 border-t border-stone-50">
        <span className="text-xs text-stone-400 flex items-center gap-1">
          <i className="fas fa-hourglass-start text-[10px]"></i> Grace In: {shift.fullShiftGraceInTimingInMinutes}min
        </span>
        <span className="text-xs text-stone-400 flex items-center gap-1">
          <i className="fas fa-hourglass-end text-[10px]"></i> Grace Out: {shift.fullShiftGraceOutTimingInMinutes}min
        </span>
        <span className="text-xs text-stone-400 flex items-center gap-1">
          <i className="fas fa-chart-line text-[10px]"></i> OT: {shift.overtimeMaximumAllowableLimitInMinutes || 0}min
        </span>
      </div>
    </div>
  );
};

/* ---------------- Assignment Row Component ---------------- */
const AssignmentRow = ({ assignment, index, onRemove }) => {
  const breakText = assignment.breakPolicy 
    ? `${Math.floor(assignment.breakPolicy.totalBreakDurationMinutes / 60)}h ${assignment.breakPolicy.totalBreakDurationMinutes % 60}m`
    : 'Not set';

  return (
    <tr className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
      <td className="px-5 py-4">
        <div className="font-medium text-stone-800">{assignment.employeeName}</div>
        <div className="text-xs text-stone-400 mt-0.5">ID: {assignment.employeeId}</div>
      </td>
      <td className="px-5 py-4">
        <span className="font-medium text-amber-700">{assignment.shiftName}</span>
      </td>
      <td className="px-5 py-4 text-sm text-stone-600">{assignment.fullShiftTime}</td>
      <td className="px-5 py-4 text-sm text-stone-600">{assignment.halfShiftTime}</td>
      <td className="px-5 py-4">
        {assignment.breakPolicy ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
            <i className="fas fa-coffee text-[10px]"></i> {breakText}
          </span>
        ) : (
          <span className="text-stone-400 text-xs">—</span>
        )}
      </td>
      <td className="px-5 py-4 text-center">
        <button
          onClick={() => onRemove(index)}
          className="text-stone-400 hover:text-red-500 transition-colors"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );
};

/* ---------------- Toast Notification ---------------- */
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg animate-in slide-in-from-right-5 ${
    type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
  }`}>
    <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
      <i className="fas fa-times"></i>
    </button>
  </div>
);

/* ---------------- MAIN COMPONENT ---------------- */
const HRShiftsList = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedShiftId, setSelectedShiftId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Remove this assignment?")) return;
    const updated = assigned.filter((_, i) => i !== index);
    setAssigned(updated);
    localStorage.setItem("assignedShifts", JSON.stringify(updated));
    showToast("Assignment removed", "success");
  };

  /* Load assigned list from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("assignedShifts");
    if (stored) setAssigned(JSON.parse(stored));
  }, []);

  /* Fetch Shifts */
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch("https://backend.hrms.transev.site/hr/shifts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("hr_token")}` },
        });
        const data = await res.json();
        setShifts(data.data || []);
      } catch (err) {
        console.error("Failed to fetch shifts:", err);
        showToast("Failed to load shifts", "error");
      } finally {
        setLoadingShifts(false);
      }
    };
    fetchShifts();
  }, []);

  /* Fetch Employees */
  useEffect(() => {
    fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
      headers: { Authorization: `Bearer ${localStorage.getItem("hr_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data.data || []))
      .catch(console.error);
  }, []);

  const selectedShift = shifts.find((s) => s.id === selectedShiftId);
  const selectedEmployee = employees.find((e) => e.employeeId === selectedEmployeeId);

  /* Handle Edit Click */
  const handleEditClick = (shift) => {
    setEditForm({
      ...shift,
      shiftId: shift.id,
      weeklyDaysOff: shift.weeklyDaysOff || [],
      weeklyHalfDays: shift.weeklyHalfDays || [],
    });
    setShowEdit(true);
  };

  /* Assign Shift */
  const handleAssign = async () => {
    if (!selectedShift || !selectedEmployee) {
      showToast("Please select both shift and employee", "error");
      return;
    }

    if (assigned.some(a => a.employeeId === selectedEmployeeId)) {
      showToast("Employee already has an assigned shift", "error");
      return;
    }

    setIsAssigning(true);

    try {
      const res = await fetch("https://backend.hrms.transev.site/hr/assign-shift", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.employeeId,
          shiftId: selectedShift.id,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      const newAssign = {
        employeeId: result.data.employeeId,
        employeeName: selectedEmployee.name,
        shiftId: result.data.assignedShiftId,
        shiftName: selectedShift.shiftName,
        breakPolicy: selectedShift.breakPolicy,
        fullShiftTime: `${selectedShift.fullShiftStartingTime ? new Date(selectedShift.fullShiftStartingTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'} - ${selectedShift.fullShiftEndingTime ? new Date(selectedShift.fullShiftEndingTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}`,
        halfShiftTime: `${selectedShift.halfShiftStartingTime ? new Date(selectedShift.halfShiftStartingTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'} - ${selectedShift.halfShiftEndingTime ? new Date(selectedShift.halfShiftEndingTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}`
      };

      const updated = [...assigned, newAssign];
      setAssigned(updated);
      localStorage.setItem("assignedShifts", JSON.stringify(updated));

      setSelectedShiftId("");
      setSelectedEmployeeId("");
      showToast("Shift assigned successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsAssigning(false);
    }
  };

  /* Update Shift */
  const handleUpdateShift = async () => {
    setUpdating(true);
    try {
      const res = await fetch("https://backend.hrms.transev.site/hr/edit-shift", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: JSON.stringify(editForm),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setShifts((prev) =>
        prev.map((s) => (s.id === result.data.id ? result.data : s))
      );

      // Update assignments that use this shift
      const updatedAssignments = assigned.map(a => 
        a.shiftId === editForm.id 
          ? { ...a, shiftName: editForm.shiftName, breakPolicy: editForm.breakPolicy }
          : a
      );
      setAssigned(updatedAssignments);
      localStorage.setItem("assignedShifts", JSON.stringify(updatedAssignments));

      showToast("Shift updated successfully!", "success");
      setShowEdit(false);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const stats = {
    totalShifts: shifts.length,
    totalAssignments: assigned.length,
    shiftsWithBreak: shifts.filter(s => s.breakPolicy).length
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50">
      <HRSidebar />

      <main className="ml-64 flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-amber-600 mb-2">
              <i className="fas fa-chalkboard-user"></i>
              <span>Dashboard</span>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-stone-500">Shift Management</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
              Shift <span className="text-amber-500">Orchestrator</span>
            </h1>
            <p className="text-stone-500 mt-1">Manage shifts, assign employees, and configure break policies</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide">Total Shifts</p>
                  <p className="text-2xl font-bold text-stone-800 mt-1">{stats.totalShifts}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <i className="fas fa-calendar-alt text-amber-500 text-lg"></i>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide">Active Assignments</p>
                  <p className="text-2xl font-bold text-stone-800 mt-1">{stats.totalAssignments}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <i className="fas fa-user-check text-emerald-500 text-lg"></i>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide">Shifts with Break Policy</p>
                  <p className="text-2xl font-bold text-stone-800 mt-1">{stats.shiftsWithBreak}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <i className="fas fa-coffee text-purple-500 text-lg"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Shifts List */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-layer-group text-amber-500"></i>
                    <h2 className="font-semibold text-stone-800">Shift Library</h2>
                  </div>
                  <span className="text-xs text-stone-400 bg-white px-2 py-1 rounded-full">{shifts.length} shifts</span>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scroll">
                {loadingShifts ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
                  </div>
                ) : shifts.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-archive text-4xl text-stone-300 mb-3 block"></i>
                    <p className="text-stone-400">No shifts created yet</p>
                  </div>
                ) : (
                  shifts.map((shift) => (
                    <ShiftCard 
                      key={shift.id} 
                      shift={shift} 
                      onEdit={handleEditClick}
                      isSelected={selectedShiftId === shift.id}
                      onSelect={setSelectedShiftId}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Assignment Section */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <i className="fas fa-user-plus text-amber-500"></i>
                  <h2 className="font-semibold text-stone-800">Assign Shift</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <ElegantSelect
                  label="Select Shift"
                  icon="briefcase"
                  options={shifts}
                  value={selectedShiftId}
                  onChange={setSelectedShiftId}
                />
                
                <ElegantSelect
                  label="Select Employee"
                  icon="user"
                  options={employees}
                  value={selectedEmployeeId}
                  onChange={setSelectedEmployeeId}
                  isEmployee
                />

                {/* Selected Shift Preview */}
                {selectedShift && (
                  <div className="bg-gradient-to-r from-amber-50/50 to-transparent rounded-xl p-4 border border-amber-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-stone-800">{selectedShift.shiftName}</h3>
                        <div className="text-xs text-stone-500 mt-1 space-x-3">
                          <span>🕒 {selectedShift.fullShiftStartingTime ? new Date(selectedShift.fullShiftStartingTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'} - {selectedShift.fullShiftEndingTime ? new Date(selectedShift.fullShiftEndingTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}</span>
                          <span>📅 Off: {selectedShift.weeklyDaysOff?.join(', ') || 'None'}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedShift.breakPolicy ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                        {selectedShift.breakPolicy ? `${Math.floor(selectedShift.breakPolicy.totalBreakDurationMinutes / 60)}h ${selectedShift.breakPolicy.totalBreakDurationMinutes % 60}m` : 'No break policy'}
                      </span>
                    </div>
                    {selectedShift.breakPolicy && (
                      <div className="mt-3 text-xs text-stone-500 border-t border-amber-100 pt-2">
                        <i className="fas fa-info-circle text-amber-500 mr-1"></i>
                        {selectedShift.breakPolicy.breakDeductType === 'automatic' ? 'Auto-deduct' : selectedShift.breakPolicy.breakDeductType} break • 
                        {selectedShift.breakPolicy.allowSplitBreaks ? ' Split allowed' : ' Single break'}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleAssign}
                  disabled={!selectedShiftId || !selectedEmployeeId || isAssigning}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    !selectedShiftId || !selectedEmployeeId || isAssigning
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {isAssigning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Assigning...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-link"></i>
                      Assign Shift
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Assigned Shifts Table */}
          {assigned.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <i className="fas fa-table-list text-amber-500"></i>
                  <h2 className="font-semibold text-stone-800">Active Assignments</h2>
                </div>
                <span className="text-xs text-stone-500 bg-white px-2 py-1 rounded-full">{assigned.length} assignments</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/30">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Employee</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Shift</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Full Shift</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Half Shift</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Break Policy</th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assigned.map((assignment, idx) => (
                      <AssignmentRow 
                        key={idx} 
                        assignment={assignment} 
                        index={idx} 
                        onRemove={handleDelete} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {showEdit && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center px-6 py-5 border-b border-stone-100 bg-stone-50/50">
              <div className="flex items-center gap-2">
                <i className="fas fa-pen text-amber-500"></i>
                <h2 className="text-xl font-semibold text-stone-800">Edit Shift</h2>
              </div>
              <button onClick={() => setShowEdit(false)} className="text-stone-400 hover:text-stone-600 transition">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-info-circle text-amber-500 text-sm"></i>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Shift Name</label>
                    <input 
                      value={editForm.shiftName} 
                      onChange={(e) => setEditForm({...editForm, shiftName: e.target.value})} 
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Weekly Days Off (comma separated)</label>
                    <input 
                      value={editForm.weeklyDaysOff?.join(',') || ''} 
                      onChange={(e) => setEditForm({...editForm, weeklyDaysOff: e.target.value.split(',').map(s => s.trim())})} 
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-300 outline-none transition"
                      placeholder="Sunday, Saturday"
                    />
                  </div>
                </div>
              </div>

              {/* Full Shift Timing */}
              <div>
                <h3 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-clock text-amber-500 text-sm"></i>
                  Full Shift Timing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Start Time</label>
                    <input 
                      type="datetime-local" 
                      value={editForm.fullShiftStartingTime?.slice(0,16) || ''} 
                      onChange={(e) => setEditForm({...editForm, fullShiftStartingTime: e.target.value})} 
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-300 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">End Time</label>
                    <input 
                      type="datetime-local" 
                      value={editForm.fullShiftEndingTime?.slice(0,16) || ''} 
                      onChange={(e) => setEditForm({...editForm, fullShiftEndingTime: e.target.value})} 
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-300 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Rules */}
              <div>
                <h3 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-chart-line text-amber-500 text-sm"></i>
                  Attendance Rules (minutes)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Grace In</label>
                    <input 
                      type="number" 
                      value={editForm.fullShiftGraceInTimingInMinutes} 
                      onChange={(e) => setEditForm({...editForm, fullShiftGraceInTimingInMinutes: Number(e.target.value)})} 
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-300 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Grace Out</label>
                    <input 
                      type="number" 
                      value={editForm.fullShiftGraceOutTimingInMinutes} 
                      onChange={(e) => setEditForm({...editForm, fullShiftGraceOutTimingInMinutes: Number(e.target.value)})} 
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-300 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Mark Absent After (min late)</label>
                    <input 
                      type="number" 
                      value={editForm.fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes} 
                      onChange={(e) => setEditForm({...editForm, fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: Number(e.target.value)})} 
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-300 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Max Overtime Limit</label>
                    <input 
                      type="number" 
                      value={editForm.overtimeMaximumAllowableLimitInMinutes || 0} 
                      onChange={(e) => setEditForm({...editForm, overtimeMaximumAllowableLimitInMinutes: Number(e.target.value)})} 
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-300 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Break Policy Display */}
              <div>
                <h3 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-coffee text-amber-500 text-sm"></i>
                  Break Policy
                </h3>
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  {editForm.breakPolicy ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                          Total: {Math.floor(editForm.breakPolicy.totalBreakDurationMinutes / 60)}h {editForm.breakPolicy.totalBreakDurationMinutes % 60}m
                        </span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                          {editForm.breakPolicy.breakDeductType === 'automatic' ? 'Auto Deduct' : editForm.breakPolicy.breakDeductType === 'manual' ? 'Manual Entry' : 'Honor System'}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {editForm.breakPolicy.allowSplitBreaks ? 'Split Breaks Allowed' : 'Single Break'}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-stone-500 mb-2">Break Segments:</p>
                        <ul className="space-y-1">
                          {editForm.breakPolicy.breakSegments?.map((seg, idx) => (
                            <li key={idx} className="text-xs text-stone-600 flex items-center gap-2">
                              <i className="fas fa-clock text-amber-400 text-[10px]"></i>
                              {seg.durationMinutes}min at {Math.floor(seg.startOffsetMinutes / 60)}h {seg.startOffsetMinutes % 60}m • {seg.paid ? 'Paid' : 'Unpaid'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-stone-500 text-sm flex items-center gap-2">
                      <i className="fas fa-info-circle text-amber-400"></i>
                      No break policy configured for this shift
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 px-6 py-5 border-t border-stone-100 bg-stone-50/50">
              <button 
                onClick={() => setShowEdit(false)} 
                className="px-5 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateShift} 
                disabled={updating} 
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:shadow-md transition disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Shift'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default HRShiftsList;