import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';
import {
  MdHome,
  MdAccountCircle,
  MdAccessTime,
  MdNote,
  MdBeachAccess,
  MdSettings,
  MdSchool,
  MdLock,
  MdFeedback,
} from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/TransmogriffyLogo.png";

const EmployeeSidebar = () => {
  const [active, setActive] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/EmployeeDashboard', icon: <MdHome size={18} /> },
    { label: 'My Profile', path: '/MyProfile', icon: <MdAccountCircle size={18} /> },
    { label: 'My Attendance', path: '/MyAttendance', icon: <MdAccessTime size={18} /> },
    { label: 'My Leaves', path: '/MyLeaves', icon: <MdNote size={18} /> },
    { label: 'My Holidays', path: '/MyHoliday', icon: <MdBeachAccess size={18} /> },
    { label: 'Shift Details', path: '/EmployeeShiftDetails', icon: <MdSettings size={18} /> },
    { label: 'My Training', path: '/EmployeeTraining', icon: <MdSchool size={18} /> },
    { label: 'Change Password', path: '/SideForgotPassword', icon: <MdLock size={18} /> },
    { label: 'Raise a Concern', path: '/EmployeeRaiseConcern', icon: <MdFeedback size={18} /> },
];


  useEffect(() => {
    const current = menuItems.find(item => location.pathname.startsWith(item.path));
    setActive(current ? current.label : '');
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
    <>
      {/* Hamburger Toggle for Mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-yellow-500 text-white rounded-md md:hidden shadow-lg"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars size={20} />
      </button>

      {/* Overlay when sidebar is open on mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-yellow-50 z-50 shadow-xl transition-transform duration-300
          transform md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="pt-6 pb-4 flex flex-col items-center border-b border-yellow-300 select-none">
          <img src={logo} alt="Company Logo" className="w-24 h-auto" />
        </div>

        {/* Menu */}
        <ul className="text-yellow-900 text-sm font-medium px-2 py-4 space-y-1">
          {menuItems.map(({ label, icon, path }) => (
            <li
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                active === label
                  ? 'bg-yellow-200 text-yellow-900 shadow-inner'
                  : 'hover:bg-yellow-100 hover:text-yellow-700'
              }`}
              onClick={() => {
                navigate(path);
                setIsSidebarOpen(false); // Close sidebar on mobile after click
              }}
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
    </>
  );
};

export default EmployeeSidebar;
