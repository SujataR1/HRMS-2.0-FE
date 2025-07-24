import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HRSidebar from '../../components/Common/HRSidebar';

const HRViewEmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(`https://backend.hrms.transev.site/admin/employee-details/${employeeId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`, // Still using admin token
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch employee details');
        setEmployee(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  return (
    <div className="flex min-h-screen">
      <HRSidebar />
      <main className="flex-1 bg-yellow-50 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow border border-gray-200">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">Employee Details</h2>

          {loading ? (
            <p className="text-center text-yellow-700">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <Detail label="Employee ID" value={employee.employeeId} />
              <Detail label="Name" value={employee.name} />
              <Detail label="Assigned Email" value={employee.assignedEmail} />
              {employee.employeeDetails && (
                <>
                  <Detail label="Designation" value={employee.employeeDetails.designation} />
                  <Detail label="Department" value={employee.employeeDetails.department} />
                  <Detail label="Phone" value={employee.employeeDetails.phoneNumber} />
                  <Detail label="Present Address" value={employee.employeeDetails.presentAddress} />
                  <Detail label="Permanent Address" value={employee.employeeDetails.permanentAddress} />
                  <Detail label="PAN" value={employee.employeeDetails.panCardNumber} />
                  <Detail label="Aadhaar" value={employee.employeeDetails.aadhaarCardNumber} />
                  <Detail label="Education" value={employee.employeeDetails.highestEducationalQualification} />
                  <Detail label="Date of Joining" value={formatDate(employee.employeeDetails.dateOfJoining)} />
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-yellow-700">{label}</p>
    <p className="text-base bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 mt-1">{value || 'N/A'}</p>
  </div>
);

const formatDate = (str) =>
  str ? new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

export default HRViewEmployeeDetails;
