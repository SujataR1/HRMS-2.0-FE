// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import AdminSidebar from '../components/Common/AdminSidebar';

// const ViewEmployeeDetails = () => {
//   const { employeeId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Fetch employee data from backend
//   const fetchEmployee = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`https://backend.hrms.transev.site/admin/employee-details/${employeeId}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
//         },
//       });

//       const data = await res.json();
//       console.log('Fetched employee data:', data); // Debug output

//       if (!res.ok) throw new Error(data.message || 'Failed to fetch employee details');

//       // Use deep clone to ensure React state update triggers rerender
//       setEmployee(JSON.parse(JSON.stringify(data.data)));

//       setError('');
//     } catch (err) {
//       setError(err.message);
//       setEmployee(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch on mount or employeeId change
//   useEffect(() => {
//     if (!employeeId) return;
//     fetchEmployee();
//   }, [employeeId]);

//   // On navigation with successMessage in location.state,
//   // show success message and refetch employee data
//   useEffect(() => {
//     if (location.state?.successMessage) {
//       setSuccessMessage(location.state.successMessage);

//       // Small delay to ensure backend update is complete before fetching
//       setTimeout(() => {
//         fetchEmployee();
//       }, 100);

//       // Clear successMessage from history so it doesn't show on back/refresh
//       navigate(location.pathname, { replace: true });
//     }
//   }, [location.state, navigate, location.pathname]);

//   // Navigate to edit page
//   const handleEdit = () => {
//     navigate(`/employee-details/${employeeId}`);
//   };

//   return (
//     <div className="flex min-h-screen">
//       <AdminSidebar />
//       <main className="flex-1 bg-gray-50 p-6 overflow-auto">
//         <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow border border-gray-200">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-3xl font-bold text-yellow-600">View Employee Details</h2>
//             {!loading && !error && (
//               <button
//                 onClick={handleEdit}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
//               >
//                 Edit
//               </button>
//             )}
//           </div>

//           {/* Success Message */}
//           {successMessage && (
//             <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
//               {successMessage}
//             </div>
//           )}

//           {loading ? (
//             <p className="text-center text-yellow-700">Loading...</p>
//           ) : error ? (
//             <p className="text-center text-red-500">{error}</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
//               <Detail label="Employee ID" value={employee.employeeId} />
//               <Detail label="Name" value={employee.name} />
//               <Detail label="Assigned Email" value={employee.assignedEmail} />

//               {employee.employeeDetails && (
//                 <>
//                   <Detail label="Personal Email" value={employee.employeeDetails.personalEmail} />
//                   <Detail label="Employment Type" value={employee.employeeDetails.employmentType} />
//                   <Detail label="Employment Status" value={employee.employeeDetails.employmentStatus} />
//                   <Detail label="Date of Joining" value={formatDate(employee.employeeDetails.dateOfJoining)} />
//                   <Detail label="Confirmation Date" value={formatDate(employee.employeeDetails.confirmationDate)} />
//                   <Detail label="Phone Number" value={employee.employeeDetails.phoneNumber} />
//                   <Detail label="Emergency Contact" value={employee.employeeDetails.emergencyContactNumber} />
//                   <Detail label="Present Address" value={employee.employeeDetails.presentAddress} />
//                   <Detail label="Permanent Address" value={employee.employeeDetails.permanentAddress} />
//                   <Detail label="Aadhaar Card Number" value={employee.employeeDetails.aadhaarCardNumber} />
//                   <Detail label="PAN Card Number" value={employee.employeeDetails.panCardNumber} />
//                   <Detail label="Blood Group" value={employee.employeeDetails.bloodGroup} />
//                   <Detail label="Medical Notes" value={employee.employeeDetails.medicalNotes || 'N/A'} />
//                   <Detail label="Education" value={employee.employeeDetails.highestEducationalQualification} />
//                   <Detail label="Designation" value={employee.employeeDetails.designation} />
//                   <Detail label="Department" value={employee.employeeDetails.department} />
//                   <Detail label="Bank Name" value={employee.employeeDetails.bankName} />
//                   <Detail label="Bank Account Number" value={employee.employeeDetails.bankAccountNumber} />
//                   <Detail label="IFSC Code" value={employee.employeeDetails.ifsCode} />
//                   <Detail
//                     label="Assigned Shift ID"
//                     value={employee.employeeDetails.assignedShiftId || 'Not Assigned'}
//                   />
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// const Detail = ({ label, value }) => (
//   <div>
//     <p className="text-sm font-semibold text-yellow-700">{label}</p>
//     <p className="text-base bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 mt-1">{value}</p>
//   </div>
// );

