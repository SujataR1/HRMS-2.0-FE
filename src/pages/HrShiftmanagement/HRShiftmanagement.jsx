// import React, { useState } from "react";
// import HRSidebar from "../../components/Common/HRSidebar";

// const HRShiftmanagement = () => {
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [form, setForm] = useState({
//     shiftName: "",
//     weeklyDaysOff: "",
//     weeklyHalfDays: "",
//     fullShiftEarlyPunchConsiderTimeInMinutes: 10,
//     halfShiftEarlyPunchConsiderTimeInMinutes: 5,
//     fullShiftStartingTime: "2025-06-24T09:00",
//     fullShiftEndingTime: "2025-06-24T18:00",
//     halfShiftStartingTime: "2025-06-24T09:00",
//     halfShiftEndingTime: "2025-06-24T13:00",
//     fullShiftGraceInTimingInMinutes: 15,
//     halfShiftGraceInTimingInMinutes: 10,
//     fullShiftGraceOutTimingInMinutes: 15,
//     halfShiftGraceOutTimingInMinutes: 10,
//     fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: 30,
//     halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: 15,
//     overtimeMaximumAllowableLimitInMinutes: 120,
//     maximumValidShiftLengthPostRegularEndingTimeInMinutes: 60,
//     floorPercentageOfTotalFullShiftForHalfDay: 0.4,
//     ceilingPercentageOfTotalFullShiftForHalfDay: 0.6,
//     floorPercentageOfTotalHalfShiftForHalfDay: 0.4,
//     ceilingPercentageOfTotalHalfShiftForHalfDay: 0.6,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSubmitting(true);

//     try {
//       const body = {
//         ...form,
//         weeklyDaysOff: form.weeklyDaysOff
//           ? form.weeklyDaysOff.split(",").map((d) => d.trim())
//           : [],
//         weeklyHalfDays: form.weeklyHalfDays
//           ? form.weeklyHalfDays.split(",").map((d) => d.trim())
//           : [],
//         fullShiftEarlyPunchConsiderTimeInMinutes: Number(
//           form.fullShiftEarlyPunchConsiderTimeInMinutes
//         ),
//         halfShiftEarlyPunchConsiderTimeInMinutes: Number(
//           form.halfShiftEarlyPunchConsiderTimeInMinutes
//         ),
//         fullShiftGraceInTimingInMinutes: Number(form.fullShiftGraceInTimingInMinutes),
//         halfShiftGraceInTimingInMinutes: Number(form.halfShiftGraceInTimingInMinutes),
//         fullShiftGraceOutTimingInMinutes: Number(form.fullShiftGraceOutTimingInMinutes),
//         halfShiftGraceOutTimingInMinutes: Number(form.halfShiftGraceOutTimingInMinutes),
//         fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: Number(
//           form.fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes
//         ),
//         halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: Number(
//           form.halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes
//         ),
//         overtimeMaximumAllowableLimitInMinutes: form.overtimeMaximumAllowableLimitInMinutes
//           ? Number(form.overtimeMaximumAllowableLimitInMinutes)
//           : null,
//         maximumValidShiftLengthPostRegularEndingTimeInMinutes: form.maximumValidShiftLengthPostRegularEndingTimeInMinutes
//           ? Number(form.maximumValidShiftLengthPostRegularEndingTimeInMinutes)
//           : null,
//         floorPercentageOfTotalFullShiftForHalfDay: Number(
//           form.floorPercentageOfTotalFullShiftForHalfDay
//         ),
//         ceilingPercentageOfTotalFullShiftForHalfDay: Number(
//           form.ceilingPercentageOfTotalFullShiftForHalfDay
//         ),
//         floorPercentageOfTotalHalfShiftForHalfDay: Number(
//           form.floorPercentageOfTotalHalfShiftForHalfDay
//         ),
//         ceilingPercentageOfTotalHalfShiftForHalfDay: Number(
//           form.ceilingPercentageOfTotalHalfShiftForHalfDay
//         ),
//       };

//       const res = await fetch("https://backend.hrms.transev.site/hr/create-shift", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to create shift");

//       alert("Shift created successfully!");

//       setForm({
//         shiftName: "",
//         weeklyDaysOff: "",
//         weeklyHalfDays: "",
//         fullShiftEarlyPunchConsiderTimeInMinutes: 10,
//         halfShiftEarlyPunchConsiderTimeInMinutes: 5,
//         fullShiftStartingTime: "2025-06-24T09:00",
//         fullShiftEndingTime: "2025-06-24T18:00",
//         halfShiftStartingTime: "2025-06-24T09:00",
//         halfShiftEndingTime: "2025-06-24T13:00",
//         fullShiftGraceInTimingInMinutes: 15,
//         halfShiftGraceInTimingInMinutes: 10,
//         fullShiftGraceOutTimingInMinutes: 15,
//         halfShiftGraceOutTimingInMinutes: 10,
//         fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: 30,
//         halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: 15,
//         overtimeMaximumAllowableLimitInMinutes: 120,
//         maximumValidShiftLengthPostRegularEndingTimeInMinutes: 60,
//         floorPercentageOfTotalFullShiftForHalfDay: 0.4,
//         ceilingPercentageOfTotalFullShiftForHalfDay: 0.6,
//         floorPercentageOfTotalHalfShiftForHalfDay: 0.4,
//         ceilingPercentageOfTotalHalfShiftForHalfDay: 0.6,
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-yellow-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-yellow-700 text-yellow-100 shadow-lg sticky top-0 h-screen">
//         <HRSidebar />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-10 overflow-auto">
//         <div className="max-w-6xl mx-auto">

//           {/* Page Title */}
//           <h1 className="text-4xl font-bold text-yellow-900 mb-6 tracking-tight">
//             Create New Shift
//           </h1>
//           <p className="text-yellow-800 mb-10 text-lg">
//             Configure shift details, timing rules & weekly offs for employees.
//           </p>

//           {error && (
//             <div className="p-4 mb-8 bg-yellow-200 border border-yellow-500 rounded-lg text-yellow-900 font-semibold">
//               {error}
//             </div>
//           )}

//           {/* Main Card */}
//           <form
//             onSubmit={handleSubmit}
//             className="bg-white shadow-2xl rounded-3xl p-10 space-y-12 border border-yellow-200"
//           >
//             {/* 1. Shift Name */}
//             <div>
//               <h2 className="text-2xl font-bold text-yellow-900 mb-5">Shift Details</h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <label className="block mb-2 font-semibold text-yellow-900">
//                     Shift Name
//                   </label>
//                   <input
//                     type="text"
//                     name="shiftName"
//                     value={form.shiftName}
//                     onChange={handleChange}
//                     placeholder="Morning Shift"
//                     className="w-full p-4 rounded-xl border border-yellow-400 focus:ring-4 
//                   focus:ring-yellow-300 outline-none text-lg"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* 2. Weekly Offs */}
//             <div>
//               <h2 className="text-2xl font-bold text-yellow-900 mb-5 border-b pb-2 border-yellow-300">
//                 Weekly Off & Half Day Settings
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <label className="block mb-2 font-semibold text-yellow-900">
//                     Weekly Days Off <span className="text-sm text-yellow-700">(comma separated)</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="weeklyDaysOff"
//                     value={form.weeklyDaysOff}
//                     onChange={handleChange}
//                     placeholder="Sunday, Saturday"
//                     className="w-full p-4 rounded-xl border border-yellow-400 focus:ring-4 focus:ring-yellow-300 outline-none text-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-semibold text-yellow-900">
//                     Weekly Half Days <span className="text-sm text-yellow-700">(comma separated)</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="weeklyHalfDays"
//                     value={form.weeklyHalfDays}
//                     onChange={handleChange}
//                     placeholder="Friday"
//                     className="w-full p-4 rounded-xl border border-yellow-400 focus:ring-4 focus:ring-yellow-300 outline-none text-lg"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* 3. Shift timings */}
//             <div>
//               <h2 className="text-2xl font-bold text-yellow-900 mb-5 border-b pb-2 border-yellow-300">
//                 Shift Timings
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {[
//                   { label: "Full Shift Starting Time", name: "fullShiftStartingTime" },
//                   { label: "Full Shift Ending Time", name: "fullShiftEndingTime" },
//                   { label: "Half Shift Starting Time", name: "halfShiftStartingTime" },
//                   { label: "Half Shift Ending Time", name: "halfShiftEndingTime" }
//                 ].map((f) => (
//                   <div key={f.name}>
//                     <label className="block mb-2 font-semibold text-yellow-900">
//                       {f.label}
//                     </label>
//                     <input
//                       type="datetime-local"
//                       name={f.name}
//                       value={form[f.name]}
//                       onChange={handleChange}
//                       className="w-full p-4 rounded-xl border border-yellow-400 focus:ring-4 focus:ring-yellow-300 outline-none text-lg"
//                       required
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* 4. Time Settings */}
//             <div>
//               <h2 className="text-2xl font-bold text-yellow-900 mb-5 border-b pb-2 border-yellow-300">
//                 Timing Settings (Minutes)
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {[
//                   ["Full Shift Early Punch Consider Time", "fullShiftEarlyPunchConsiderTimeInMinutes"],
//                   ["Half Shift Early Punch Consider Time", "halfShiftEarlyPunchConsiderTimeInMinutes"],
//                   ["Full Shift Grace In Timing", "fullShiftGraceInTimingInMinutes"],
//                   ["Half Shift Grace In Timing", "halfShiftGraceInTimingInMinutes"],
//                   ["Full Shift Grace Out Timing", "fullShiftGraceOutTimingInMinutes"],
//                   ["Half Shift Grace Out Timing", "halfShiftGraceOutTimingInMinutes"],
//                   [
//                     "Full Shift First Punch Late (Marked Absent)",
//                     "fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes"
//                   ],
//                   [
//                     "Half Shift First Punch Late (Marked Absent)",
//                     "halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes"
//                   ],
//                   ["Overtime Maximum Allowable Limit", "overtimeMaximumAllowableLimitInMinutes"],
//                   [
//                     "Max Valid Shift Length Post Ending Time",
//                     "maximumValidShiftLengthPostRegularEndingTimeInMinutes"
//                   ]
//                 ].map(([label, name]) => (
//                   <div key={name}>
//                     <label className="block mb-2 font-semibold text-yellow-900">{label}</label>
//                     <input
//                       type="number"
//                       name={name}
//                       value={form[name]}
//                       onChange={handleChange}
//                       className="w-full p-4 rounded-xl border border-yellow-400 focus:ring-4 focus:ring-yellow-300 outline-none text-lg"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* 5. Percentage Rules */}
//             <div>
//               <h2 className="text-2xl font-bold text-yellow-900 mb-5 border-b pb-2 border-yellow-300">
//                 Shift Percentage Thresholds (0 - 1)
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {[
//                   ["Floor % of Full Shift for Half Day", "floorPercentageOfTotalFullShiftForHalfDay"],
//                   ["Ceiling % of Full Shift for Half Day", "ceilingPercentageOfTotalFullShiftForHalfDay"],
//                   ["Floor % of Half Shift for Half Day", "floorPercentageOfTotalHalfShiftForHalfDay"],
//                   ["Ceiling % of Half Shift for Half Day", "ceilingPercentageOfTotalHalfShiftForHalfDay"]
//                 ].map(([label, name]) => (
//                   <div key={name}>
//                     <label className="block mb-2 font-semibold text-yellow-900">{label}</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min={0}
//                       max={1}
//                       name={name}
//                       value={form[name]}
//                       onChange={handleChange}
//                       className="w-full p-4 rounded-xl border border-yellow-400 focus:ring-4 focus:ring-yellow-300 outline-none text-lg"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="pt-6 flex justify-center">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-yellow-700 hover:bg-yellow-800 text-yellow-100 font-bold px-10 py-4 text-xl rounded-xl shadow-lg
//               focus:ring-4 focus:ring-yellow-400"
//               >
//                 {submitting ? "Creating..." : "Create Shift"}
//               </button>
//             </div>

//           </form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HRShiftmanagement;

import React, { useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const HRShiftmanagement = () => {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Break Policy State
  const [breakPolicy, setBreakPolicy] = useState({
    enabled: false,
    totalBreakDurationMinutes: 60,
    breakSegments: [
      { durationMinutes: 60, paid: true, startOffsetMinutes: 240 }
    ],
    allowSplitBreaks: false,
    minimumBreakDurationMinutes: 15,
    maximumBreakDurationMinutes: 120,
    breakDeductType: "automatic"
  });

  const [showBreakConfig, setShowBreakConfig] = useState(false);

  const [form, setForm] = useState({
    shiftName: "",
    weeklyDaysOff: "",
    weeklyHalfDays: "",
    fullShiftEarlyPunchConsiderTimeInMinutes: 10,
    halfShiftEarlyPunchConsiderTimeInMinutes: 5,
    fullShiftStartingTime: "2025-06-24T09:00",
    fullShiftEndingTime: "2025-06-24T18:00",
    halfShiftStartingTime: "2025-06-24T09:00",
    halfShiftEndingTime: "2025-06-24T13:00",
    fullShiftGraceInTimingInMinutes: 15,
    halfShiftGraceInTimingInMinutes: 10,
    fullShiftGraceOutTimingInMinutes: 15,
    halfShiftGraceOutTimingInMinutes: 10,
    fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: 30,
    halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: 15,
    overtimeMaximumAllowableLimitInMinutes: 120,
    maximumValidShiftLengthPostRegularEndingTimeInMinutes: 60,
    floorPercentageOfTotalFullShiftForHalfDay: 0.4,
    ceilingPercentageOfTotalFullShiftForHalfDay: 0.6,
    floorPercentageOfTotalHalfShiftForHalfDay: 0.4,
    ceilingPercentageOfTotalHalfShiftForHalfDay: 0.6,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBreakPolicyChange = (field, value) => {
    setBreakPolicy(prev => ({ ...prev, [field]: value }));
  };

  const addBreakSegment = () => {
    setBreakPolicy(prev => ({
      ...prev,
      breakSegments: [...prev.breakSegments, { durationMinutes: 30, paid: true, startOffsetMinutes: 0 }]
    }));
  };

  const removeBreakSegment = (index) => {
    setBreakPolicy(prev => ({
      ...prev,
      breakSegments: prev.breakSegments.filter((_, i) => i !== index)
    }));
  };

  const updateBreakSegment = (index, field, value) => {
    setBreakPolicy(prev => ({
      ...prev,
      breakSegments: prev.breakSegments.map((seg, i) => 
        i === index ? { ...seg, [field]: value } : seg
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const totalBreakMins = breakPolicy.enabled 
        ? breakPolicy.breakSegments.reduce((sum, seg) => sum + seg.durationMinutes, 0)
        : null;

      const body = {
        ...form,
        weeklyDaysOff: form.weeklyDaysOff
          ? form.weeklyDaysOff.split(",").map((d) => d.trim())
          : [],
        weeklyHalfDays: form.weeklyHalfDays
          ? form.weeklyHalfDays.split(",").map((d) => d.trim())
          : [],
        fullShiftEarlyPunchConsiderTimeInMinutes: Number(form.fullShiftEarlyPunchConsiderTimeInMinutes),
        halfShiftEarlyPunchConsiderTimeInMinutes: Number(form.halfShiftEarlyPunchConsiderTimeInMinutes),
        fullShiftGraceInTimingInMinutes: Number(form.fullShiftGraceInTimingInMinutes),
        halfShiftGraceInTimingInMinutes: Number(form.halfShiftGraceInTimingInMinutes),
        fullShiftGraceOutTimingInMinutes: Number(form.fullShiftGraceOutTimingInMinutes),
        halfShiftGraceOutTimingInMinutes: Number(form.halfShiftGraceOutTimingInMinutes),
        fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: Number(form.fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes),
        halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: Number(form.halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes),
        overtimeMaximumAllowableLimitInMinutes: form.overtimeMaximumAllowableLimitInMinutes ? Number(form.overtimeMaximumAllowableLimitInMinutes) : null,
        maximumValidShiftLengthPostRegularEndingTimeInMinutes: form.maximumValidShiftLengthPostRegularEndingTimeInMinutes ? Number(form.maximumValidShiftLengthPostRegularEndingTimeInMinutes) : null,
        floorPercentageOfTotalFullShiftForHalfDay: Number(form.floorPercentageOfTotalFullShiftForHalfDay),
        ceilingPercentageOfTotalFullShiftForHalfDay: Number(form.ceilingPercentageOfTotalFullShiftForHalfDay),
        floorPercentageOfTotalHalfShiftForHalfDay: Number(form.floorPercentageOfTotalHalfShiftForHalfDay),
        ceilingPercentageOfTotalHalfShiftForHalfDay: Number(form.ceilingPercentageOfTotalHalfShiftForHalfDay),
        breakPolicy: breakPolicy.enabled ? {
          totalBreakDurationMinutes: totalBreakMins,
          breakSegments: breakPolicy.breakSegments,
          allowSplitBreaks: breakPolicy.allowSplitBreaks,
          minimumBreakDurationMinutes: breakPolicy.minimumBreakDurationMinutes,
          maximumBreakDurationMinutes: breakPolicy.maximumBreakDurationMinutes,
          breakDeductType: breakPolicy.breakDeductType
        } : null
      };

      const res = await fetch("https://backend.hrms.transev.site/hr/create-shift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create shift");

      alert(`✓ Shift created successfully! ${breakPolicy.enabled ? `Break policy: ${totalBreakMins} min/day` : "No break policy set"}`);

      // Reset form
      setForm({
        shiftName: "",
        weeklyDaysOff: "",
        weeklyHalfDays: "",
        fullShiftEarlyPunchConsiderTimeInMinutes: 10,
        halfShiftEarlyPunchConsiderTimeInMinutes: 5,
        fullShiftStartingTime: "2025-06-24T09:00",
        fullShiftEndingTime: "2025-06-24T18:00",
        halfShiftStartingTime: "2025-06-24T09:00",
        halfShiftEndingTime: "2025-06-24T13:00",
        fullShiftGraceInTimingInMinutes: 15,
        halfShiftGraceInTimingInMinutes: 10,
        fullShiftGraceOutTimingInMinutes: 15,
        halfShiftGraceOutTimingInMinutes: 10,
        fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: 30,
        halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: 15,
        overtimeMaximumAllowableLimitInMinutes: 120,
        maximumValidShiftLengthPostRegularEndingTimeInMinutes: 60,
        floorPercentageOfTotalFullShiftForHalfDay: 0.4,
        ceilingPercentageOfTotalFullShiftForHalfDay: 0.6,
        floorPercentageOfTotalHalfShiftForHalfDay: 0.4,
        ceilingPercentageOfTotalHalfShiftForHalfDay: 0.6,
      });
      setBreakPolicy({
        enabled: false,
        totalBreakDurationMinutes: 60,
        breakSegments: [{ durationMinutes: 60, paid: true, startOffsetMinutes: 240 }],
        allowSplitBreaks: false,
        minimumBreakDurationMinutes: 15,
        maximumBreakDurationMinutes: 120,
        breakDeductType: "automatic"
      });
      setShowBreakConfig(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50">
      <HRSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
              <span className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Create New Shift
            </h1>
            <p className="text-amber-600 mt-1 ml-14">Configure shift timings, grace periods, overtime rules & break policies</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shift Name */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50">
                <h2 className="font-semibold text-amber-800">Shift Details</h2>
              </div>
              <div className="p-6">
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-amber-800 mb-2">Shift Name *</label>
                  <input
                    type="text"
                    name="shiftName"
                    value={form.shiftName}
                    onChange={handleChange}
                    placeholder="e.g., Morning Shift, Night Shift"
                    className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50">
                <h2 className="font-semibold text-amber-800">Weekly Schedule</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Weekly Days Off <span className="text-amber-500 text-xs">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      name="weeklyDaysOff"
                      value={form.weeklyDaysOff}
                      onChange={handleChange}
                      placeholder="Sunday, Saturday"
                      className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Weekly Half Days <span className="text-amber-500 text-xs">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      name="weeklyHalfDays"
                      value={form.weeklyHalfDays}
                      onChange={handleChange}
                      placeholder="Friday"
                      className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shift Timings */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50">
                <h2 className="font-semibold text-amber-800">Shift Timings</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Full Shift Start</label>
                    <input
                      type="datetime-local"
                      name="fullShiftStartingTime"
                      value={form.fullShiftStartingTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Full Shift End</label>
                    <input
                      type="datetime-local"
                      name="fullShiftEndingTime"
                      value={form.fullShiftEndingTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Half Shift Start</label>
                    <input
                      type="datetime-local"
                      name="halfShiftStartingTime"
                      value={form.halfShiftStartingTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Half Shift End</label>
                    <input
                      type="datetime-local"
                      name="halfShiftEndingTime"
                      value={form.halfShiftEndingTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Timing Settings */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50">
                <h2 className="font-semibold text-amber-800">Grace Periods & Overtime Rules (in minutes)</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Full Shift Early Punch Consider</label>
                    <input type="number" name="fullShiftEarlyPunchConsiderTimeInMinutes" value={form.fullShiftEarlyPunchConsiderTimeInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Half Shift Early Punch Consider</label>
                    <input type="number" name="halfShiftEarlyPunchConsiderTimeInMinutes" value={form.halfShiftEarlyPunchConsiderTimeInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Full Shift Grace In</label>
                    <input type="number" name="fullShiftGraceInTimingInMinutes" value={form.fullShiftGraceInTimingInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Half Shift Grace In</label>
                    <input type="number" name="halfShiftGraceInTimingInMinutes" value={form.halfShiftGraceInTimingInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Full Shift Grace Out</label>
                    <input type="number" name="fullShiftGraceOutTimingInMinutes" value={form.fullShiftGraceOutTimingInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Half Shift Grace Out</label>
                    <input type="number" name="halfShiftGraceOutTimingInMinutes" value={form.halfShiftGraceOutTimingInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Full Shift Late (Marked Absent)</label>
                    <input type="number" name="fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes" value={form.fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Half Shift Late (Marked Absent)</label>
                    <input type="number" name="halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes" value={form.halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Overtime Max Limit</label>
                    <input type="number" name="overtimeMaximumAllowableLimitInMinutes" value={form.overtimeMaximumAllowableLimitInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Max Valid Shift Length Post End</label>
                    <input type="number" name="maximumValidShiftLengthPostRegularEndingTimeInMinutes" value={form.maximumValidShiftLengthPostRegularEndingTimeInMinutes} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Break Policy Section - Light & Elegant */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50">
                <h2 className="font-semibold text-amber-800 flex items-center gap-2">
                  <span className="text-lg">☕</span> Break Policy Configuration
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl mb-6">
                  <div>
                    <p className="font-medium text-amber-800">Enable Break Policy</p>
                    <p className="text-sm text-amber-600">Set break rules for this shift</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBreakConfig(!showBreakConfig);
                      setBreakPolicy(prev => ({ ...prev, enabled: !prev.enabled }));
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${breakPolicy.enabled ? 'bg-amber-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${breakPolicy.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {showBreakConfig && breakPolicy.enabled && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Break Deduct Type</label>
                        <select
                          value={breakPolicy.breakDeductType}
                          onChange={(e) => handleBreakPolicyChange('breakDeductType', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
                        >
                          <option value="automatic">Automatic Deduction</option>
                          <option value="manual">Manual Entry Required</option>
                          <option value="honorSystem">Honor System (Self Report)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Allow Split Breaks</label>
                        <select
                          value={breakPolicy.allowSplitBreaks}
                          onChange={(e) => handleBreakPolicyChange('allowSplitBreaks', e.target.value === 'true')}
                          className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
                        >
                          <option value="false">No - Single continuous break</option>
                          <option value="true">Yes - Multiple break segments</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-amber-800">Break Segments</label>
                        <button type="button" onClick={addBreakSegment} className="text-sm text-amber-600 hover:text-amber-700 font-medium">+ Add Segment</button>
                      </div>
                      <div className="space-y-3">
                        {breakPolicy.breakSegments.map((segment, idx) => (
                          <div key={idx} className="flex flex-wrap gap-3 items-end p-3 bg-amber-50 rounded-lg">
                            <div className="flex-1 min-w-[100px]">
                              <label className="block text-xs text-amber-700 mb-1">Duration (min)</label>
                              <input type="number" value={segment.durationMinutes} onChange={(e) => updateBreakSegment(idx, 'durationMinutes', parseInt(e.target.value))} className="w-full p-2 rounded-lg border border-amber-200 focus:border-amber-400 outline-none" min="5" max="180" />
                            </div>
                            <div className="flex-1 min-w-[120px]">
                              <label className="block text-xs text-amber-700 mb-1">Start Offset (min from shift start)</label>
                              <input type="number" value={segment.startOffsetMinutes} onChange={(e) => updateBreakSegment(idx, 'startOffsetMinutes', parseInt(e.target.value))} className="w-full p-2 rounded-lg border border-amber-200 focus:border-amber-400 outline-none" min="0" />
                            </div>
                            <div className="flex-1 min-w-[90px]">
                              <label className="block text-xs text-amber-700 mb-1">Paid?</label>
                              <select value={segment.paid} onChange={(e) => updateBreakSegment(idx, 'paid', e.target.value === 'true')} className="w-full p-2 rounded-lg border border-amber-200 focus:border-amber-400 outline-none bg-white">
                                <option value="true">Paid</option>
                                <option value="false">Unpaid</option>
                              </select>
                            </div>
                            {breakPolicy.breakSegments.length > 1 && (
                              <button type="button" onClick={() => removeBreakSegment(idx)} className="text-red-400 hover:text-red-600 p-2">✕</button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-amber-600 mt-2">
                        Total break: <strong>{breakPolicy.breakSegments.reduce((sum, s) => sum + s.durationMinutes, 0)} minutes</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Minimum Break Duration (min)</label>
                        <input type="number" value={breakPolicy.minimumBreakDurationMinutes} onChange={(e) => handleBreakPolicyChange('minimumBreakDurationMinutes', parseInt(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" min="5" max="60" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">Maximum Break Duration (min)</label>
                        <input type="number" value={breakPolicy.maximumBreakDurationMinutes} onChange={(e) => handleBreakPolicyChange('maximumBreakDurationMinutes', parseInt(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" min="30" max="240" />
                      </div>
                    </div>
                  </div>
                )}

                {!breakPolicy.enabled && (
                  <div className="text-center py-6 text-amber-400">
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No break policy set. Toggle to configure break rules.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Half-Day Thresholds */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50">
                <h2 className="font-semibold text-amber-800">Half-Day Thresholds (0-1 range)</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Floor % Full Shift for Half Day</label>
                    <input type="number" step="0.01" min="0" max="1" name="floorPercentageOfTotalFullShiftForHalfDay" value={form.floorPercentageOfTotalFullShiftForHalfDay} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Ceiling % Full Shift for Half Day</label>
                    <input type="number" step="0.01" min="0" max="1" name="ceilingPercentageOfTotalFullShiftForHalfDay" value={form.ceilingPercentageOfTotalFullShiftForHalfDay} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Floor % Half Shift for Half Day</label>
                    <input type="number" step="0.01" min="0" max="1" name="floorPercentageOfTotalHalfShiftForHalfDay" value={form.floorPercentageOfTotalHalfShiftForHalfDay} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">Ceiling % Half Shift for Half Day</label>
                    <input type="number" step="0.01" min="0" max="1" name="ceilingPercentageOfTotalHalfShiftForHalfDay" value={form.ceilingPercentageOfTotalHalfShiftForHalfDay} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-3 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>⏳ Creating...</>
                ) : (
                  <>✓ Create Shift</>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default HRShiftmanagement;