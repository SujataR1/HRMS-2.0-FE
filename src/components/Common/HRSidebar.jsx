import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import {
  MdDashboard,
  MdPeople,
  MdAccessTime,
  MdCalendarToday,
  MdEventNote,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

const HRSidebar = () => {
  const [active, setActive] = useState('');
  const [employeeMenuOpen, setEmployeeMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/HRDashboard', icon: <MdDashboard size={18} /> },
    { label: 'Employee Management', icon: <MdPeople size={18} /> },
    { label: 'Attendance', path: '/HRAttendance', icon: <MdAccessTime size={18} /> },
    { label: 'Leave Requests', path: '/HRLeave', icon: <MdCalendarToday size={18} /> },
    { label: 'Shift Management', path: '/HRShiftmanagement', icon: <MdEventNote size={18} /> },
    { label: 'Assign Shift to Employee', path: '/HRShiftsList', icon: <MdEventNote size={18} /> },
    { label: 'Holiday Calendar', path: '/HRHolidayCalendar', icon: <MdCalendarToday size={18} /> },
    { label: 'Performance Review', path: '/PerformanceReview', icon: <MdEventNote size={18} /> },
    { label: 'Training', path: '/HRTraining', icon: <MdEventNote size={18} /> },
  ];

  const employeeSubItems = [
    { name: 'Create New Employee', path: '/HRCreateEmployee' },
    { name: 'Create Employee Details', path: '/HRCreateEmployeeDetails' },
    { name: 'All Employees List', path: '/EmployeeList' },
  ];

  useEffect(() => {
    const current = menuItems.find(item => item.path && location.pathname.startsWith(item.path));
    if (current) setActive(current.label);

    if (employeeSubItems.some(sub => location.pathname.startsWith(sub.path))) {
      setEmployeeMenuOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('hrToken');

      // Remove token before request
      localStorage.removeItem('hrToken');

      if (token) {
        await fetch('http://192.168.0.100:9000/hr/logout', {
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
      <div className="p-6 text-2xl font-bold text-green-500 border-b border-green-200 select-none">
        Transmo<span className="text-orange-400">grify</span> HRMS
      </div>

      <ul className="text-yellow-900 text-sm font-medium flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {menuItems.map(({ label, icon, path }) => {
          if (label === 'Employee Management') {
            return (
              <li
                key={label}
                className="px-4 py-3 rounded-lg cursor-pointer hover:bg-yellow-100 transition-all duration-300 text-yellow-900 select-none"
              >
                <div
                  className="flex justify-between items-center"
                  onClick={() => setEmployeeMenuOpen(!employeeMenuOpen)}
                >
                  <div className="flex items-center gap-3 font-medium">
                    {icon}
                    {label}
                  </div>
                  {employeeMenuOpen ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
                </div>

                {employeeMenuOpen && (
                  <ul className="mt-2 ml-4 border-l border-yellow-200 pl-3 space-y-1">
                    {employeeSubItems.map(({ name, path }) => (
                      <li
                        key={name}
                        onClick={() => navigate(path)}
                        className={`py-2 px-2 rounded-md text-sm cursor-pointer hover:bg-yellow-100 ${
                          location.pathname === path ? 'bg-yellow-200 font-semibold' : ''
                        }`}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }

          return (
            <li
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                active === label
                  ? 'bg-yellow-200 text-yellow-900 shadow-inner'
                  : 'hover:bg-yellow-100 hover:text-yellow-700'
              }`}
              onClick={() => path && navigate(path)}
            >
              {icon}
              {label}
            </li>
          );
        })}

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

export default HRSidebar;
