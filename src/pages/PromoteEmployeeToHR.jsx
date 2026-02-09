// import React, { useEffect, useState } from "react";
// import AdminSidebar from "../components/Common/AdminSidebar";

// const PromoteEmployeeToHR = () => {
//     const [employees, setEmployees] = useState([]);
//     const [selectedId, setSelectedId] = useState("");
//     const [selectedEmpId, setSelectedEmpId] = useState("");
//     const [customPassword, setCustomPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [formTouched, setFormTouched] = useState(false);

//     useEffect(() => {
//         const fetchEmployees = async () => {
//             try {
//                 const res = await fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
//                     },
//                 });
//                 const data = await res.json();
//                 if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
//                 setEmployees(data.data);
//             } catch (err) {
//                 setError(err.message);
//             }
//         };
//         fetchEmployees();
//     }, []);

//     const handleSelect = (id) => {
//         setSelectedId(id);
//         const selected = employees.find((emp) => emp.id === id);
//         setSelectedEmpId(selected?.employeeId || "");
//     };

// const handlePromote = async (e) => {
//   e.preventDefault();
//   setFormTouched(true);
//   setError("");
//   setMessage("");

//   if (!selectedId || !customPassword) {
//     setError("Please fill in all required fields.");
//     return;
//   }

//   setLoading(true);

//   try {
//     const token = localStorage.getItem("admin_token");
//     if (!token) throw new Error("Not authenticated. Please log in.");

//     const res = await fetch(
//       "https://backend.hrms.transev.site/admin/promote-employee-to-hr",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           employeeId: selectedEmpId,
//           customPassword,
//         }),
//       }
//     );

//     const result = await res.json();

//     if (!res.ok) {
//       throw new Error(result.message || "Promotion failed");
//     }

//     setMessage(`✅ ${result.message} — HR Email: ${result.data.email}`);

//     // Clear form
//     setSelectedId("");
//     setSelectedEmpId("");
//     setCustomPassword("");
//     setFormTouched(false);
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };



//     return (
//         <div className="flex min-h-screen bg-yellow-50">
//             <AdminSidebar />
//             <main className="flex-grow p-10 max-w-4xl mx-auto mt-10">
//                 <h1 className="text-3xl font-bold text-yellow-900 mb-8">
//                     Promote Employee to HR
//                 </h1>

//                 <form
//                     onSubmit={handlePromote}
//                     className="bg-white border border-yellow-200 rounded-lg shadow-md p-6 space-y-6"
//                 >
//                     {/* Select Employee */}
//                     <div>
//                         <label className="block font-medium text-yellow-800 mb-2">
//                             Select Employee <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             value={selectedId}
//                             onChange={(e) => handleSelect(e.target.value)}
//                             className={`w-full p-2 border ${formTouched && !selectedId
//                                     ? "border-red-500"
//                                     : "border-yellow-300"
//                                 } rounded focus:outline-none focus:ring-2 focus:ring-yellow-400`}
//                             required
//                         >
//                             <option value="">-- Select --</option>
//                             {employees.map((emp) => (
//                                 <option key={emp.id} value={emp.id}>
//                                     {emp.name} ({emp.employeeId})
//                                 </option>
//                             ))}
//                         </select>
//                         {formTouched && !selectedId && (
//                             <p className="text-red-500 text-sm mt-1">This field is required.</p>
//                         )}
//                     </div>

//                     {/* Show Employee ID */}
//                     {selectedEmpId && (
//                         <div>
//                             <label className="block font-medium text-yellow-800 mb-2">
//                                 Employee ID <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 value={selectedEmpId}
//                                 disabled
//                                 className="w-full p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800"
//                             />
//                         </div>
//                     )}

//                     {/* Password Field (now required) */}
//                     <div>
//                         <label className="block font-medium text-yellow-800 mb-2">
//                             Create a Temporary Password <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             value={customPassword}
//                             onChange={(e) => setCustomPassword(e.target.value)}
//                             placeholder="e.g. Sujata123@#$"
//                             className={`w-full p-2 border ${formTouched && !customPassword
//                                     ? "border-red-500"
//                                     : "border-yellow-300"
//                                 } rounded focus:outline-none focus:ring-2 focus:ring-yellow-400`}
//                             required
//                         />
//                         {formTouched && !customPassword && (
//                             <p className="text-red-500 text-sm mt-1">This field is required.</p>
//                         )}
//                     </div>


