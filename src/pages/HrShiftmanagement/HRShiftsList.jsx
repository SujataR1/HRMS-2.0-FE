import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const HRShiftsList = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for employees list (for dropdown)
  const [employees, setEmployees] = useState([]);
  const [empListLoading, setEmpListLoading] = useState(true);
  const [empListError, setEmpListError] = useState(null);

  // State for selected employee ID
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  // State for fetched employee details
  const [employeeData, setEmployeeData] = useState(null);
  const [empLoading, setEmpLoading] = useState(false);
  const [empError, setEmpError] = useState(null);

  // Fetch shifts on mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:9000/hr/shifts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch shifts");
        setShifts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  // Fetch employee list on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setEmpListLoading(true);
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
        setEmpListError(err.message);
      } finally {
        setEmpListLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch selected employee details
  const fetchEmployeeDetails = async (employeeId) => {
    if (!employeeId) return;
    setEmpLoading(true);
    setEmpError(null);
    setEmployeeData(null);
    try {
      const res = await fetch(`http://localhost:9000/admin/employee-details/${employeeId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch employee details");
      setEmployeeData(data.data);
    } catch (err) {
      setEmpError(err.message);
    } finally {
      setEmpLoading(false);
    }
  };

  // Handle employee select change
  const handleEmployeeSelect = (e) => {
    const empId = e.target.value;
    setSelectedEmployeeId(empId);
    if (empId) fetchEmployeeDetails(empId);
    else setEmployeeData(null);
  };

  if (loading)
    return (
      <div>
        <HRSidebar />
        <div className="ml-64 flex items-center justify-center min-h-screen p-10">
          <p className="text-yellow-700 font-semibold text-xl animate-pulse">
            Loading shifts...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <HRSidebar />
        <div className="ml-64 flex items-center justify-center min-h-screen p-10">
          <p className="bg-yellow-200 text-yellow-900 font-semibold rounded-lg p-6 shadow-lg max-w-md text-center">
            Error: {error}
          </p>
        </div>
      </div>
    );

  if (shifts.length === 0)
    return (
      <div>
        <HRSidebar />
        <div className="ml-64 flex items-center justify-center min-h-screen p-10">
          <p className="text-yellow-700 font-semibold text-xl">No shifts found.</p>
        </div>
      </div>
    );

  // Helper to get shift details by id
  const getShiftById = (shiftId) => shifts.find((s) => s.id === shiftId);

  return (
    <div>
      <HRSidebar />
      <main className="ml-64 max-w-5xl mx-auto p-8 min-h-screen bg-yellow-50">
        {/* Shifts List */}
        <h1 className="text-4xl font-extrabold text-yellow-900 mb-10 border-b border-yellow-300 pb-4">
          Shifts List
        </h1>
        <ul className="space-y-6 mb-16">
          {shifts.map((shift) => (
            <li
              key={shift.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-yellow-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-semibold text-yellow-900">
                  {shift.shiftName}
                </h2>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {Array.isArray(shift.weeklyDaysOff) && shift.weeklyDaysOff.length > 0 ? (
                  shift.weeklyDaysOff.map((day) => (
                    <span
                      key={day}
                      className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                    >
                      Day Off: {day}
                    </span>
                  ))
                ) : (
                  <span className="text-yellow-500 italic text-sm">No days off</span>
                )}

                {Array.isArray(shift.weeklyHalfDays) && shift.weeklyHalfDays.length > 0 ? (
                  shift.weeklyHalfDays.map((day) => (
                    <span
                      key={day}
                      className="bg-yellow-200 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                    >
                      Half Day: {day}
                    </span>
                  ))
                ) : (
                  <span className="text-yellow-500 italic text-sm">No half days</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-yellow-800 font-medium">
                <div>
                  <p className="mb-1 text-yellow-900 font-semibold">Full Shift Time</p>
                  <p>
                    {shift.fullShiftStartingTime} - {shift.fullShiftEndingTime}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-yellow-900 font-semibold">Half Shift Time</p>
                  <p>
                    {shift.halfShiftStartingTime} - {shift.halfShiftEndingTime}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Employee Selector and Details */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-yellow-200">
          <h2 className="text-3xl font-bold text-yellow-900 mb-6">
            Select Employee to View Details
          </h2>

          {empListLoading ? (
            <p className="text-yellow-700 font-semibold animate-pulse">Loading employees...</p>
          ) : empListError ? (
            <p className="text-red-600 font-semibold">{empListError}</p>
          ) : (
            <select
              value={selectedEmployeeId}
              onChange={handleEmployeeSelect}
              className="border border-yellow-300 rounded px-4 py-2 w-full sm:w-80 focus:outline-yellow-500 mb-6"
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          )}

          {empLoading && <p className="text-yellow-700 font-semibold">Loading employee details...</p>}

          {empError && <p className="text-red-600 font-semibold">{empError}</p>}

          {employeeData && (
            <div className="text-yellow-900">
              <h3 className="text-2xl font-semibold mb-2">{employeeData.name}</h3>
              <p className="mb-1">
                <strong>Employee ID:</strong> {employeeData.employeeId}
              </p>
              <p className="mb-1">
                <strong>Designation:</strong> {employeeData.employeeDetails.designation}
              </p>
              <p className="mb-1">
                <strong>Department:</strong> {employeeData.employeeDetails.department}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {employeeData.assignedEmail}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {employeeData.employeeDetails.phoneNumber}
              </p>
              <p className="mb-6">
                <strong>Date of Joining:</strong>{" "}
                {new Date(employeeData.employeeDetails.dateOfJoining).toLocaleDateString()}
              </p>

              <h4 className="text-xl font-bold mb-3 border-b border-yellow-300 pb-2">
                Assigned Shift Details
              </h4>

              {(() => {
                const assignedShift = getShiftById(employeeData.employeeDetails.assignedShiftId);
                if (!assignedShift)
                  return <p className="italic text-yellow-700">No shift assigned or shift not found.</p>;

                return (
                  <div className="bg-yellow-100 p-4 rounded shadow-sm">
                    <h5 className="text-lg font-semibold mb-2">{assignedShift.shiftName}</h5>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Array.isArray(assignedShift.weeklyDaysOff) && assignedShift.weeklyDaysOff.length > 0 ? (
                        assignedShift.weeklyDaysOff.map((day) => (
                          <span
                            key={day}
                            className="bg-yellow-200 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                          >
                            Day Off: {day}
                          </span>
                        ))
                      ) : (
                        <span className="text-yellow-500 italic text-sm">No days off</span>
                      )}

                      {Array.isArray(assignedShift.weeklyHalfDays) && assignedShift.weeklyHalfDays.length > 0 ? (
                        assignedShift.weeklyHalfDays.map((day) => (
                          <span
                            key={day}
                            className="bg-yellow-300 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                          >
                            Half Day: {day}
                          </span>
                        ))
                      ) : (
                        <span className="text-yellow-500 italic text-sm">No half days</span>
                      )}
                    </div>
                    <p>
                      <strong>Full Shift:</strong> {assignedShift.fullShiftStartingTime} - {assignedShift.fullShiftEndingTime}
                    </p>
                    <p>
                      <strong>Half Shift:</strong> {assignedShift.halfShiftStartingTime} - {assignedShift.halfShiftEndingTime}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HRShiftsList;
