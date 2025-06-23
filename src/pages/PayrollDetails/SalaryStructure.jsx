import React from 'react';
import AdminSidebar from '../../components/Common/AdminSidebar';

const SalaryStructure = () => {
  const structures = [
    {
      id: 1,
      title: 'Software Engineer Level 1',
      description: 'Basic: ₹30,000, HRA: ₹15,000, Bonus: ₹5,000',
    },
    {
      id: 2,
      title: 'Senior Developer',
      description: 'Basic: ₹50,000, HRA: ₹20,000, Bonus: ₹10,000',
    },
    {
      id: 3,
      title: 'Team Lead',
      description: 'Basic: ₹70,000, HRA: ₹30,000, Bonus: ₹15,000',
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="ml-64 w-full min-h-screen flex items-center justify-center bg-yellow-50 p-6">
        <div className="max-w-2xl w-full bg-white border border-yellow-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-700">
            Salary Structure
          </h2>

          {structures.length > 0 ? (
            <ul className="space-y-4">
              {structures.map((s) => (
                <li
                  key={s.id}
                  className="border border-yellow-300 bg-yellow-100 p-4 rounded shadow-sm"
                >
                  <h3 className="font-semibold text-lg text-yellow-800">
                    {s.title}
                  </h3>
                  <p className="text-yellow-700">{s.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-600 text-center">
              No salary structures available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryStructure;
