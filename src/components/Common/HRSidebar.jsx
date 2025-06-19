import React, { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard, MdPeople, MdAccessTime, MdCalendarToday } from 'react-icons/md';

const HRSidebar = () => {
  const [active, setActive] = useState('Dashboard');

  const menuItems = [
    'Dashboard',
    'Attendance',
    'Leave Requests',
    'Employee List',
    'Shift Management',
    'Holiday Calendar',
    'Performance Review'
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-xl fixed flex flex-col border-r border-gray-200">
      <div className="p-6 text-2xl font-bold text-orange-500 border-b border-gray-100">
        Transmo<span className="text-green-400">grify</span> HRMS
      </div>

      <ul className="text-gray-800 text-sm font-medium flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <li
            key={item}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
              active === item ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
            }`}
            onClick={() => setActive(item)}
          >
            {item === 'Dashboard' && <MdDashboard size={18} />}
            {item === 'Attendance' && <MdAccessTime size={18} />}
            {item === 'Leave Requests' && <MdCalendarToday size={18} />}
            {item === 'Employee List' && <MdPeople size={18} />}
            {item}
          </li>
        ))}

        <li
          className="px-4 py-3 text-red-600 hover:bg-red-100 flex items-center gap-3 mt-6 rounded-lg cursor-pointer transition-all duration-200"
          onClick={async () => {
            try {
              const token = localStorage.getItem('hrToken');
              if (!token) {
                alert('Session expired. Please log in again.');
                window.location.href = '/hr/login';
                return;
              }

              const res = await fetch('http://localhost:9000/hr/logout', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
              });

              const data = await res.json();

              if (data.status === 'success') {
                localStorage.removeItem('hrToken');
                window.location.href = '/hr/login';
              } else {
                alert('Logout failed: ' + (data.message || 'Unknown error'));
              }
            } catch (err) {
              console.error('Logout error:', err);
              alert('Something went wrong. Please try again.');
            }
          }}
        >
          <FaSignOutAlt size={16} />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default HRSidebar;
