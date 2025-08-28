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
  const [shifts, setShifts] = useState([]);

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

  // Enum options for dropdowns
  const enumOptions = {
    employmentType: [
      'PART_TIME',
      'FULL_TIME',
      'INTERN',
      'CONTRACT',
      'FREELANCER',
    ],
    employmentStatus: [
      'EMPLOYED',
      'RESIGNED',
      'TERMINATED',
      'SUSPENDED',
      'PROBATION',
    ],
    bloodGroup: [
      'A_positive',
      'A_negative',
      'B_positive',
      'B_negative',
      'AB_positive',
      'AB_negative',
      'O_positive',
      'O_negative',
    ],
  };

  const renderField = (label, name, type = 'text') => {
    const isEnum = Object.keys(enumOptions).includes(name);

    const formatEnumValue = (value) => {
      if (!value) return 'N/A';
      if (name === 'bloodGroup') {
        return value
          .replace('_positive', '+')
          .replace('_negative', '-')
          .replace(/_/g, ' ');
      }
      return value.replace(/_/g, ' ').toUpperCase();
    };

    return (
      <div key={name}>
        <p className="text-sm font-semibold text-yellow-700">{label}</p>
        {editing ? (
          isEnum ? (
            <select
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              className="w-full mt-1 px-4 py-2 border border-yellow-300 rounded"
            >
              <option value="">Select {label}</option>
              {enumOptions[name].map((option) => (
                <option key={option} value={option}>
                  {formatEnumValue(option)}
                </option>
              ))}
            </select>
          ) : type === 'checkbox' ? (
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
            {name.toLowerCase().includes('date')
              ? formatDate(formData[name])
              : isEnum
              ? formatEnumValue(formData[name])
              : formData[name] || 'N/A'}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <HRSidebar />
      <main className="flex-1 bg-yellow-50 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow border border-gray-200 relative">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">Employee Details</h2>

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
