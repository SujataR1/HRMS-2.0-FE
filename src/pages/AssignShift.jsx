import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/Common/AdminSidebar";

const AssignShift = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
        setEmployees(data.data); // assuming employees list is in data.data
      } catch (err) {
        setMessage({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!selectedEmployee || !shiftId) {
      setMessage({ type: "error", text: "Please select an employee and enter shift ID." });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("https://backend.hrms.transev.site/admin/assign-shift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          shiftId: shiftId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign shift");
      setMessage({ type: "success", text: "Shift assigned successfully!" });
      setShiftId("");
      setSelectedEmployee("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="max-w-xl w-full bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Assign Shift to Employee</h2>

          {loading ? (
            <p className="text-yellow-600">Loading employees...</p>
          ) : message ? (
            <div
              className={`mb-4 px-4 py-2 rounded ${
                message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {message.text}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Select Employee</label>
                <select
                  className="w-full border border-yellow-300 rounded-md p-2"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  required
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.name || emp.employeeId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Enter Shift ID</label>
                <input
                  type="text"
                  className="w-full border border-yellow-300 rounded-md p-2"
                  value={shiftId}
                  onChange={(e) => setShiftId(e.target.value)}
                  placeholder="e.g., shift001"
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-semibold"
                >
                  {submitting ? "Assigning..." : "Assign Shift"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssignShift;
