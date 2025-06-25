import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";

const AdminAllShift = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assigned, setAssigned] = useState([]);

  const [loadingShifts, setLoadingShifts] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [errorShifts, setErrorShifts] = useState(null);
  const [errorEmployees, setErrorEmployees] = useState(null);

  const [selectedShiftId, setSelectedShiftId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    const existing = localStorage.getItem("assignedShifts");
    if (existing) setAssigned(JSON.parse(existing));
  }, []);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch("http://192.168.0.100:9000/hr/shifts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setShifts(data.data || []);
      } catch (err) {
        setErrorShifts(err.message);
      } finally {
        setLoadingShifts(false);
      }
    };
    fetchShifts();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://192.168.0.100:9000/admin/employee-profiles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setEmployees(data.data || []);
      } catch (err) {
        setErrorEmployees(err.message);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const selectedShift = shifts.find(s => s.id === selectedShiftId);
  const selectedEmployee = employees.find(e => e.employeeId === selectedEmployeeId);

  const handleSave = () => {
    if (!selectedShift || !selectedEmployee) return;
    const newAssign = {
      employeeId: selectedEmployee.employeeId,
      employeeName: selectedEmployee.name,
      shiftId: selectedShift.id,
      shiftName: selectedShift.shiftName,
      fullShiftTime: `${selectedShift.fullShiftStartingTime} - ${selectedShift.fullShiftEndingTime}`,
      halfShiftTime: `${selectedShift.halfShiftStartingTime} - ${selectedShift.halfShiftEndingTime}`,
    };
    const updated = [...assigned, newAssign];
    setAssigned(updated);
    localStorage.setItem("assignedShifts", JSON.stringify(updated));
    setSelectedShiftId("");
    setSelectedEmployeeId("");
  };

  const loading = loadingShifts || loadingEmployees;
  const error = errorShifts || errorEmployees;

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-10 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-yellow-700 animate-pulse text-lg font-semibold">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold text-lg">{error}</p>
        ) : (
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-extrabold text-yellow-900 mb-8 text-center tracking-wide">
              Assign Shifts to Employees
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Select label="Shift" options={shifts} value={selectedShiftId} onChange={setSelectedShiftId} />
              <Select label="Employee" options={employees} value={selectedEmployeeId} onChange={setSelectedEmployeeId} isEmployee />
            </div>

            <div className="text-center mb-10">
              <button
                disabled={!selectedShiftId || !selectedEmployeeId}
                onClick={handleSave}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Shift
              </button>
            </div>

            {assigned.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-yellow-200 shadow-sm">
                <table className="w-full text-left text-sm text-yellow-900">
                  <thead className="bg-yellow-100 sticky top-0 shadow-md z-10">
                    <tr>
                      <th className="px-6 py-3 font-semibold border-b border-yellow-300">Employee Name</th>
                      <th className="px-6 py-3 font-semibold border-b border-yellow-300">Employee ID</th>
                      <th className="px-6 py-3 font-semibold border-b border-yellow-300">Shift Name</th>
                      <th className="px-6 py-3 font-semibold border-b border-yellow-300">Full Shift Time</th>
                      <th className="px-6 py-3 font-semibold border-b border-yellow-300">Half Shift Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assigned.map((a, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-yellow-50 border-b border-yellow-100 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">{a.employeeName}</td>
                        <td className="px-6 py-4 font-mono">{a.employeeId}</td>
                        <td className="px-6 py-4">{a.shiftName}</td>
                        <td className="px-6 py-4">{a.fullShiftTime}</td>
                        <td className="px-6 py-4">{a.halfShiftTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

const Select = ({ label, options, value, onChange, isEmployee }) => (
  <div>
    <label
      htmlFor={label.toLowerCase()}
      className="block text-yellow-900 font-semibold mb-2 text-lg"
    >
      Select {label}
    </label>
    <select
      id={label.toLowerCase()}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-yellow-300 rounded-md px-4 py-3 text-yellow-900 text-base
                 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition"
    >
      <option value="">-- Select {label} --</option>
      {options.map(o => (
        <option key={isEmployee ? o.employeeId : o.id} value={isEmployee ? o.employeeId : o.id}>
          {isEmployee ? `${o.name} (${o.employeeId})` : o.shiftName}
        </option>
      ))}
    </select>
  </div>
);

export default AdminAllShift;