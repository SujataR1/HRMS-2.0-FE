// import React, { useEffect, useState } from "react";
// import HRSidebar from "../../components/Common/HRSidebar";

// /* ---------------- Glass Select ---------------- */
// const GlassSelect = ({ label, options, value, onChange, isEmployee }) => (
//   <div className="space-y-2">
//     <label className="text-yellow-800 font-semibold text-lg">
//       {label}
//     </label>
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
//           {isEmployee
//             ? `${o.name} (${o.employeeId})`
//             : o.shiftName}
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

//   const handleDelete = (index) => {
//     if (!window.confirm("Are you sure you want to remove this assignment?")) return;

//     const updated = assigned.filter((_, i) => i !== index);
//     setAssigned(updated);
//     localStorage.setItem("assignedShifts", JSON.stringify(updated));
//   };


//   /* -------- Load assigned list from localStorage -------- */
//   useEffect(() => {
//     const stored = localStorage.getItem("assignedShifts");
//     if (stored) {
//       setAssigned(JSON.parse(stored));
//     }
//   }, []);

//   /* ---------------- Fetch Shifts ---------------- */
//   useEffect(() => {
//     fetch("https://backend.hrms.transev.site/hr/shifts", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setShifts(data.data || []))
//       .catch(console.error);
//   }, []);

//   /* ---------------- Fetch Employees ---------------- */
//   useEffect(() => {
//     fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setEmployees(data.data || []))
//       .catch(console.error);
//   }, []);

//   const selectedShift = shifts.find((s) => s.id === selectedShiftId);
//   const selectedEmployee = employees.find(
//     (e) => e.employeeId === selectedEmployeeId
//   );

//   /* ---------------- Assign Shift ---------------- */
//   const handleSave = async () => {
//     if (!selectedShift || !selectedEmployee) return;

//     try {
//       const res = await fetch(
//         "https://backend.hrms.transev.site/hr/assign-shift",
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//           },
//           body: JSON.stringify({
//             employeeId: selectedEmployee.employeeId,
//             shiftId: selectedShift.id,
//           }),
//         }
//       );

//       const result = await res.json();

//       if (!res.ok) {
//         throw new Error(result.message || "Failed to assign shift");
//       }

//       /* ---------- Build row for table ---------- */
//       const newAssign = {
//         employeeId: result.data.employeeId,
//         employeeName: selectedEmployee.name,
//         shiftId: result.data.assignedShiftId,
//         shiftName: selectedShift.shiftName,
//         fullShiftTime: `${selectedShift.fullShiftStartingTime} - ${selectedShift.fullShiftEndingTime}`,
//         halfShiftTime: `${selectedShift.halfShiftStartingTime || "-"} - ${selectedShift.halfShiftEndingTime || "-"
//           }`,
//       };

//       /* ---------- Update list ---------- */
//       const updated = [...assigned, newAssign];
//       setAssigned(updated);
//       localStorage.setItem("assignedShifts", JSON.stringify(updated));

//       setSelectedShiftId("");
//       setSelectedEmployeeId("");

//       alert("Shift assigned successfully ✅");
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
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
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
//             <GlassSelect
//               label="Shift"
//               options={shifts}
//               value={selectedShiftId}
//               onChange={setSelectedShiftId}
//             />
//             <GlassSelect
//               label="Employee"
//               options={employees}
//               value={selectedEmployeeId}
//               onChange={setSelectedEmployeeId}
//               isEmployee
//             />
//           </div>

//           {/* Button */}
//           <div className="text-center mb-14">
//             <button
//               onClick={handleSave}
//               disabled={!selectedShiftId || !selectedEmployeeId}
//               className="px-10 py-4 bg-yellow-500 text-yellow-900 font-bold rounded-2xl"
//             >
//               Assign Shift
//             </button>
//           </div>

//           {/* -------- Assigned Table -------- */}
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
//                     <tr key={i} className="border-t hover:bg-yellow-50 transition">
//                       <td className="px-6 py-4 font-semibold">{a.employeeName}</td>
//                       <td className="px-6 py-4 font-mono">{a.employeeId}</td>
//                       <td className="px-6 py-4">{a.shiftName}</td>
//                       <td className="px-6 py-4">{a.fullShiftTime}</td>
//                       <td className="px-6 py-4">{a.halfShiftTime}</td>

