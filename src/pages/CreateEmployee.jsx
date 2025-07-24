import React, { useState } from 'react';
import AdminSidebar from '../components/Common/AdminSidebar';

const CreateEmployee = () => {
  const [form, setForm] = useState({
    name: '',
    employeeId: '',
    assignedEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { name, employeeId, assignedEmail } = form;
  if (!name || !employeeId || !assignedEmail) {
    setMessage({ type: 'error', text: 'All fields are required.' });
    return;
  }

  setLoading(true);
  setMessage(null);

  try {
    const token = localStorage.getItem('token'); // or wherever you store your token

    const res = await fetch('https://backend.hrms.transev.site/admin/create-employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,   // <-- add this header
      },
      body: JSON.stringify({ name, employeeId, assignedEmail }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Error creating employee');

    setMessage({ type: 'success', text: data.message });
    setForm({ name: '', employeeId: '', assignedEmail: '' });
  } catch (err) {
    setMessage({ type: 'error', text: err.message });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <AdminSidebar />
      <main className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-10 border border-yellow-200">
          <h2 className="text-3xl font-bold text-yellow-600 text-center mb-6">Create New Employee</h2>

          {message && (
            <div className={`mb-4 p-3 rounded text-center ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full border border-yellow-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                placeholder="e.g. 10450"
                className="w-full border border-yellow-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="assignedEmail"
                value={form.assignedEmail}
                onChange={handleChange}
                placeholder="example@outlook.com"
                className="w-full border border-yellow-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEmployee;
