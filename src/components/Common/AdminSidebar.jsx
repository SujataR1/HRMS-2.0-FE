import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import {
  MdDashboard,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdReportProblem } from 'react-icons/md';
import logo from "../../assets/TransmogriffyLogo.png"; // Adjust path if needed


const AdminSidebar = () => {
  const [active, setActive] = useState('');
  const [payrollOpen, setPayrollOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

 const menuItems = [
  { name: 'Employee Management' },
  { name: 'Make HR', path: '/PromoteEmployeeToHR' },
  { name: 'HR Profile', path: '/HRDetailsPage' },
  { name: 'Shift Management', path: '/Adminshiftmanagement' },
  { name: 'Assign Shift to Employee', path: '/AdminAllShift' },
  { name: 'Holiday', path: '/AdminHolidayList' },
  { name: 'Leaves', path: '/AdminLeavePage' },
  { name: 'Performance', path: '/AdminPerformance' },
  { name: 'HR Calendar', path: '/AdminHRCalender' },
  { name: 'Training', path: '/AdminTraining' },
  { name: 'Attendance Management', path: '/AttendancePage' },
  { name: 'Employee Concerns', path: '/AdminConcernList', icon: <MdReportProblem size={18} /> }, // ✅ NEW
];


  const employeeSubItems = [
    { name: 'Create New Employee', path: '/CreateEmployee' },
    { name: 'Create Employee Details', path: '/Create-Employee-Details' },
    { name: 'All Employees List', path: '/All-Employees-list' }
  ];

  const payrollSubItems = [
    { name: 'Employee Attendance', path: '/EmployeeAttendance' },
    { name: 'Salary Structure', path: '/SalaryStructure' },
    { name: 'Generate Payslip', path: '/GeneratePayslip' }
  ];

  const attendanceSubItems = [
    { name: 'Attendance', path: '/AdminAttendancePage' }
  ];

  useEffect(() => {
    const empItem = employeeSubItems.find(item => item.path === location.pathname);
    if (empItem) {
      setActive(empItem.name);
      setEmployeeOpen(true);
      setPayrollOpen(false);
      setAttendanceOpen(false);
      return;
    }

    const payrollItem = payrollSubItems.find(item => item.path === location.pathname);
    if (payrollItem) {
      setActive(payrollItem.name);
      setPayrollOpen(true);
      setEmployeeOpen(false);
      setAttendanceOpen(false);
      return;
    }

    const attendanceItem = attendanceSubItems.find(item => item.path === location.pathname);
    if (attendanceItem) {
      setActive(attendanceItem.name);
      setAttendanceOpen(true);
      setEmployeeOpen(false);
      setPayrollOpen(false);
      return;
    }

    const mainItem = menuItems.find(item => item.path === location.pathname);
    if (mainItem) {
      setActive(mainItem.name);
      if (mainItem.name === 'Attendance Management') setAttendanceOpen(true);
      else setAttendanceOpen(false);
      setEmployeeOpen(false);
      setPayrollOpen(false);
      return;
    }

    setActive('');
    setEmployeeOpen(false);
    setPayrollOpen(false);
    setAttendanceOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      localStorage.removeItem('adminToken');

      if (token) {
        await fetch('http://192.168.0.100:9000/admin/logout', {
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
        <li
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            active === 'Dashboard' ? 'bg-yellow-200 shadow-inner' : 'hover:bg-yellow-100 hover:text-yellow-700'
          }`}
          onClick={() => navigate('/AdminDashboard')}
        >
          <MdDashboard size={18} />
          Dashboard
        </li>

        <li
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            active === 'Financial Year' ? 'bg-yellow-200 shadow-inner' : 'hover:bg-yellow-100 hover:text-yellow-700'
          }`}
          onClick={() => navigate('/AdminFinancialYear')}
        >
          Financial Year
        </li>

        {/* Payroll Dropdown */}
        <li
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            payrollOpen ? 'bg-yellow-200 shadow-inner' : 'hover:bg-yellow-100'
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
                  active === item.name ? 'bg-yellow-100 shadow-inner' : 'hover:text-yellow-700'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setActive(item.name);
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}

        {/* Attendance Dropdown */}
        <li
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            attendanceOpen ? 'bg-yellow-200 shadow-inner' : 'hover:bg-yellow-100'
          }`}
          onClick={() => setAttendanceOpen(!attendanceOpen)}
        >
          <span className="flex gap-2 items-center">Attendance Management</span>
          {attendanceOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </li>
        {attendanceOpen && (
          <ul className="ml-6 mt-1 space-y-1">
            {attendanceSubItems.map(item => (
              <li
                key={item.name}
                className={`text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  active === item.name ? 'bg-yellow-100 shadow-inner' : 'hover:text-yellow-700'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setActive(item.name);
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}

        {/* Employee Dropdown */}
        <li
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            employeeOpen ? 'bg-yellow-200 shadow-inner' : 'hover:bg-yellow-100'
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
                  active === item.name ? 'bg-yellow-100 shadow-inner' : 'hover:text-yellow-700'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setActive(item.name);
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}

        {/* Static menu */}
        {menuItems.map(item => {
          if (['Employee Management', 'Attendance Management'].includes(item.name)) return null;
          return (
            <li
              key={item.name}
              className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                active === item.name ? 'bg-yellow-200 shadow-inner' : 'hover:bg-yellow-100 hover:text-yellow-700'
              }`}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                  setActive(item.name);
                }
              }}
            >
              {item.name}
            </li>
          );
        })}

        {/* ✅ Logout Button */}
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

export default AdminSidebar;
