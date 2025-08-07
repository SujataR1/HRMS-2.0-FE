import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HRSidebar from '../../components/Common/HRSidebar';

const HRViewEmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Fetch employee details
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(`https://backend.hrms.transev.site/admin/employee-details/${employeeId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('hr_token')}`, // still using admin token
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

  // Upload handler
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('⚠️ Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadSuccess('');
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('employeeId', employeeId);
      formData.append('file', selectedFile);

      const res = await fetch('https://backend.hrms.transev.site/hr/employee/upload-profile-picture', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hr_token')}`, // use HR token
        },
        body: formData,
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 mb-8">
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

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-yellow-700">{label}</p>
    <p className="text-base bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 mt-1">
      {value || 'N/A'}
    </p>
  </div>
);

const formatDate = (str) =>
  str ? new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

export default HRViewEmployeeDetails;
