import React, { useState } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";

const AdminShiftmanagement = () => {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const body = {
        ...form,
        weeklyDaysOff: form.weeklyDaysOff
          ? form.weeklyDaysOff.split(",").map((d) => d.trim())
          : [],
        weeklyHalfDays: form.weeklyHalfDays
          ? form.weeklyHalfDays.split(",").map((d) => d.trim())
          : [],
        fullShiftEarlyPunchConsiderTimeInMinutes: Number(
          form.fullShiftEarlyPunchConsiderTimeInMinutes
        ),
        halfShiftEarlyPunchConsiderTimeInMinutes: Number(
          form.halfShiftEarlyPunchConsiderTimeInMinutes
        ),
        fullShiftGraceInTimingInMinutes: Number(form.fullShiftGraceInTimingInMinutes),
        halfShiftGraceInTimingInMinutes: Number(form.halfShiftGraceInTimingInMinutes),
        fullShiftGraceOutTimingInMinutes: Number(form.fullShiftGraceOutTimingInMinutes),
        halfShiftGraceOutTimingInMinutes: Number(form.halfShiftGraceOutTimingInMinutes),
        fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: Number(
          form.fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes
        ),
        halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes: Number(
          form.halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes
        ),
        overtimeMaximumAllowableLimitInMinutes: form.overtimeMaximumAllowableLimitInMinutes
          ? Number(form.overtimeMaximumAllowableLimitInMinutes)
          : null,
        maximumValidShiftLengthPostRegularEndingTimeInMinutes: form.maximumValidShiftLengthPostRegularEndingTimeInMinutes
          ? Number(form.maximumValidShiftLengthPostRegularEndingTimeInMinutes)
          : null,
        floorPercentageOfTotalFullShiftForHalfDay: Number(
          form.floorPercentageOfTotalFullShiftForHalfDay
        ),
        ceilingPercentageOfTotalFullShiftForHalfDay: Number(
          form.ceilingPercentageOfTotalFullShiftForHalfDay
        ),
        floorPercentageOfTotalHalfShiftForHalfDay: Number(
          form.floorPercentageOfTotalHalfShiftForHalfDay
        ),
        ceilingPercentageOfTotalHalfShiftForHalfDay: Number(
          form.ceilingPercentageOfTotalHalfShiftForHalfDay
        ),
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

      alert("Shift created successfully!");

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
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-700 text-yellow-100 shadow-lg sticky top-0 h-screen">
        <AdminSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto overflow-auto">
        <h1 className="text-4xl font-extrabold text-yellow-900 mb-8 text-center tracking-tight">
          Create New Shift
        </h1>

        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-yellow-200 border border-yellow-400 rounded shadow-sm text-yellow-900 font-semibold">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10 space-y-12"
          noValidate
        >
          {/* Shift Name */}
          <div className="max-w-xl mx-auto">
            <label
              htmlFor="shiftName"
              className="block mb-3 text-yellow-900 font-semibold text-lg"
            >
              Shift Name
            </label>
            <input
              id="shiftName"
              name="shiftName"
              type="text"
              value={form.shiftName}
              onChange={handleChange}
              placeholder="Morning Shift"
              required
              className="w-full p-4 rounded-xl border-2 border-yellow-400 shadow-sm
                  text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
            />
          </div>

          {/* Weekly Off & Half Days */}
          <section className="max-w-5xl mx-auto space-y-8">
            <h2 className="text-yellow-900 font-bold text-2xl border-b border-yellow-300 pb-3 mb-6">
              Weekly Off & Half Days
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto">
              {[
                {
                  label: "Weekly Days Off",
                  name: "weeklyDaysOff",
                  placeholder: "Sunday, Saturday",
                  note: "(comma separated)",
                },
                {
                  label: "Weekly Half Days",
                  name: "weeklyHalfDays",
                  placeholder: "Friday",
                  note: "(comma separated)",
                },
              ].map(({ label, name, placeholder, note }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block mb-2 text-yellow-900 font-semibold text-lg"
                  >
                    {label}{" "}
                    <span className="text-yellow-700 font-normal text-sm">{note}</span>
                  </label>
                  <input
                    id={name}
                    name={name}
                    type="text"
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full p-4 rounded-xl border-2 border-yellow-400 shadow-sm
                        text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Shift Timings */}
          <section className="max-w-5xl mx-auto space-y-8">
            <h2 className="text-yellow-900 font-bold text-2xl border-b border-yellow-300 pb-3 mb-6">
              Shift Timings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto">
              {[
                {
                  label: "Full Shift Starting Time",
                  name: "fullShiftStartingTime",
                  type: "datetime-local",
                  required: true,
                },
                {
                  label: "Full Shift Ending Time",
                  name: "fullShiftEndingTime",
                  type: "datetime-local",
                  required: true,
                },
                {
                  label: "Half Shift Starting Time",
                  name: "halfShiftStartingTime",
                  type: "datetime-local",
                },
                {
                  label: "Half Shift Ending Time",
                  name: "halfShiftEndingTime",
                  type: "datetime-local",
                },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block mb-2 text-yellow-900 font-semibold text-lg"
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    required={required}
                    className="w-full p-4 rounded-xl border-2 border-yellow-400 shadow-sm
                        text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Timing Settings */}
          <section className="max-w-5xl mx-auto space-y-8">
            <h2 className="text-yellow-900 font-bold text-2xl border-b border-yellow-300 pb-3 mb-6">
              Timing Settings (in minutes)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto">
              {[
                {
                  label: "Full Shift Early Punch Consider Time",
                  name: "fullShiftEarlyPunchConsiderTimeInMinutes",
                  type: "number",
                  min: 0,
                  required: true,
                },
                {
                  label: "Half Shift Early Punch Consider Time",
                  name: "halfShiftEarlyPunchConsiderTimeInMinutes",
                  type: "number",
                  min: 0,
                  required: true,
                },
                {
                  label: "Full Shift Grace In Timing",
                  name: "fullShiftGraceInTimingInMinutes",
                  type: "number",
                  min: 0,
                  required: true,
                },
                {
                  label: "Half Shift Grace In Timing",
                  name: "halfShiftGraceInTimingInMinutes",
                  type: "number",
                  min: 0,
                  required: true,
                },
                {
                  label: "Full Shift Grace Out Timing",
                  name: "fullShiftGraceOutTimingInMinutes",
                  type: "number",
                  min: 0,
                  required: true,
                },
                {
                  label: "Half Shift Grace Out Timing",
                  name: "halfShiftGraceOutTimingInMinutes",
                  type: "number",
                  min: 0,
                  required: true,
                },
                {
                  label: "Full Shift Time For First Punch Beyond Which Marked Absent",
                  name: "fullShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes",
                  type: "number",
                  min: 0,
                  required: true,
                },
                {
                  label: "Half Shift Time For First Punch Beyond Which Marked Absent",
                  name: "halfShiftTimeForFirstPunchBeyondWhichMarkedAbsentInMinutes",
                  type: "number",
                  min: 0,
                  required: true,
                },
                {
                  label: "Overtime Maximum Allowable Limit",
                  name: "overtimeMaximumAllowableLimitInMinutes",
                  type: "number",
                  min: 0,
                  placeholder: "Optional",
                },
                {
                  label: "Maximum Valid Shift Length Post Regular Ending Time",
                  name: "maximumValidShiftLengthPostRegularEndingTimeInMinutes",
                  type: "number",
                  min: 0,
                  placeholder: "Optional",
                },
              ].map(({ label, name, type, min, required, placeholder }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block mb-2 text-yellow-900 font-semibold text-lg"
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    min={min}
                    value={form[name]}
                    onChange={handleChange}
                    required={required}
                    placeholder={placeholder}
                    className="w-full p-4 rounded-xl border-2 border-yellow-400 shadow-sm
                        text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Percentage thresholds */}
          <section className="max-w-5xl mx-auto space-y-8">
            <h2 className="text-yellow-900 font-bold text-2xl border-b border-yellow-300 pb-3 mb-6">
              Shift Percentage Thresholds (0 to 1)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto">
              {[
                {
                  label: "Floor Percentage Of Total Full Shift For Half Day",
                  name: "floorPercentageOfTotalFullShiftForHalfDay",
                  type: "number",
                  min: 0,
                  max: 1,
                  step: 0.01,
                  required: true,
                },
                {
                  label: "Ceiling Percentage Of Total Full Shift For Half Day",
                  name: "ceilingPercentageOfTotalFullShiftForHalfDay",
                  type: "number",
                  min: 0,
                  max: 1,
                  step: 0.01,
                  required: true,
                },
                {
                  label: "Floor Percentage Of Total Half Shift For Half Day",
                  name: "floorPercentageOfTotalHalfShiftForHalfDay",
                  type: "number",
                  min: 0,
                  max: 1,
                  step: 0.01,
                  required: true,
                },
                {
                  label: "Ceiling Percentage Of Total Half Shift For Half Day",
                  name: "ceilingPercentageOfTotalHalfShiftForHalfDay",
                  type: "number",
                  min: 0,
                  max: 1,
                  step: 0.01,
                  required: true,
                },
              ].map(({ label, name, type, min, max, step, required }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block mb-2 text-yellow-900 font-semibold text-lg"
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    min={min}
                    max={max}
                    step={step}
                    value={form[name]}
                    onChange={handleChange}
                    required={required}
                    className="w-full p-4 rounded-xl border-2 border-yellow-400 shadow-sm
                        text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className="max-w-xl mx-auto pt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="text-yellow-100 bg-yellow-700 rounded-xl px-8 py-4 text-2xl font-semibold
              hover:bg-yellow-900 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-lg"
            >
              {submitting ? "Submitting..." : "Create Shift"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminShiftmanagement;