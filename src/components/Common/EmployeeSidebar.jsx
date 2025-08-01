import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import {
  MdDashboard,
  MdPerson,
  MdCalendarToday,
  MdEventNote,
  MdReportProblem,
} from 'react-icons/md'; // added MdReportProblem icon
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/TransmogriffyLogo.png"; // Adjust path if needed



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
    { label: 'Forgot Password', path: '/SideForgotPassword', icon: <MdEventNote size={18} /> },

    // 👇 New menu item: Raise a Concern
    { label: 'Raise a Concern', path: '/EmployeeRaiseConcern', icon: <MdReportProblem size={18} /> },
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
      localStorage.removeItem('employeeToken');

      if (token) {
        await fetch('https://backend.hrms.transev.site/employee/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
      }

      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/';
    }
  };

  return (
    <div className="w-64 h-screen bg-yellow-50 shadow-xl fixed flex flex-col border-r border-yellow-300">
       <div className="pt-6 pb-4 flex flex-col items-center border-b border-yellow-300 select-none">
        <img
          src={logo}
          alt="Company Logo"
          className="w-24 h-auto"  // bigger logo
        />
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
