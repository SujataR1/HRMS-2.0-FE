import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HRSidebar from '../../components/Common/HRSidebar';

const HRAllEmployeeslist = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://192.168.0.100:9000/admin/employee-profiles', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch employees');
        setEmployees(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="flex min-h-screen">
      <HRSidebar />
      <main className="flex-1 bg-yellow-50 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto bg-white border border-yellow-200 rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">All Employees</h2>

          {loading ? (
            <p className="text-center text-yellow-700 font-medium">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-gray-600">No employees found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 border border-yellow-200 rounded-md">
                <thead className="bg-yellow-100 text-yellow-800 font-semibold text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-t hover:bg-yellow-50 transition">
                      <td className="px-4 py-3">{emp.employeeId}</td>
                      <td className="px-4 py-3">{emp.name}</td>
                      <td className="px-4 py-3">{emp.assignedEmail}</td>
                      <td className="px-4 py-3">{emp.employeeDetails?.designation || 'N/A'}</td>
                      <td className="px-4 py-3">{emp.employeeDetails?.department || 'N/A'}</td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/View-Employee-Details/${emp.employeeId}`}
                          className="text-yellow-700 font-medium border border-yellow-300 px-3 py-1 rounded hover:bg-yellow-100"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRAllEmployeeslist;