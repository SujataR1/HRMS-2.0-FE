import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/Common/AdminSidebar';

const UpdateEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://backend.hrms.transev.site/admin/employee-details/${employeeId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const emp = data.data.employeeDetails;
        setForm({
          employeeId: data.data.employeeId,
          updates: { ...emp },
        });
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      updates: {
        ...prev.updates,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('https://backend.hrms.transev.site/admin/update-employee-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');

      // Navigate to ViewEmployeeDetails with success message after update
      navigate(`/view-employee-details/${employeeId}`, {
        state: { successMessage: 'Employee updated successfully!' },
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow border border-gray-200">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">Update Employee Info</h2>

          {loading ? (
            <p className="text-center text-yellow-600">Loading...</p>
          ) : message ? (
            <div
              className={`text-center mb-4 px-4 py-2 rounded ${
                message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {message.text}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(form.updates).map(([key, value]) => {
                  if (key === 'id') return null; // skip rendering this field
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type={key.toLowerCase().includes('date') ? 'date' : 'text'}
                        name={key}
                        value={value || ''}
                        onChange={key === 'employeeId' ? undefined : handleChange}
                        readOnly={key === 'employeeId'}
                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500 ${
                          key === 'employeeId' ? 'bg-gray-100 cursor-not-allowed border-gray-300' : 'border-yellow-300'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-semibold"
                >
                  {submitting ? 'Updating...' : 'Update Employee'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default UpdateEmployee;
