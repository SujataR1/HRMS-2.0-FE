import React, { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

const AdminSidebar = () => {
  const [active, setActive] = useState('Dashboard');
  const [payrollOpen, setPayrollOpen] = useState(false);

  const menuItems = [
    'Dashboard',
    'Financial Year',
    'MIS',
    'Employee Master',
    'Company Master',
    'HR',
    'Shift',
    'Holiday',
    'Leaves',
    'Performance',
    'HR Calendar',
    'Training'
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-xl fixed flex flex-col border-r border-gray-200">
     <div className="p-6 text-2xl font-bold text-orange-500 border-b border-gray-100">
  Transmo<span className="text-green-400">grify</span> HRMS
</div>


      <ul className="text-gray-800 text-sm font-medium flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <li
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
            active === 'Dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
          }`}
          onClick={() => setActive('Dashboard')}
        >
          <MdDashboard size={18} />
          Dashboard
        </li>

        <li
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
            active === 'Financial Year' ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
          }`}
          onClick={() => setActive('Financial Year')}
        >
          Financial Year
        </li>

        <li
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
            payrollOpen ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
          }`}
          onClick={() => setPayrollOpen(!payrollOpen)}
        >
          <span className="flex gap-2 items-center">Payroll Master</span>
          {payrollOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </li>
        {payrollOpen && (
          <ul className="ml-6 mt-1 space-y-1">
            {[
              'All Employees',
              'Payslip',
              'Configuration',
              'Bonus Setting',
              'Payroll Reporting',
              'Full & Final',
            ].map((item) => (
              <li
                key={item}
                className={`text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  active === item ? 'bg-blue-50 text-blue-700' : 'hover:text-blue-600'
                }`}
                onClick={() => setActive(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        {menuItems.slice(2).map((item) => (
          <li
            key={item}
            className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
              active === item ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
            }`}
            onClick={() => setActive(item)}
          >
            {item}
          </li>
        ))}

        <li className="px-4 py-3 text-red-600 hover:bg-red-100 flex items-center gap-3 mt-6 rounded-lg cursor-pointer transition-all duration-200">
          <FaSignOutAlt size={16} />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;