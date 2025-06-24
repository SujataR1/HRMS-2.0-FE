import React, { useState } from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const MyLeaves = () => {
  // Mock leave data - replace with API calls later
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      type: "Sick Leave",
      fromDate: "2025-06-01",
      toDate: "2025-06-03",
      reason: "Fever and cold",
      status: "Approved",
    },
    {
      id: 2,
      type: "Casual Leave",
      fromDate: "2025-05-10",
      toDate: "2025-05-11",
      reason: "Family function",
      status: "Pending",
    },
  ]);

  const [form, setForm] = useState({
    type: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.type || !form.fromDate || !form.toDate) {
      alert("Please fill in all required fields");
      return;
    }

    const newLeave = {
      id: leaves.length + 1,
      ...form,
      status: "Pending",
    };

    setLeaves([newLeave, ...leaves]);
    setForm({ type: "", fromDate: "", toDate: "", reason: "" });
    alert("Leave application submitted!");
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <EmployeeSidebar />

      <main className="flex-1 ml-64 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-yellow-900 border-b border-yellow-300 pb-4">
          My Leaves
        </h1>

        {/* Leave Application Form */}
        <section className="mb-12 max-w-3xl bg-white rounded-xl shadow-lg border border-yellow-300 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-800">Apply for Leave</h2>

          <form onSubmit={handleSubmit} className="space-y-6 text-yellow-900">
            <div>
              <label className="block font-semibold mb-1" htmlFor="type">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block font-semibold mb-1" htmlFor="fromDate">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block font-semibold mb-1" htmlFor="toDate">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="reason">
                Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={3}
                placeholder="Optional"
                className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-6 rounded shadow transition"
            >
              Submit Leave Application
            </button>
          </form>
        </section>

        {/* Previous Leave Applications */}
        <section className="max-w-3xl bg-white rounded-xl shadow-lg border border-yellow-300 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-800">Previous Leave Applications</h2>

          {leaves.length === 0 ? (
            <p className="text-yellow-600 italic">No leave applications found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-yellow-200 text-yellow-900">
                  <th className="py-3 px-4 border border-yellow-300">Type</th>
                  <th className="py-3 px-4 border border-yellow-300">From</th>
                  <th className="py-3 px-4 border border-yellow-300">To</th>
                  <th className="py-3 px-4 border border-yellow-300">Reason</th>
                  <th className="py-3 px-4 border border-yellow-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(({ id, type, fromDate, toDate, reason, status }) => (
                  <tr
                    key={id}
                    className={`border border-yellow-300 ${
                      status === "Approved"
                        ? "bg-green-100 text-green-900"
                        : status === "Rejected"
                        ? "bg-red-100 text-red-900"
                        : "bg-yellow-100 text-yellow-900"
                    }`}
                  >
                    <td className="py-2 px-4 border border-yellow-300">{type}</td>
                    <td className="py-2 px-4 border border-yellow-300">
                      {new Date(fromDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border border-yellow-300">
                      {new Date(toDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border border-yellow-300">{reason || "-"}</td>
                    <td className="py-2 px-4 border border-yellow-300 font-semibold">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyLeaves;
