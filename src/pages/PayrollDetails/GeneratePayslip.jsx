import React, { useState } from 'react';
import AdminSidebar from '../../components/Common/AdminSidebar';

const dummyEmployees = [
  { id: 'emp1', name: 'John Doe' },
  { id: 'emp2', name: 'Jane Smith' },
  { id: 'emp3', name: 'Alice Johnson' },
];

const GeneratePayslip = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [payslipFile, setPayslipFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createPayslip = () => {
    if (!selectedEmployee) return alert('Please select an employee');
    if (!month || !year) return alert('Please select month and year');

    setLoading(true);
    setMessage('');
    setTimeout(() => {
      setLoading(false);
      setMessage(`Payslip generated for ${selectedEmployee} for ${month}/${year}`);
    }, 1200);
  };

  const uploadPayslip = () => {
    if (!payslipFile) return alert('Please select a file to upload');
    if (!selectedEmployee) return alert('Please select an employee');
    if (!month || !year) return alert('Please select month and year');

    setLoading(true);
    setMessage('');
    setTimeout(() => {
      setLoading(false);
      setMessage(`Payslip file "${payslipFile.name}" uploaded for ${selectedEmployee} for ${month}/${year}`);
      setPayslipFile(null);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-64 w-full flex justify-center items-start bg-yellow-50 p-6" style={{ paddingTop: '80px' }}>
        <div className="max-w-md w-full bg-white border border-yellow-300 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-yellow-900">Generate Payslip</h2>

          <label className="block mb-4">
            <span className="text-yellow-800 font-semibold mb-1 block">Select Employee</span>
            <select
              className="w-full border border-yellow-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">-- Select Employee --</option>
              {dummyEmployees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            <span className="text-yellow-800 font-semibold mb-1 block">Select Month & Year</span>
            <input
              type="month"
              value={year && month ? `${year}-${month}` : ''}
              onChange={e => {
                const [y, m] = e.target.value.split('-');
                setYear(y);
                setMonth(m);
              }}
              className="w-full border border-yellow-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          <div className="flex gap-4 mb-6">
            <button
              onClick={createPayslip}
              disabled={loading}
              className={`flex-1 ${
                loading ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'
              } text-yellow-900 font-semibold py-2 rounded transition`}
            >
              {loading ? 'Processing...' : 'Generate Payslip'}
            </button>
          </div>

          <label className="block mb-4">
            <span className="text-yellow-800 font-semibold mb-1 block">Upload Payslip File</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPayslipFile(e.target.files[0])}
              className="w-full"
            />
          </label>

          <div className="flex gap-4">
            <button
              onClick={uploadPayslip}
              disabled={loading || !payslipFile}
              className={`flex-1 ${
                loading ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'
              } text-yellow-900 font-semibold py-2 rounded transition`}
            >
              {loading ? 'Uploading...' : 'Upload Payslip'}
            </button>
          </div>
          {message && (
            <p className="mt-6 text-yellow-900 font-medium bg-yellow-100 border border-yellow-300 rounded px-4 py-2">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePayslip;
