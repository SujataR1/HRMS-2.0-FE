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

  // Fetch all employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) throw new Error("No admin token found");
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
    if (!employeeId) {
      setModalOpen(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("hr_token");
      const res = await fetch(
        `http://192.168.0.100:9000/hr/get-leave-register?employeeId=${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setLeaveDetails(data.data);
        setModalOpen(true);
      } else {
        setError(data.message || "Failed to fetch leave details");
        setModalOpen(false);
      }
    } catch (err) {
      setError(err.message);
      setModalOpen(false);
    }
    setLoading(false);
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

          <select
            value={selectedRegisteredEmp || ""}
            onChange={(e) => handleRegisteredSelect(e.target.value)}
            className="border-2 border-yellow-500 bg-yellow-50 rounded-lg px-4 py-3 text-sm font-semibold text-yellow-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-yellow-300 transition w-full hover:border-yellow-600"
          >
            <option value="" disabled>
              Select Registered Employee
            </option>
            {registeredEmployees.length === 0 && (
              <option disabled>No registered employees found</option>
            )}
            {registeredEmployees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </section>

        {/* Modal Popup */}
        {leaveDetails && modalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          >
            <div className="bg-yellow-50 rounded-lg p-6 max-w-md w-full shadow-lg relative">
              <h3 className="text-lg font-extrabold mb-4 text-yellow-900 uppercase tracking-wide">
                Leave Details
              </h3>
              <table className="w-full text-yellow-900 text-sm font-semibold">
                <tbody>
                  <tr className="border-b border-yellow-300">
                    <td className="py-2 font-bold">Casual Current</td>
                    <td className="text-right">{leaveDetails.casualCurrent}</td>
                  </tr>
                  <tr className="border-b border-yellow-300">
                    <td className="py-2 font-bold">Sick Current</td>
                    <td className="text-right">{leaveDetails.sickCurrent}</td>
                  </tr>
                  <tr className="border-b border-yellow-300">
                    <td className="py-2 font-bold">Bereavement Current</td>
                    <td className="text-right">{leaveDetails.bereavementCurrent}</td>
                  </tr>
                  <tr className="border-b border-yellow-300">
                    <td className="py-2 font-bold">Maternity Current</td>
                    <td className="text-right">{leaveDetails.maternityCurrent}</td>
                  </tr>
                  <tr className="border-b border-yellow-300">
                    <td className="py-2 font-bold">Paternity Current</td>
                    <td className="text-right">{leaveDetails.paternityCurrent}</td>
                  </tr>
                  <tr className="border-b border-yellow-300">
                    <td className="py-2 font-bold">Earned Current</td>
                    <td className="text-right">{leaveDetails.earnedCurrent}</td>
                  </tr>
                  <tr className="border-b border-yellow-300">
                    <td className="py-2 font-bold">Comp Off Current</td>
                    <td className="text-right">{leaveDetails.compOffCurrent}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">Other Current</td>
                    <td className="text-right">{leaveDetails.otherCurrent}</td>
                  </tr>
                </tbody>
              </table>

              <button
                onClick={() => setModalOpen(false)}
                className="mt-6 px-6 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white font-extrabold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HRLeave;
