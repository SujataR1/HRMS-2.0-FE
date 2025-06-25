import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/Common/AdminSidebar";

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://192.168.0.100:9000/admin/employee-profiles", {
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
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeDetails?.designation?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeDetails?.department?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const roleBadgeColors = {
    HR: "bg-yellow-300 text-yellow-900",
    IT: "bg-blue-300 text-blue-900",
    Finance: "bg-green-300 text-green-900",
    Marketing: "bg-pink-300 text-pink-900",
    Sales: "bg-purple-300 text-purple-900",
    Operations: "bg-indigo-300 text-indigo-900",
    Default: "bg-gray-300 text-gray-900",
  };

  const getBadgeColor = (dept) => roleBadgeColors[dept] || roleBadgeColors.Default;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-yellow-300 p-8">
          <h2 className="text-4xl font-extrabold text-yellow-700 mb-8 text-center drop-shadow-sm">
            Employee Directory
          </h2>

          {/* Sticky search bar */}
          <div className="mb-15 mx-auto sticky top-8 bg-yellow-50 z-10 rounded-full shadow-lg p-4 border border-yellow-300 max-w-sm sm:max-w-md">
            <input
              type="search"
              placeholder="Search by name, ID, designation, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-transparent focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 text-lg placeholder-yellow-400 transition bg-yellow-100"
              aria-label="Search employees"
            />
          </div>

          {loading ? (
            <div className="flex justify-center mt-16" role="status" aria-live="polite">
              <svg
                className="animate-spin h-16 w-16 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold text-xl" role="alert">
              {error}
            </p>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center mt-16 space-y-4" role="alert">
              <svg
                className="mx-auto w-40 h-40 opacity-40"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <circle cx="32" cy="32" r="30" stroke="#fbbf24" strokeWidth="4" />
                <path
                  d="M20 32h24M32 20v24"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-gray-600 italic text-xl">No employees found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEmployees.map((emp) => (
                <article
                  key={emp.id}
                  tabIndex={0}
                  className="relative bg-yellow-50 border border-yellow-300 rounded-3xl p-6 shadow-lg
                    hover:shadow-yellow-400 transition-shadow cursor-pointer
                    transform hover:-translate-y-1 hover:scale-[1.03]
                    duration-300
                    backdrop-blur-md bg-opacity-30
                    "
                  style={{
                    background: "rgba(255 246 205 / 0.6)",
                    boxShadow: "0 8px 24px rgba(251,191,36,0.3)",
                    borderImageSlice: 1,
                    borderImageSource: "linear-gradient(45deg, #fbbf24, #f59e0b, #fbbf24)",
                    borderWidth: "2px",
                  }}
                  aria-label={`Employee card for ${emp.name}`}
                >
                  {/* Avatar circle */}
                  <div
                    className="absolute -top-10 left-6 w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 shadow-lg flex items-center justify-center text-white text-3xl font-extrabold select-none"
                    aria-hidden="true"
                  >
                    {getInitials(emp.name)}
                  </div>

                  {/* Employee info */}
                  <div className="mt-14 space-y-2">
                    <h3
                      className="text-2xl font-extrabold text-yellow-700 truncate"
                      title={emp.name}
                    >
                      {emp.name}
                    </h3>

                    <p
                      className="text-yellow-800 font-semibold truncate"
                      title={`Employee ID: ${emp.employeeId}`}
                    >
                      ID: {emp.employeeId}
                    </p>

                    <p className="text-gray-700 truncate" title={emp.assignedEmail}>
                      <span className="font-semibold">Email:</span> {emp.assignedEmail}
                    </p>

                    <p
                      className="text-gray-700 truncate"
                      title={emp.employeeDetails?.designation || "N/A"}
                    >
                      <span className="font-semibold">Designation:</span>{" "}
                      {emp.employeeDetails?.designation || "N/A"}
                    </p>

                    <p
                      className="text-gray-700 truncate flex items-center justify-between"
                      title={emp.employeeDetails?.department || "N/A"}
                    >
                      <span className="font-semibold">Department:</span>{" "}
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                          emp.employeeDetails?.department
                        )}`}
                      >
                        {emp.employeeDetails?.department || "N/A"}
                      </span>
                    </p>
                  </div>

                  {/* View button */}
                  <Link
                    to={`/View-Employee-Details/${emp.employeeId}`}
                    className="inline-block mt-6 w-full py-3 text-center bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-3xl shadow-md transition"
                    aria-label={`View details of ${emp.name}`}
                    tabIndex={-1}
                  >
                    View Details
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllEmployees;
