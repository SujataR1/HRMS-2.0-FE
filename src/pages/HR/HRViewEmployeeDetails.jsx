
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HRSidebar from '../../components/Common/HRSidebar';

const HRViewEmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [shifts, setShifts] = useState([]); // New state to store shifts

  // Fetch employee details
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(
          `https://backend.hrms.transev.site/hr/employee-details?employeeId=${employeeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('hr_token')}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch employee details');
        setEmployee(data.data);
        setFormData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Fetch all shifts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch('https://backend.hrms.transev.site/hr/shifts');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch shifts');
        setShifts(data.data);
      } catch (err) {
        console.error('Error fetching shifts:', err);
      }
    };

    fetchShifts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch('https://backend.hrms.transev.site/hr/update-employee-details', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('hr_token')}`,
        },
        body: JSON.stringify({
          ...formData,
          employeeId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update details');

      setUpdateSuccess('✅ Employee details updated successfully.');
      setEmployee(data.data);
      setEditing(false);
    } catch (err) {
      setUpdateError('❌ ' + err.message);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('⚠️ Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadSuccess('');
    setUploadError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('employeeId', employeeId);
      formDataUpload.append('file', selectedFile);

      const res = await fetch('https://backend.hrms.transev.site/hr/employee/upload-profile-picture', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hr_token')}`,
        },
        body: formDataUpload,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setUploadSuccess('✅ ' + data.message);
    } catch (err) {
      setUploadError('❌ ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (str) =>
    str ? new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  const getShiftNameById = (id) => {
    const shift = shifts.find((s) => s.id === id);
    return shift ? shift.shiftName : id || 'N/A';
  };

  const renderField = (label, name, type = 'text') => (
    <div key={name}>
      <p className="text-sm font-semibold text-yellow-700">{label}</p>
      {editing ? (
        type === 'checkbox' ? (
          <input
            type="checkbox"
            name={name}
            checked={formData[name] || false}
            onChange={handleInputChange}
            className="mt-1"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] ?? ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-4 py-2 border border-yellow-300 rounded"
          />
        )
      ) : (
        <p className="text-base bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 mt-1">
          {name.toLowerCase().includes('date') ? formatDate(formData[name]) : formData[name] || 'N/A'}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <HRSidebar />
      <main className="flex-1 bg-yellow-50 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow border border-gray-200 relative">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">Employee Details</h2>

          {/* Edit Button */}
          {!loading && !error && (
            <button
              onClick={() => setEditing((prev) => !prev)}
              className="absolute top-6 right-6 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          )}

          {loading ? (
            <p className="text-center text-yellow-700">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 mb-8">
                {renderField('Employee ID', 'employeeId')}
                {renderField('Personal Email', 'personalEmail')}
                {renderField('Personal Email Verified', 'isPersonalEmailVerified', 'checkbox')}
                {renderField('Employment Type', 'employmentType')}
                {renderField('Employment Status', 'employmentStatus')}
                {renderField('Date of Joining', 'dateOfJoining', 'date')}
                {renderField('Confirmation Date', 'confirmationDate', 'date')}
                {renderField('Phone Number', 'phoneNumber')}
                {renderField('Emergency Contact Number', 'emergencyContactNumber')}
                {renderField('Present Address', 'presentAddress')}
                {renderField('Permanent Address', 'permanentAddress')}
                {renderField('Aadhaar Card Number', 'aadhaarCardNumber')}
                {renderField('PAN Card Number', 'panCardNumber')}
                {renderField('Blood Group', 'bloodGroup')}
                {renderField('Medical Notes', 'medicalNotes')}
                {renderField('Highest Educational Qualification', 'highestEducationalQualification')}
                {renderField('Designation', 'designation')}
                {renderField('Department', 'department')}
                {renderField('Bank Name', 'bankName')}
                {renderField('Bank Account Number', 'bankAccountNumber')}
                {renderField('IFSC Code', 'ifsCode')}

                {/* Assigned Shift */}
                <div>
                  <p className="text-sm font-semibold text-yellow-700">Assigned Shift</p>
                  {editing ? (
                    <select
                      name="assignedShiftId"
                      value={formData.assignedShiftId || ''}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2 border border-yellow-300 rounded"
                    >
                      <option value="">Select Shift</option>
                      {shifts.map((shift) => (
                        <option key={shift.id} value={shift.id}>
                          {shift.shiftName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-base bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 mt-1">
                      {getShiftNameById(formData.assignedShiftId)}
                    </p>
                  )}
                </div>
              </div>
              {editing && (
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Changes
                </button>
              )}

              {updateSuccess && <p className="text-green-600 mt-4">{updateSuccess}</p>}
              {updateError && <p className="text-red-600 mt-4">{updateError}</p>}

              {/* Upload Section */}
              <div className="mt-10 border-t pt-6">
                <h3 className="text-xl font-semibold text-yellow-700 mb-4">Upload Profile Picture</h3>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="mb-4"
                />

                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>

                {uploadSuccess && <p className="text-green-600 mt-3">{uploadSuccess}</p>}
                {uploadError && <p className="text-red-600 mt-3">{uploadError}</p>}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRViewEmployeeDetails;



// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import HRSidebar from '../../components/Common/HRSidebar';

// const HRViewEmployeeDetails = () => {
//   const { employeeId } = useParams();
//   const [employee, setEmployee] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [error, setError] = useState('');
//   const [updateSuccess, setUpdateSuccess] = useState('');
//   const [updateError, setUpdateError] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState('');
//   const [uploadError, setUploadError] = useState('');
//   const [shifts, setShifts] = useState([]);

//   useEffect(() => {
//     if (!employeeId) return;

//     const fetchEmployee = async () => {
//       try {
//         const res = await fetch(
//           `https://backend.hrms.transev.site/hr/employee-details?employeeId=${employeeId}`,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${localStorage.getItem('hr_token')}`,
//             },
//           }
//         );

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'Failed to fetch employee details');
//         setEmployee(data.data);
//         setFormData(data.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployee();
//   }, [employeeId]);

//   useEffect(() => {
//     const fetchShifts = async () => {
//       try {
//         const res = await fetch('https://backend.hrms.transev.site/hr/shifts');
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'Failed to fetch shifts');
//         setShifts(data.data);
//       } catch (err) {
//         console.error('Error fetching shifts:', err);
//       }
//     };

//     fetchShifts();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await fetch('https://backend.hrms.transev.site/hr/update-employee-details', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('hr_token')}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           employeeId,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to update details');

//       setUpdateSuccess('✅ Employee details updated successfully.');
//       setEmployee(data.data);
//       setEditing(false);
//       setUpdateError('');
//     } catch (err) {
//       setUpdateError('❌ ' + err.message);
//       setUpdateSuccess('');
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert('⚠️ Please select a file to upload.');
//       return;
//     }

//     setUploading(true);
//     setUploadSuccess('');
//     setUploadError('');

//     try {
//       const formDataUpload = new FormData();
//       formDataUpload.append('employeeId', employeeId);
//       formDataUpload.append('file', selectedFile);

//       const res = await fetch('https://backend.hrms.transev.site/hr/employee/upload-profile-picture', {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hr_token')}`,
//         },
//         body: formDataUpload,
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || 'Upload failed');
//       setUploadSuccess('✅ ' + data.message);
//     } catch (err) {
//       setUploadError('❌ ' + err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const formatDate = (str) =>
//     str ? new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

//   const getShiftNameById = (id) => {
//     const shift = shifts.find((s) => s.id === id);
//     return shift ? shift.shiftName : id || 'N/A';
//   };

//   // Field component for consistency
//   const Field = ({ label, name, type = 'text', textarea, checkbox, select, selectOptions }) => (
//     <div>
//       <p className="text-sm font-semibold text-yellow-700 mb-1">{label}</p>
//       {editing ? (
//         checkbox ? (
//           <input
//             type="checkbox"
//             name={name}
//             checked={!!formData[name]}
//             onChange={handleInputChange}
//             className="mt-1"
//           />
//         ) : select ? (
//           <select
//             name={name}
//             value={formData[name] ?? ''}
//             onChange={handleInputChange}
//             className="w-full mt-1 px-4 py-2 border border-yellow-300 rounded"
//           >
//             <option value="">Select</option>
//             {selectOptions.map(({ value, label }) => (
//               <option key={value} value={value}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         ) : textarea ? (
//           <textarea
//             name={name}
//             value={formData[name] ?? ''}
//             onChange={handleInputChange}
//             rows={3}
//             className="w-full mt-1 px-4 py-2 border border-yellow-300 rounded resize-none"
//           />
//         ) : (
//           <input
//             type={type}
//             name={name}
//             value={formData[name] ?? ''}
//             onChange={handleInputChange}
//             className="w-full mt-1 px-4 py-2 border border-yellow-300 rounded"
//           />
//         )
//       ) : (
//         <p className="text-base bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 mt-1">
//           {name.toLowerCase().includes('date')
//             ? formatDate(formData[name])
//             : name === 'assignedShiftId'
//             ? getShiftNameById(formData[name])
//             : formData[name] || 'N/A'}
//         </p>
//       )}
//     </div>
//   );

//   if (loading) return <p className="text-center text-yellow-700 mt-20">Loading...</p>;
//   if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

//   return (
//     <div className="flex min-h-screen bg-gradient-to-tr from-yellow-50 via-yellow-100 to-yellow-50 text-gray-800">
//       <HRSidebar />

//       <main className="flex-grow p-10 max-w-7xl mx-auto">
//         <section className="bg-white rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden border border-yellow-200">
//           {/* Profile Panel */}
//           <aside className="w-full md:w-96 bg-gradient-to-b from-yellow-100 via-yellow-50 to-white p-8 flex flex-col items-center space-y-8 relative">
//             {/* Placeholder profile image */}
//             <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-300 shadow-lg">
//               <img
//                 src={employee.profilePicture || 'https://via.placeholder.com/150'}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Upload profile picture */}
//             <div className="w-full">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setSelectedFile(e.target.files[0])}
//                 className="mb-2"
//               />
//               <button
//                 onClick={handleUpload}
//                 disabled={uploading}
//                 className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition disabled:opacity-50"
//               >
//                 {uploading ? 'Uploading...' : 'Upload Picture'}
//               </button>

//               {uploadSuccess && <p className="text-green-600 mt-2">{uploadSuccess}</p>}
//               {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
//             </div>
//           </aside>

//           {/* Employee Details */}
//           <section className="flex-grow p-10 space-y-8 overflow-y-auto max-h-[90vh]">
//             {/* Header */}
//             <header className="flex justify-between items-center border-b border-yellow-300 pb-4">
//               <h3 className="text-4xl font-extrabold tracking-wide text-yellow-700">Employee Details</h3>
//               <button
//                 onClick={() => {
//                   setEditing((e) => !e);
//                   setUpdateSuccess('');
//                   setUpdateError('');
//                   setFormData(employee);
//                 }}
//                 className="rounded-full px-5 py-2 font-semibold transition-colors border border-yellow-500 hover:bg-yellow-500 hover:text-white focus:outline-none"
//               >
//                 {editing ? 'Cancel' : 'Edit'}
//               </button>
//             </header>

//             {/* Personal Information */}
//             <div>
//               <h4 className="text-2xl font-bold text-yellow-600 mb-4">Personal Information</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field label="Employee ID" name="employeeId" />
//                 <Field label="Personal Email" name="personalEmail" />
//                 <Field label="Personal Email Verified" name="isPersonalEmailVerified" type="checkbox" checkbox />
//                 <Field label="Phone Number" name="phoneNumber" />
//                 <Field label="Emergency Contact Number" name="emergencyContactNumber" />
//                 <Field label="Present Address" name="presentAddress" textarea />
//                 <Field label="Permanent Address" name="permanentAddress" textarea />
//                 <Field label="Blood Group" name="bloodGroup" />
//                 <Field label="Medical Notes" name="medicalNotes" />
//               </div>
//             </div>

//             {/* Employment Details */}
//             <div>
//               <h4 className="text-2xl font-bold text-yellow-600 mb-4">Employment Details</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field label="Employment Type" name="employmentType" />
//                 <Field label="Employment Status" name="employmentStatus" />
//                 <Field label="Date of Joining" name="dateOfJoining" />
//                 <Field label="Confirmation Date" name="confirmationDate" />
//                 <Field label="Designation" name="designation" />
//                 <Field label="Department" name="department" />
//                 <Field
//                   label="Assigned Shift"
//                   name="assignedShiftId"
//                   select
//                   selectOptions={shifts.map((s) => ({ value: s.id, label: s.shiftName }))}
//                 />
//               </div>
//             </div>

//             {/* Education */}
//             <div>
//               <h4 className="text-2xl font-bold text-yellow-600 mb-4">Education</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field label="Highest Educational Qualification" name="highestEducationalQualification" />
//               </div>
//             </div>

//             {/* Bank Details */}
//             <div>
//               <h4 className="text-2xl font-bold text-yellow-600 mb-4">Bank Details</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field label="Bank Name" name="bankName" />
//                 <Field label="Bank Account Number" name="bankAccountNumber" />
//                 <Field label="IFSC Code" name="ifsCode" />
//               </div>
//             </div>

//             {/* Save Button & Messages */}
//             {editing && (
//               <button
//                 onClick={handleUpdate}
//                 className="mt-8 px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-full shadow-lg transition-colors"
//               >
//                 Save Changes
//               </button>
//             )}

//             {updateSuccess && <p className="mt-6 text-center font-semibold text-green-600">{updateSuccess}</p>}
//             {updateError && <p className="mt-6 text-center font-semibold text-red-600">{updateError}</p>}
//           </section>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default HRViewEmployeeDetails;