//                       {/* ✅ DELETE BUTTON */}
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => handleDelete(i)}
//                           className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-xl
//                  hover:bg-red-200 hover:text-red-900 transition"
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

/* ---------------- Glass Select ---------------- */
const GlassSelect = ({ label, options, value, onChange, isEmployee }) => (
  <div className="space-y-2">
    <label className="text-yellow-800 font-semibold text-lg">{label}</label>
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
          {isEmployee ? `${o.name} (${o.employeeId})` : o.shiftName}
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

  // 🔹 EDIT FEATURE
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);


  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to remove this assignment?")) return;
    const updated = assigned.filter((_, i) => i !== index);
    setAssigned(updated);
    localStorage.setItem("assignedShifts", JSON.stringify(updated));
  };

  /* -------- Load assigned list from localStorage -------- */
  useEffect(() => {
    const stored = localStorage.getItem("assignedShifts");
    if (stored) setAssigned(JSON.parse(stored));
  }, []);

  /* ---------------- Fetch Shifts ---------------- */
  useEffect(() => {
    fetch("https://backend.hrms.transev.site/hr/shifts", {
      headers: { Authorization: `Bearer ${localStorage.getItem("hr_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setShifts(data.data || []));
  }, []);

  /* ---------------- Fetch Employees ---------------- */
  useEffect(() => {
    fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
      headers: { Authorization: `Bearer ${localStorage.getItem("hr_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data.data || []));
  }, []);

  const selectedShift = shifts.find((s) => s.id === selectedShiftId);
  const selectedEmployee = employees.find((e) => e.employeeId === selectedEmployeeId);

  // 🔹 Populate edit form when Edit clicked
  const handleEditClick = () => {
    if (!selectedShift) return;
    setEditForm({
      ...selectedShift,
      shiftId: selectedShift.id,
    });
    setShowEdit(true);
  };

  /* ---------------- Assign Shift ---------------- */
const handleSave = async () => {
  if (!selectedShift || !selectedEmployee) return;

  setIsAssigning(true); // start loading

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
    if (!res.ok) throw new Error(result.message);

    const newAssign = {
      employeeId: result.data.employeeId,
      employeeName: selectedEmployee.name,
      shiftId: result.data.assignedShiftId,
      shiftName: selectedShift.shiftName,
      fullShiftTime: `${selectedShift.fullShiftStartingTime} - ${selectedShift.fullShiftEndingTime}`,
      halfShiftTime: `${selectedShift.halfShiftStartingTime || "-"} - ${selectedShift.halfShiftEndingTime || "-"}`
    };

    const updated = [...assigned, newAssign];
    setAssigned(updated);
    localStorage.setItem("assignedShifts", JSON.stringify(updated));

    setSelectedShiftId("");
    setSelectedEmployeeId("");
    alert("Shift assigned successfully ✅");
  } catch (err) {
    alert(err.message);
  } finally {
    setIsAssigning(false); // stop loading
  }
};


  /* ---------------- UPDATE SHIFT ---------------- */
  const handleUpdateShift = async () => {
    setUpdating(true);
    try {
      const res = await fetch(
        "https://backend.hrms.transev.site/hr/edit-shift",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setShifts((prev) =>
        prev.map((s) => (s.id === result.data.id ? result.data : s))
      );

      alert("Shift updated successfully ✅");
      setShowEdit(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(false);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-4">
            <div>
              <GlassSelect
                label="Shift"
                options={shifts}
                value={selectedShiftId}
                onChange={setSelectedShiftId}
              />
              {selectedShiftId && (
                <button
                  onClick={handleEditClick}
                  className="
      mt-4 inline-flex items-center gap-2
      px-5 py-2.5
      text-sm font-bold tracking-wide
      text-yellow-900
      bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500
      rounded-full
      shadow-md shadow-yellow-400/40
      hover:shadow-lg hover:shadow-yellow-500/50
      hover:-translate-y-[1px]
      transition-all duration-300
    "
                >
                  ✨ Edit Shift
                </button>
              )}



            </div>

            <GlassSelect
              label="Employee"
              options={employees}
              value={selectedEmployeeId}
              onChange={setSelectedEmployeeId}
              isEmployee
            />
          </div>

          {/* Assign Button */}
          <div className="text-center mb-10">
            <button
  onClick={handleSave}
  disabled={!selectedShiftId || !selectedEmployeeId || isAssigning}
  className={`
    relative px-10 py-4 font-bold rounded-2xl
    transition-all duration-300
    bg-yellow-500 text-yellow-900
    ${isAssigning ? "opacity-70 blur-[1px] cursor-not-allowed" : "hover:scale-105"}
  `}
>
  {isAssigning ? (
    <span className="flex items-center justify-center gap-3">
      <span className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full animate-spin"></span>
      Assigning...
    </span>
  ) : (
    "Assign Shift"
  )}
</button>

          </div>

          {showEdit && editForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="
      w-full max-w-4xl
      bg-[#fff8dc]
      rounded-3xl
      shadow-2xl
      p-8
      border border-yellow-400
    ">
                {/* Close */}
                <button
                  onClick={() => setShowEdit(false)}
                  className="absolute top-5 right-6 text-2xl font-bold text-yellow-800 hover:text-red-600"
                >
                  ✕
                </button>

                {/* Header */}
                <h2 className="text-3xl font-extrabold text-yellow-900 mb-8 text-center">
                  Edit Shift Details
                </h2>

                {/* Sections */}
                <div className="space-y-10 max-h-[65vh] overflow-y-auto pr-2">

                  {/* BASIC INFO */}
                  <section>
                    <h3 className="text-xl font-bold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
                      Basic Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-yellow-900 mb-1">
                          Shift Name
                        </label>
                        <input
                          value={editForm.shiftName}
                          onChange={(e) =>
                            setEditForm({ ...editForm, shiftName: e.target.value })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-yellow-900 mb-1">
                          Weekly Days Off (comma separated)
                        </label>
                        <input
                          value={editForm.weeklyDaysOff.join(",")}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              weeklyDaysOff: e.target.value.split(","),
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-yellow-300 focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>
                    </div>
                  </section>

                  {/* FULL SHIFT TIMING */}
                  <section>
                    <h3 className="text-xl font-bold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
                      Full Shift Timing
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-yellow-900 mb-1">
                          Full Shift Start Time
                        </label>
                        <input
                          type="datetime-local"
                          value={editForm.fullShiftStartingTime?.slice(0, 16)}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              fullShiftStartingTime: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-yellow-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-yellow-900 mb-1">
                          Full Shift End Time
                        </label>
                        <input
                          type="datetime-local"
                          value={editForm.fullShiftEndingTime?.slice(0, 16)}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              fullShiftEndingTime: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-yellow-300"
                        />
                      </div>
                    </div>
                  </section>

                  {/* RULES */}
                  <section>
                    <h3 className="text-xl font-bold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
                      Attendance Rules
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-yellow-900 mb-1">
                          Grace In (Minutes)
                        </label>
                        <input
                          type="number"
                          value={editForm.fullShiftGraceInTimingInMinutes}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              fullShiftGraceInTimingInMinutes: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-yellow-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-yellow-900 mb-1">
                          Grace Out (Minutes)
                        </label>
                        <input
                          type="number"
                          value={editForm.fullShiftGraceOutTimingInMinutes}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              fullShiftGraceOutTimingInMinutes: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-yellow-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-yellow-900 mb-1">
                          Late Punch → Mark Absent (Minutes)
                        </label>
                        <input
                          type="number"
                          value={
                            editForm.fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes
                          }
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes:
                                Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-yellow-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-yellow-900 mb-1">
                          Max Overtime (Minutes)
                        </label>
                        <input
                          type="number"
                          value={editForm.overtimeMaximumAllowableLimitInMinutes}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              overtimeMaximumAllowableLimitInMinutes: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-yellow-300"
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-6 mt-10">
                  <button
                    onClick={() => setShowEdit(false)}
                    className="px-8 py-3 rounded-xl bg-gray-200 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdateShift}
                    disabled={updating}
                    className="
            px-10 py-3 rounded-xl
            bg-gradient-to-r from-yellow-500 to-amber-500
            text-yellow-900 font-extrabold
            shadow-lg hover:scale-105 transition
          "
                  >
                    {updating ? "Updating..." : "Update Shift"}
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Assigned Table — UNCHANGED */}
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
                    <tr key={i}>
                      <td className="px-6 py-4">{a.employeeName}</td>
                      <td className="px-6 py-4">{a.employeeId}</td>
                      <td className="px-6 py-4">{a.shiftName}</td>
                      <td className="px-6 py-4">{a.fullShiftTime}</td>
                      <td className="px-6 py-4">{a.halfShiftTime}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(i)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-xl"
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
