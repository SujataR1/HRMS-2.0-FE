import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const [active, setActive] = useState('');
  const [payrollOpen, setPayrollOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    'Dashboard',
    'Financial Year',
    'MIS',
    'Employee Management',
    'Company Master',
    'HR',
    'Shift',
    'Holiday',
    'Leaves',
    'Performance',
    'HR Calendar',
    'Training'
  ];

  const employeeSubItems = [
    { name: 'Create New Employee', path: '/CreateEmployee' },
    { name: 'All Employees List', path: '/All-Employees-list' },
    //{ name: 'View Employee Details', path: '/View-Employee-Details/:employeeId' },
    //{ name: 'Update Employee Details', path: '/employee-details/:employeeIdt' },
    { name: 'Assign Shift to Employee', path: '/Assign-Shift-to-Employee' },
    //{ name: 'Manage Employee Details', path: '/Manage-Employee-Details-Page' },
    { name: 'Create Employee Details', path: '/Create-Employee-Details' }
    
  ];

  useEffect(() => {
    // Check if current path matches employee submenu
    const empItem = employeeSubItems.find(item => item.path === location.pathname);

    if (empItem) {
      setActive(empItem.name);
      setEmployeeOpen(true);
      return;
    }

    // TODO: Add payroll submenu path check if you add payroll submenu routes here

    // Check main menu paths
    switch(location.pathname) {
      case '/AdminDashboard':
        setActive('Dashboard');
        setEmployeeOpen(false);
        break;
      case '/financial-year':
        setActive('Financial Year');
        setEmployeeOpen(false);
        break;
      // Add other main menu routes here as needed
      default:
        setActive('');  // Clear active if no match or keep last active if you prefer
        setEmployeeOpen(false);
        break;
    }
  }, [location.pathname]);

  return (
    <div className="w-64 h-screen bg-yellow-50 shadow-xl fixed flex flex-col border-r border-yellow-300">
      <div className="p-6 text-2xl font-bold text-green-500 border-b border-green-200 select-none">
  Transmo<span className="text-orange-400">grify</span> HRMS
</div>

      <ul className="text-yellow-900 text-sm font-medium flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {/* Dashboard */}
        <li
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            active === 'Dashboard'
              ? 'bg-yellow-200 text-yellow-900 shadow-inner'
              : 'hover:bg-yellow-100 hover:text-yellow-700'
          }`}
          onClick={() => navigate('/AdminDashboard')}
        >
          <MdDashboard size={18} />
          Dashboard
        </li>

        {/* Financial Year */}
        <li
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            active === 'Financial Year'
              ? 'bg-yellow-200 text-yellow-900 shadow-inner'
              : 'hover:bg-yellow-100 hover:text-yellow-700'
          }`}
          onClick={() => navigate('/financial-year')}
        >
          Financial Year
        </li>

        {/* Payroll Master */}
        <li
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            payrollOpen ? 'bg-yellow-200 text-yellow-900 shadow-inner' : 'hover:bg-yellow-100'
          }`}
          onClick={() => setPayrollOpen(!payrollOpen)}
        >
          <span className="flex gap-2 items-center">Payroll Master</span>
          {payrollOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </li>
        {payrollOpen && (
          <ul className="ml-6 mt-1 space-y-1">
            {/* Add payroll submenu items here */}
          </ul>
        )}

        {/* Employee Management */}
        <li
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            employeeOpen ? 'bg-yellow-200 text-yellow-900 shadow-inner' : 'hover:bg-yellow-100'
          }`}
          onClick={() => setEmployeeOpen(!employeeOpen)}
        >
          <span className="flex gap-2 items-center">Employee Management</span>
          {employeeOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </li>
        {employeeOpen && (
          <ul className="ml-6 mt-1 space-y-1">
            {employeeSubItems.map(item => (
              <li
                key={item.name}
                className={`text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  active === item.name
                    ? 'bg-yellow-100 text-yellow-900 shadow-inner'
                    : 'hover:text-yellow-700'
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}

        {/* Other menu items */}
        {menuItems.slice(4).map(
          item =>
            item !== 'Employee Management' && (
              <li
                key={item}
                className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  active === item
                    ? 'bg-yellow-200 text-yellow-900 shadow-inner'
                    : 'hover:bg-yellow-100 hover:text-yellow-700'
                }`}
                onClick={() => navigate(`/${item.replace(/\s+/g, '-')}`)} // Optional: generate path dynamically or hardcode
              >
                {item}
              </li>
            )
        )}

        {/* Logout */}
        <li className="px-4 py-3 text-red-600 hover:bg-red-100 flex items-center gap-3 mt-6 rounded-lg cursor-pointer transition-all duration-300">
          <FaSignOutAlt size={16} />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
