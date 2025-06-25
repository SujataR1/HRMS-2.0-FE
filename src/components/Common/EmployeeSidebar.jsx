import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import {
  MdDashboard,
  MdPerson,
  MdCalendarToday,
  MdEventNote,
} from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

const EmployeeSidebar = () => {
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/EmployeeDashboard', icon: <MdDashboard size={18} /> },
    { label: 'My Profile', path: '/MyProfile', icon: <MdPerson size={18} /> },
    { label: 'My Attendance', path: '/MyAttendance', icon: <MdCalendarToday size={18} /> },
    { label: 'My Leaves', path: '/MyLeaves', icon: <MdEventNote size={18} /> },
    { label: 'Shift Details', path: '/EmployeeShiftDetails', icon: <MdEventNote size={18} /> },
    { label: 'My Training', path: '/EmployeeTraining', icon: <MdEventNote size={18} /> },
  ];

  useEffect(() => {
    const current = menuItems.find(item => location.pathname.startsWith(item.path));
    if (current) {
      setActive(current.label);
    } else {
      setActive('');
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('employeeToken');

      // Remove token before making any API call
      localStorage.removeItem('employeeToken');

      // If token existed, call logout API (optional)
      if (token) {
        await fetch('http://192.168.0.100:9000/employee/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
      }

      // Redirect to root (login/home)
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/';
    }
  };

  return (
    <div className="w-64 h-screen bg-yellow-50 shadow-xl fixed flex flex-col border-r border-yellow-300">
      <div className="p-6 text-2xl font-bold text-green-500 border-b border-green-200 select-none">
        Transmo<span className="text-orange-400">grify</span> HRMS
      </div>

      <ul className="text-yellow-900 text-sm font-medium flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {menuItems.map(({ label, icon, path }) => (
          <li
            key={label}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
              active === label
                ? 'bg-yellow-200 text-yellow-900 shadow-inner'
                : 'hover:bg-yellow-100 hover:text-yellow-700'
            }`}
            onClick={() => navigate(path)}
          >
            {icon}
            {label}
          </li>
        ))}

        {/* Logout */}
        <li
          className="px-4 py-3 text-red-600 hover:bg-red-100 flex items-center gap-3 mt-6 rounded-lg cursor-pointer transition-all duration-300"
          onClick={handleLogout}
        >
          <FaSignOutAlt size={16} />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default EmployeeSidebar;
