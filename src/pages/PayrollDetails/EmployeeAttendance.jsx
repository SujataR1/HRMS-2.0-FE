import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";

const EmployeeAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [filterType, setFilterType] = useState("date");
  const [date, setDate] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        setEmployees(data.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const fetchAttendance = async () => {
    if (!selectedEmployee || !selectedEmployee.employeeId) {
      return alert("Please select an employee");
    }

    const body = {
      employeeId: selectedEmployee.employeeId,
    };

    if (filterType === "date" && date) {
      body.date = date;
    } else if (filterType === "monthYear" && monthYear) {
      // API expects monthYear as MM-YYYY
      const [yearPart, monthPart] = monthYear.split("-");
      body.monthYear = `${monthPart}-${yearPart}`;
    } else if (filterType === "year" && year) {
      body.year = year;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://backend.hrms.transev.site/admin/attendance/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch attendance");
      setAttendance(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <AdminSidebar />
      <main className="flex-grow p-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-yellow-900 mb-8">
          Employee Attendance Dashboard
        </h1>

        <section className="bg-white rounded-lg shadow-md p-8 mb-10 border border-yellow-300">
          <h2 className="text-xl font-semibold text-yellow-900 mb-6">Filter Attendance</h2>

          {loading && (
            <div className="mb-4 text-yellow-700 font-medium">Loading...</div>
          )}
          {error && (
            <div className="mb-4 text-red-600 font-medium">{error}</div>
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              fetchAttendance();
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end"
          >
            <div>
              <label
                htmlFor="employeeSelect"
                className="block mb-2 font-medium text-yellow-900"
              >
                Select Employee
              </label>
              <select
                id="employeeSelect"
                value={selectedEmployeeId}
                onChange={e => {
                  const id = e.target.value;
                  setSelectedEmployeeId(id);
                  const emp = employees.find(emp => emp.id === id);
                  setSelectedEmployee(emp || null);
                }}
                className="block w-full rounded-md border border-yellow-400 shadow-sm p-2 focus:border-yellow-500 focus:ring focus:ring-yellow-300"
              >
                <option value="">-- Select Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              {selectedEmployee && (
                <p className="mt-2 text-sm text-yellow-800">
                  Employee ID:{" "}
                  <span className="font-mono bg-yellow-100 px-2 py-1 rounded select-all">
                    {selectedEmployee.employeeId}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="filterType"
                className="block mb-2 font-medium text-yellow-900"
              >
                Filter Type
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="block w-full rounded-md border border-yellow-400 shadow-sm p-2 focus:border-yellow-500 focus:ring focus:ring-yellow-300"
              >
                <option value="date">By Date</option>
                <option value="monthYear">By Month-Year</option>
                <option value="year">By Year</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filterInput"
                className="block mb-2 font-medium text-yellow-900"
              >
                {filterType === "date"
                  ? "Select Date"
                  : filterType === "monthYear"
                    ? "Select Month-Year"
                    : "Enter Year"}
              </label>

              {filterType === "date" && (
                <input
                  id="filterInput"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="block w-full rounded-md border border-yellow-400 shadow-sm p-2 focus:border-yellow-500 focus:ring focus:ring-yellow-300"
                />
              )}

              {filterType === "monthYear" && (
                <input
                  id="filterInput"
                  type="month"
                  value={monthYear}
                  onChange={e => setMonthYear(e.target.value)}
                  className="block w-full rounded-md border border-yellow-400 shadow-sm p-2 focus:border-yellow-500 focus:ring focus:ring-yellow-300"
                />
              )}

              {filterType === "year" && (
                <input
                  id="filterInput"
                  type="number"
                  min="1900"
                  max="2099"
                  placeholder="e.g. 2025"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="block w-full rounded-md border border-yellow-400 shadow-sm p-2 focus:border-yellow-500 focus:ring focus:ring-yellow-300"
                />
              )}
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-md shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? "Fetching..." : "Fetch Attendance"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">Attendance Records</h2>

          {attendance.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow ring-1 ring-yellow-300">
              <table className="min-w-full divide-y divide-yellow-300 bg-white">
                <thead className="bg-yellow-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-900 uppercase tracking-wide"
                    >
                      Sl. No.
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-900 uppercase tracking-wide"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-900 uppercase tracking-wide"
                    >
                      Check-in
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-900 uppercase tracking-wide"
                    >
                      Check-out
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-200">
                  {attendance
                    .filter(record => new Date(record.date) <= new Date())
                    .map((record, idx) => {
                      const { status, punchIn, punchOut, day, date } = record;

                      let punchInDisplay = "—";
                      let punchOutDisplay = "—";
                      let badge = "";

                      // For Sundays and Holidays, make date text red
                      const isSunday = day === "Sunday";
                      const isHoliday = status === "holiday";

                      // CSS class for date text color
                      const dateTextClass = isSunday || isHoliday ? "text-red-600 font-semibold" : "text-yellow-900";

                      if (status === "fullDay" || status === "halfDay") {
                        punchInDisplay = punchIn || "—";
                        punchOutDisplay = punchOut || "—";
                      } else if (status === "weeklyOff") {
                        badge = isSunday ? "🛐 Sunday" : "⛱️ Weekly Off";
                      } else if (status === "holiday") {
                        badge = "📅 Holiday";
                      } else if (status === "approvedLeave") {
                        badge = "📝 Leave";
                      } else if (status === "absent") {
                        badge = "❌ Absent";
                      }

                      return (
                        <tr
                          key={record.id || idx}
                          className={idx % 2 === 0 ? "bg-yellow-50" : "bg-yellow-100"}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-yellow-900 text-sm">
                            {idx + 1}
                          </td>

                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${dateTextClass}`}>
                            {date}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-yellow-900 text-sm">
                            {badge || punchInDisplay}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-yellow-900 text-sm">
                            {badge ? "—" : punchOutDisplay}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>



              </table>
            </div>
          ) : (
            !loading && (
              <p className="text-yellow-700 italic text-center mt-10">
                No attendance records found.
              </p>
            )
          )}
        </section>
      </main>
    </div>
  );
};

export default EmployeeAttendance;