//                     {/* Submit Button */}
//                     <div className="flex justify-end">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-yellow-400 text-yellow-900 font-semibold px-6 py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
//                         >
//                             {loading ? "Promoting..." : "Promote to HR"}
//                         </button>
//                     </div>

//                     {/* Message / Error */}
//                     {message && <p className="text-green-700 font-medium">{message}</p>}
//                     {error && <p className="text-red-600 font-medium">{error}</p>}
//                 </form>
//             </main>
//         </div>
//     );
// };

// export default PromoteEmployeeToHR;

import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/Common/AdminSidebar";

const GET_ALL_HRS_API = "https://backend.hrms.transev.site/admin/get-all-hrs";

const PromoteEmployeeToHR = () => {
  const [employees, setEmployees] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  /* Fetch employees & HRs */
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          "https://backend.hrms.transev.site/admin/employee-profiles",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
        setEmployees(data.data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchHrs = async () => {
      try {
        const res = await fetch(GET_ALL_HRS_API, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch HRs");
        setHrs(data.data?.employees || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
    fetchHrs();
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
      if (!token) throw new Error("Not authenticated.");

      const res = await fetch(
        "https://backend.hrms.transev.site/admin/promote-employee-to-hr",
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
      if (!res.ok) throw new Error(result.message || "Promotion failed");

      setMessage(`✅ ${result.message} — HR Email: ${result.data.email}`);

      setHrs((prev) => [
        ...prev,
        {
          employeeId: selectedEmpId,
          name: employees.find((e) => e.employeeId === selectedEmpId)?.name,
          assignedEmail: result.data.email,
        },
      ]);

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

      <main className="flex-grow p-4 sm:p-10 max-w-5xl mx-auto mt-6 space-y-10">
        <h1 className="text-3xl font-bold text-yellow-900">
          Promote Employee to HR
        </h1>

        {/* Promote Form */}
        <form
          onSubmit={handlePromote}
          className="bg-white border border-yellow-200 rounded-2xl shadow-lg p-6 space-y-6"
        >
          {/* Select Employee */}
          <div className="space-y-2">
            <label className="block font-semibold text-yellow-900">
              Select Employee <span className="text-red-500">*</span>
            </label>

            <select
              value={selectedId}
              onChange={(e) => handleSelect(e.target.value)}
              className={`w-full p-3 border ${
                formTouched && !selectedId
                  ? "border-red-500"
                  : "border-yellow-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              required
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          {/* Employee Profile Preview */}
          {selectedEmpId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-700">Selected Employee</p>
              <p className="text-lg font-semibold text-yellow-900">
                {employees.find((e) => e.employeeId === selectedEmpId)?.name}
              </p>
              <p className="text-sm text-yellow-800">
                Employee ID: <span className="font-medium">{selectedEmpId}</span>
              </p>
            </div>
          )}

          {/* Temporary Password */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3">
            <label className="block font-semibold text-yellow-900">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-yellow-700">
              This password will be shared with HR for first login.
            </p>

            <div className="relative">
              <input
                type="text"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="Eg: HR@1234"
                className={`w-full p-3 pr-32 border ${
                  formTouched && !customPassword
                    ? "border-red-500"
                    : "border-yellow-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setCustomPassword(`HR@${Math.floor(1000 + Math.random() * 9000)}`)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 text-sm font-semibold px-3 py-1.5 rounded hover:bg-yellow-500"
              >
                Auto-generate
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-yellow-900 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-500 disabled:opacity-50"
            >
              {loading ? "Promoting..." : "Promote to HR"}
            </button>
          </div>

          {message && <p className="text-green-700">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </form>

        {/* HR List */}
        <section className="bg-white border border-yellow-200 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-yellow-900">Current HRs</h2>
            <span className="bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
              Total: {hrs.length}
            </span>
          </div>

          {hrs.length === 0 ? (
            <p className="text-yellow-700">No HRs found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-yellow-900 text-sm">
                    <th className="px-4">Name</th>
                    <th className="px-4">Employee ID</th>
                    <th className="px-4">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {hrs.map((hr) => (
                    <tr
                      key={hr.employeeId}
                      className="bg-yellow-50 hover:bg-yellow-100 transition"
                    >
                      <td className="px-4 py-3 font-medium text-yellow-900">
                        {hr.name}
                      </td>
                      <td className="px-4 py-3 text-yellow-800">
                        {hr.employeeId}
                      </td>
                      <td className="px-4 py-3 text-yellow-800">
                        {hr.assignedEmail}
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

export default PromoteEmployeeToHR;