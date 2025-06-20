import React from 'react';
import AdminSidebar from '../components/Common/AdminSidebar';

const ManageEmployeeDetailsPage = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-xl w-full bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Manage Employee Details</h2>
          {/* Editable sections of employee profile */}
          <p>This page will manage additional details like address, emergency contact, etc.</p>
        </div>
      </main>
    </div>
  );
};

export default ManageEmployeeDetailsPage;

