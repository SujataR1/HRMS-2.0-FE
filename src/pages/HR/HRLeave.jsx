import React, { useState, useEffect } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const HRLeave = () => {
  const [employees, setEmployees] = useState([]);
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [selectedRegisteredEmp, setSelectedRegisteredEmp] = useState(null);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [form, setForm] = useState({
    employeeId: "",
    casualCurrent: "",
    sickCurrent: "",
    bereavementCurrent: "",
    maternityCurrent: "",
    paternityCurrent: "",
    earnedCurrent: "",
    compOffCurrent: "",
    otherCurrent: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("id"); // "id" or "all"
  const [searchedEmployeeName, setSearchedEmployeeName] = useState("");
  const [editValues, setEditValues] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [targetEmployeeId, setTargetEmployeeId] = useState(null);



  // Fetch all employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("hr_token");
        if (!token) throw new Error("No hr token found");
        const res = await fetch(
          "http://192.168.0.100:9000/admin/employee-profiles",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
        setEmployees(data.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch all registered employees by checking leave register for each employee
  useEffect(() => {
    const fetchRegisteredEmployees = async () => {
      try {
        const token = localStorage.getItem("hr_token");
        if (!token || employees.length === 0) return;

        const registered = [];

        for (const emp of employees) {
          try {
            const res = await fetch(
              `http://192.168.0.100:9000/hr/get-leave-register?employeeId=${emp.employeeId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const data = await res.json();
            if (data.status === "success") {
              registered.push({ employeeId: emp.employeeId, name: emp.name });
            }
          } catch {
            // Ignore individual fetch errors
          }
        }

        setRegisteredEmployees(registered);
      } catch (e) {
        console.error("Failed to fetch registered employees", e);
      }
    };

    fetchRegisteredEmployees();
  }, [employees]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "casualCurrent",
        "sickCurrent",
        "bereavementCurrent",
        "maternityCurrent",
        "paternityCurrent",
        "earnedCurrent",
        "compOffCurrent",
        "otherCurrent",
      ].includes(name)
    ) {
      if (value === "" || /^[0-9]+$/.test(value)) {
        setForm((f) => ({ ...f, [name]: value }));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Submit register leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("hr_token");
      if (!token) throw new Error("No HR token found");

      if (!form.employeeId) throw new Error("Please select an employee");

      const payload = {
        employeeId: form.employeeId,
        casualCurrent: Number(form.casualCurrent) || 0,
        sickCurrent: Number(form.sickCurrent) || 0,
        bereavementCurrent: Number(form.bereavementCurrent) || 0,
        maternityCurrent: Number(form.maternityCurrent) || 0,
        paternityCurrent: Number(form.paternityCurrent) || 0,
        earnedCurrent: Number(form.earnedCurrent) || 0,
        compOffCurrent: Number(form.compOffCurrent) || 0,
        otherCurrent: Number(form.otherCurrent) || 0,
      };

      const res = await fetch(
        "http://192.168.0.100:9000/hr/create-leave-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        if (data.message.includes("already")) {
          setMessage("Leave register already created for this employee.");
        } else {
          throw new Error(data.message || "Failed to create leave register");
        }
      } else {
        setMessage(data.message);
        if (
          !registeredEmployees.some(
            (emp) => emp.employeeId === form.employeeId
          )
        ) {
          const empName =
            employees.find((emp) => emp.employeeId === form.employeeId)?.name ||
            form.employeeId;
          setRegisteredEmployees((prev) => [
            ...prev,
            { employeeId: form.employeeId, name: empName },
          ]);
        }
        setForm({
          employeeId: "",
          casualCurrent: "",
          sickCurrent: "",
          bereavementCurrent: "",
          maternityCurrent: "",
          paternityCurrent: "",
          earnedCurrent: "",
          compOffCurrent: "",
          otherCurrent: "",
        });
        setLeaveDetails(null);
        setSelectedRegisteredEmp(null);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch leave details and open modal
  const handleRegisteredSelect = async (employeeId) => {
    setSelectedRegisteredEmp(employeeId);
    setLeaveDetails(null);
    setMessage("");
    setError("");
    setModalOpen(false);

    try {
      setLoading(true);
      const token = localStorage.getItem("hr_token");
      const employeeIds =
        employeeId === "ALL"
          ? employees.map((e) => e.employeeId)
          : [employeeId];

      const res = await fetch(
        "http://192.168.0.100:9000/hr/get-leave-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ employeeIds }),
        }
      );
      const data = await res.json();
      if (res.ok && data.status === "success" && Array.isArray(data.data)) {
        setLeaveDetails(data.data); // array of registers
        setModalOpen(true);
      } else {
        setError(data.message || "No leave data found");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };


  const handleEditChange = (employeeId, field, value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      setEditingRow(prev => ({
        ...prev,
        [field]: value,
      }));

      setEditValues(prev => ({
        ...prev,
        [employeeId]: {
          ...(prev[employeeId] || {}),
          [field]: value,
        },
      }));
    }
  };


  const handleEditSave = async (employeeId) => {
    const edited = { ...editValues[employeeId] };
    delete edited.isEditing;

    const edits = Object.entries(edited).map(([field, val]) => ({
      field,
      mode: "reset",
      val: Number(val),
    }));

    try {
      const token = localStorage.getItem("hr_token");
      const res = await fetch("http://192.168.0.100:9000/hr/edit-leave-register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId, edits }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setMessage("Leave register updated!");

        setEditValues(prev => {
          const updated = { ...prev };
          delete updated[employeeId];
          return updated;
        });

        // Clear editing row to hide inputs
        setEditingRow(null);

        // Reload data after save
        handleRegisteredSelect(viewMode === "all" ? "ALL" : employeeId);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetLeave = (employeeId) => {
    setTargetEmployeeId(employeeId);
    setShowResetModal(true);
  };

  const handleFirstConfirm = () => {
    setShowResetModal(false);
    setShowFinalModal(true);
  };

  const handleFinalConfirm = async () => {
    try {
      const token = localStorage.getItem("hr_token");
      const res = await fetch("http://192.168.0.100:9000/hr/reset-leave-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: targetEmployeeId }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMessage("✅ " + (data.message || "Leave register has been reset."));
        handleRegisteredSelect(viewMode === "all" ? "ALL" : targetEmployeeId);
      } else {
        throw new Error(data.message || "Failed to reset leave register");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setShowFinalModal(false);
      setTargetEmployeeId(null);
    }
  };




  return (
    <div className="flex min-h-screen bg-yellow-50">
      <HRSidebar />
      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-yellow-900 text-center tracking-wide">
          HR Leave Management
        </h1>

        {/* Register Leave Form */}
        <section className="bg-white p-8 rounded-lg shadow-lg mb-12 max-w-full mx-auto">
          <h2 className="text-2xl font-extrabold mb-6 text-yellow-900 tracking-wide">
            Register Leave
          </h2>

          {message && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded font-semibold text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-full">
            <div className="overflow-x-auto">
              {/* Header row */}
              <div className="grid grid-cols-[180px_repeat(8,1fr)] gap-4 font-extrabold text-yellow-900 text-xs border-b-4 border-yellow-400 pb-2 select-none uppercase tracking-wide min-w-[900px] items-center">
                <div className="flex items-center h-8">Employee</div>
                <div className="flex justify-center items-center h-8">Casual Current</div>
                <div className="flex justify-center items-center h-8">Sick Current</div>
                <div className="flex justify-center items-center h-8">Bereavement Current</div>
                <div className="flex justify-center items-center h-8">Maternity Current</div>
                <div className="flex justify-center items-center h-8">Paternity Current</div>
                <div className="flex justify-center items-center h-8">Earned Current</div>
                <div className="flex justify-center items-center h-8">Comp Off Current</div>
                <div className="flex justify-center items-center h-8">Other Current</div>
              </div>

              {/* Inputs row */}
              <div className="grid grid-cols-[180px_repeat(8,1fr)] gap-4 mt-3 items-center min-w-[900px]">
                <select
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  required
                  className="border-2 border-yellow-500 bg-yellow-50 rounded-md px-2 py-1 text-xs font-semibold text-yellow-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 transition w-full hover:border-yellow-600 h-8"
                >
                  <option value="" disabled>
                    Select employee
                  </option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>

                {[
                  "casualCurrent",
                  "sickCurrent",
                  "bereavementCurrent",
                  "maternityCurrent",
                  "paternityCurrent",
                  "earnedCurrent",
                  "compOffCurrent",
                  "otherCurrent",
                ].map((name) => (
                  <input
                    key={name}
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    className="border-2 border-yellow-500 rounded-md px-2 text-center text-xs font-semibold text-yellow-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 transition hover:border-yellow-600 h-8"
                    style={{ maxWidth: "60px" }}
                  />
                ))}
              </div>
            </div>



            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-white font-extrabold px-14 py-3 rounded-full shadow-lg transition transform text-lg select-none"
              >
                {loading ? "Registering..." : "Register Leave"}
              </button>
            </div>
          </form>

        </section>

        {/* Get Registered Leave Section */}
        <section className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold mb-6 text-yellow-900 tracking-wide">
            Get Registered Leave
          </h2>

          {/* Mode Selector */}
          <div className="mb-4 flex gap-6">
            <label className="flex items-center space-x-2 text-sm font-semibold text-yellow-900">
              <input
                type="radio"
                name="viewMode"
                value="id"
                checked={viewMode === "id"}
                onChange={() => {
                  setViewMode("id");
                  setSelectedRegisteredEmp("");
                  setLeaveDetails(null);
                  setEditingRow(null);
                }}
              />
              <span>Search by Employee ID</span>
            </label>

            <label className="flex items-center space-x-2 text-sm font-semibold text-yellow-900">
              <input
                type="radio"
                name="viewMode"
                value="all"
                checked={viewMode === "all"}
                onChange={() => {
                  setViewMode("all");
                  setSelectedRegisteredEmp("ALL");
                  setEditingRow(null);
                  handleRegisteredSelect("ALL");
                }}
              />
              <span>View All Employees</span>
            </label>
          </div>

          {/* Conditional Input for "Search by ID" */}
          {viewMode === "id" && (
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Enter Employee ID"
                value={selectedRegisteredEmp || ""}
                onChange={(e) => setSelectedRegisteredEmp(e.target.value)}
                className="border-2 border-yellow-500 bg-yellow-50 rounded-lg px-4 py-2 text-sm font-semibold text-yellow-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-yellow-300 w-full"
              />
              <button
                onClick={() => {
                  const empId = selectedRegisteredEmp?.trim();
                  if (empId) {
                    const found = employees.find((e) => e.employeeId === empId);
                    setSearchedEmployeeName(found?.name || "Not Found");
                    handleRegisteredSelect(empId);
                  }
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-6 py-2 rounded-lg shadow-md transition"
              >
                Search
              </button>
            </div>
          )}
        </section>

        {/* Modal Popup */}
        {leaveDetails && Array.isArray(leaveDetails) && modalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto"
          >
            <div className="bg-yellow-50 rounded-lg p-6 max-w-6xl w-full shadow-lg relative overflow-auto max-h-[90vh]">

              <h3 className="text-lg font-extrabold mb-4 text-yellow-900 uppercase tracking-wide">
                Leave Details
              </h3>
              {message && (
                <div
                  className="mb-4 p-3 rounded bg-green-500 text-white font-semibold text-center animate-fadeIn"
                  role="alert"
                >
                  {message}
                </div>
              )}

              <table className="w-full text-yellow-900 text-sm font-semibold border border-yellow-300">
                <thead>
                  <tr className="bg-yellow-200 text-left">
                    <th className="p-2">Employee ID</th>
                    <th className="p-2">Casual</th>
                    <th className="p-2">Sick</th>
                    <th className="p-2">Bereavement</th>
                    <th className="p-2">Maternity</th>
                    <th className="p-2">Paternity</th>
                    <th className="p-2">Earned</th>
                    <th className="p-2">Comp Off</th>
                    <th className="p-2">Other</th>
                    <th className="p-2">Grand Total</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveDetails.map((detail) => {
                    const employee = employees.find((emp) => emp.employeeId === detail.employeeId);
                    const displayName = employee ? `${employee.name} (${employee.employeeId})` : detail.employeeId;

                    const isEditing = editingRow?.employeeId === detail.employeeId;
                    const fields = [
                      "casualCurrent", "sickCurrent", "bereavementCurrent", "maternityCurrent",
                      "paternityCurrent", "earnedCurrent", "compOffCurrent", "otherCurrent"
                    ];

                    return (
                      <tr key={detail.id} className="border-t border-yellow-300">
                        <td className="p-2 font-bold">{displayName}</td>
                        {fields.map((field) => (
                          <td key={field} className="p-2 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                className="w-16 border border-yellow-400 px-1 text-right rounded"
                                value={editingRow[field]}
                                onChange={(e) => handleEditChange(editingRow.employeeId, field, e.target.value)
                                }
                              />
                            ) : (
                              detail[field]
                            )}
                          </td>
                        ))}
                        <td className="p-2 text-right">{detail.grandTotal}</td>

                        <td className="p-2 text-center">
                          {isEditing ? (
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleEditSave(detail.employeeId)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded shadow transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingRow(null)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded shadow transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center items-center gap-3">
                              <button
                                onClick={() => setEditingRow({ ...detail })}
                                className="text-blue-600 font-bold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleResetLeave(detail.employeeId)}
                                className="text-red-600 font-bold hover:underline"
                                title="Reset all leaves to 0"
                              >
                                Reset
                              </button>
                            </div>
                          )}
                        </td>



                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white font-extrabold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* First Stylish Confirm Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-yellow-900 mb-4">Confirm Reset</h3>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to reset this employee's leave?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFirstConfirm}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final Stylish Confirm Modal */}
        {showFinalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-red-700 mb-4">⚠️ Final Confirmation</h3>
              <p className="text-sm text-gray-700 mb-6">
                This will reset all leave balances to <strong>0</strong>. This action <strong>cannot be undone</strong>.
                <br /><br />
                Do you want to proceed?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowFinalModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>

  );
};

export default HRLeave;
