import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import {
  MdDashboard,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const [active, setActive] = useState('');
  const [payrollOpen, setPayrollOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [

    { name: 'Employee Management' }, // handled separately with submenu
    { name: 'Make HR', path: '/PromoteEmployeeToHR' },
    { name: 'HR Profile', path: '/HRDetailsPage' },
    { name: 'Shift Management', path: '/Adminshiftmanagement' },
    { name: 'Assign Shift to Employee', path: '/AdminAllShift' },
    { name: 'Holiday', path: '/AdminHolidayList' },
    { name: 'Leaves', path: '/AdminLeavePage' },
    { name: 'Performance', path: '/AdminPerformance' },
    { name: 'HR Calendar', path: '/AdminHRCalender' },
    { name: 'Training', path: '/AdminTraining' },
  ];

  const employeeSubItems = [
    { name: 'Create New Employee', path: '/CreateEmployee' },
    { name: 'Create Employee Details', path: '/Create-Employee-Details' },
    { name: 'All Employees List', path: '/All-Employees-list' }
    //{ name: 'Assign Shift to Employee', path: '/Assign-Shift-to-Employee' },

  ];

  const payrollSubItems = [
    { name: 'Employee Attendance', path: '/EmployeeAttendance' },
    { name: 'Salary Structure', path: '/SalaryStructure' },
    { name: 'Generate Payslip', path: '/GeneratePayslip' }
  ];

  useEffect(() => {
    // Check if current path matches any employee submenu
    const empItem = employeeSubItems.find(item => item.path === location.pathname);
    if (empItem) {
      setActive(empItem.name);
      setEmployeeOpen(true);
      setPayrollOpen(false);
      return;
    }

    // Check payroll submenu
    const payrollItem = payrollSubItems.find(item => item.path === location.pathname);
    if (payrollItem) {
      setActive(payrollItem.name);
      setPayrollOpen(true);
      setEmployeeOpen(false);
      return;
    }

    // Check main menu items
    const mainItem = menuItems.find(item => item.path === location.pathname);
    if (mainItem) {
      setActive(mainItem.name);
    } else {
      setActive('');
    }

    // Close submenus if no match
    setEmployeeOpen(false);
    setPayrollOpen(false);
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
          onClick={() => navigate('/AdminFinancialYear')}
        >
          Financial Year
        </li>

        {/* Payroll Details Dropdown */}
        <li
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            payrollOpen ? 'bg-yellow-200 text-yellow-900 shadow-inner' : 'hover:bg-yellow-100'
          }`}
          onClick={() => setPayrollOpen(!payrollOpen)}
        >
          <span className="flex gap-2 items-center">Payroll Details</span>
          {payrollOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </li>
        {payrollOpen && (
          <ul className="ml-6 mt-1 space-y-1">
            {payrollSubItems.map(item => (
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

        {/* Employee Management Dropdown */}
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

        {/* Other static menu items */}
        {menuItems.map(item => {
          if (item.name === 'Employee Management') return null; // handled above

          return (
            <li
              key={item.name}
              className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                active === item.name
                  ? 'bg-yellow-200 text-yellow-900 shadow-inner'
                  : 'hover:bg-yellow-100 hover:text-yellow-700'
              }`}
              onClick={() => item.path && navigate(item.path)}
            >
              {item.name}
            </li>
          );
        })}

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