// const formatDate = (str) =>
//   str ? new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';

// export default ViewEmployeeDetails;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/Common/AdminSidebar';

const ViewEmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [shifts, setShifts] = useState([]);
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Fetch employee details
  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://backend.hrms.transev.site/admin/employee-details/${employeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch employee details');

      setEmployee(JSON.parse(JSON.stringify(data.data)));
      setError('');
    } catch (err) {
      setError(err.message);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all shifts
  const fetchShifts = async () => {
    setLoadingShifts(true);
    try {
      const res = await fetch('https://backend.hrms.transev.site/hr/shifts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('hr_token')}`,
        },
      });
      const data = await res.json();
      setShifts(data.data || []);
    } catch (err) {
      console.error('Error fetching shifts:', err.message);
    } finally {
      setLoadingShifts(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
      fetchShifts();
    }
  }, [employeeId]);

  // Handle success message after save
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setTimeout(fetchEmployee, 100);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleEdit = () => navigate(`/employee-details/${employeeId}`);

  const handleAssignShift = async () => {
    if (!selectedShiftId) return;
    try {
      const res = await fetch('https://backend.hrms.transev.site/admin/assign-shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ employeeId, shiftId: selectedShiftId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to assign shift');
      setSuccessMessage('Shift assigned successfully!');
      fetchEmployee();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-yellow-600">View Employee Details</h2>
            {!loading && !error && (
              <button onClick={handleEdit} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                Edit
              </button>
            )}
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

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
                  <Detail label="Personal Email" value={employee.employeeDetails.personalEmail} />
                  <Detail label="Employment Type" value={employee.employeeDetails.employmentType} />
                  <Detail label="Employment Status" value={employee.employeeDetails.employmentStatus} />
                  <Detail label="Date of Joining" value={formatDate(employee.employeeDetails.dateOfJoining)} />
                  <Detail label="Confirmation Date" value={formatDate(employee.employeeDetails.confirmationDate)} />
                  <Detail label="Phone Number" value={employee.employeeDetails.phoneNumber} />
                  <Detail label="Emergency Contact" value={employee.employeeDetails.emergencyContactNumber} />
                  <Detail label="Present Address" value={employee.employeeDetails.presentAddress} />
                  <Detail label="Permanent Address" value={employee.employeeDetails.permanentAddress} />
                  <Detail label="Aadhaar Card Number" value={employee.employeeDetails.aadhaarCardNumber} />
                  <Detail label="PAN Card Number" value={employee.employeeDetails.panCardNumber} />
                  <Detail label="Blood Group" value={employee.employeeDetails.bloodGroup} />
                  <Detail label="Medical Notes" value={employee.employeeDetails.medicalNotes || 'N/A'} />
                  <Detail label="Education" value={employee.employeeDetails.highestEducationalQualification} />
                  <Detail label="Designation" value={employee.employeeDetails.designation} />
                  <Detail label="Department" value={employee.employeeDetails.department} />
                  <Detail label="Bank Name" value={employee.employeeDetails.bankName} />
                  <Detail label="Bank Account Number" value={employee.employeeDetails.bankAccountNumber} />
                  <Detail label="IFSC Code" value={employee.employeeDetails.ifsCode} />

                  {/* Assigned Shift Dropdown */}
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-yellow-700 mb-1">Assigned Shift</p>
                    {loadingShifts ? (
                      <p className="text-yellow-700">Loading shifts...</p>
                    ) : (
                      <div className="space-y-3">
                        <select
                          value={selectedShiftId || employee.employeeDetails.assignedShiftId || ''}
                          onChange={(e) => setSelectedShiftId(e.target.value)}
                          className="w-full border border-yellow-300 rounded-md px-4 py-3 text-yellow-900 text-base focus:outline-none"
                        >
                          <option value="">-- Select Shift --</option>
                          {shifts.map((shift) => (
                            <option key={shift.id} value={shift.id}>
                              {shift.shiftName} ({shift.fullShiftStartingTime} - {shift.fullShiftEndingTime})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleAssignShift}
                          disabled={!selectedShiftId}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
                        >
                          Save Assigned Shift
                        </button>
                      </div>
                    )}
                  </div>
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
    <p className="text-base bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 mt-1">{value}</p>
  </div>
);

// Format date in IST
const formatDate = (str) =>
  str
    ? new Date(str).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) + ' IST'
    : 'N/A';

// Format time strings (e.g. "09:00") into IST with AM/PM
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':');
  const date = new Date();
  date.setHours(+hour);
  date.setMinutes(+minute);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
};

export default ViewEmployeeDetails;
