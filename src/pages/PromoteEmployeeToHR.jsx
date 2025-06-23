import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/Common/AdminSidebar";

const PromoteEmployeeToHR = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [customPassword, setCustomPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formTouched, setFormTouched] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("http://localhost:9000/admin/employee-profiles", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                    },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
                setEmployees(data.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchEmployees();
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
        const selected = employees.find((emp) => emp.id === id);
        setSelectedEmpId(selected?.employeeId || "");
    };

const handlePromote = async (e) => {
  e.preventDefault();
  setFormTouched(true);
  setError("");
  setMessage("");

  if (!selectedId || !customPassword) {
    setError("Please fill in all required fields.");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("admin_token");
    if (!token) throw new Error("Not authenticated. Please log in.");

    const res = await fetch(
      "http://localhost:9000/admin/promote-employee-to-hr",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmpId,
          customPassword,
        }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Promotion failed");
    }

    setMessage(`✅ ${result.message} — HR Email: ${result.data.email}`);

    // Clear form
    setSelectedId("");
    setSelectedEmpId("");
    setCustomPassword("");
    setFormTouched(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};



    return (
        <div className="flex min-h-screen bg-yellow-50">
            <AdminSidebar />
            <main className="flex-grow p-10 max-w-4xl mx-auto mt-10">
                <h1 className="text-3xl font-bold text-yellow-900 mb-8">
                    Promote Employee to HR
                </h1>

                <form
                    onSubmit={handlePromote}
                    className="bg-white border border-yellow-200 rounded-lg shadow-md p-6 space-y-6"
                >
                    {/* Select Employee */}
                    <div>
                        <label className="block font-medium text-yellow-800 mb-2">
                            Select Employee <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedId}
                            onChange={(e) => handleSelect(e.target.value)}
                            className={`w-full p-2 border ${formTouched && !selectedId
                                    ? "border-red-500"
                                    : "border-yellow-300"
                                } rounded focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                            required
                        >
                            <option value="">-- Select --</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.employeeId})
                                </option>
                            ))}
                        </select>
                        {formTouched && !selectedId && (
                            <p className="text-red-500 text-sm mt-1">This field is required.</p>
                        )}
                    </div>

                    {/* Show Employee ID */}
                    {selectedEmpId && (
                        <div>
                            <label className="block font-medium text-yellow-800 mb-2">
                                Employee ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={selectedEmpId}
                                disabled
                                className="w-full p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800"
                            />
                        </div>
                    )}

                    {/* Password Field (now required) */}
                    <div>
                        <label className="block font-medium text-yellow-800 mb-2">
                            Create a Temporary Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={customPassword}
                            onChange={(e) => setCustomPassword(e.target.value)}
                            placeholder="e.g. Sujata123@#$"
                            className={`w-full p-2 border ${formTouched && !customPassword
                                    ? "border-red-500"
                                    : "border-yellow-300"
                                } rounded focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                            required
                        />
                        {formTouched && !customPassword && (
                            <p className="text-red-500 text-sm mt-1">This field is required.</p>
                        )}
                    </div>


                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-yellow-400 text-yellow-900 font-semibold px-6 py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
                        >
                            {loading ? "Promoting..." : "Promote to HR"}
                        </button>
                    </div>

                    {/* Message / Error */}
                    {message && <p className="text-green-700 font-medium">{message}</p>}
                    {error && <p className="text-red-600 font-medium">{error}</p>}
                </form>
            </main>
        </div>
    );
};

export default PromoteEmployeeToHR;
