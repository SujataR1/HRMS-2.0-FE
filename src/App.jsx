import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminSidebar from './components/Common/AdminSidebar';
import AdminDashboard from './dashboards/AdminDashboard';
import HRSidebar from './components/Common/HRSidebar';  {/* HRSidebar already imported */}
import HRDashboard from './dashboards/HRDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import CreateEmployee from './pages/CreateEmployee';
import AllEmployees from './pages/AllEmployees';
import ViewEmployeeDetails from './pages/ViewEmployeeDetails';
import UpdateEmployee from './pages/UpdateEmployee';
import AssignShift from './pages/AssignShift';
import ManageEmployeeDetails from './pages/ManageEmployeeDetailsPage';
import ContentWrapper from './components/Common/ContentWrapper';
import CreateEmployeeDetails from './pages/CreateEmployeeDetails.JSX';
import EmployeeAttendance from './pages/PayrollDetails/EmployeeAttendance';
import SalaryStructure from './pages/PayrollDetails/SalaryStructure';
import GeneratePayslip from './pages/PayrollDetails/GeneratePayslip';
import PromoteEmployeeToHR from './pages/PromoteEmployeeToHR';
import HRShiftmanagement from './pages/HrShiftmanagement/HRShiftmanagement';
import HRShiftsList from './pages/HrShiftmanagement/HRShiftsList';
import EmployeeShiftDetails from './pages/Employee/EmployeeShiftDetails';
import MyAttendance from './pages/Employee/MyAttendance';
import MyProfile from './pages/Employee/MyProfile';
import MyLeaves from './pages/Employee/MyLeaves';
import EmployeeList from './pages/HR/EmployeeList.jsX';
import HRViewEmployeeDetails from './pages/HR/HRViewEmployeeDetails';
import HRAllEmployeeslist from './pages/HR/HRAllEmployeeslist';
import HRCreateEmployeeDetails from './pages/HR/HRCreateEmployeeDetails';
import HRCreateEmployee from './pages/HR/HRCreateEmployee';
import HRAssignShifttoEmployee from './pages/HR/HRAssignShifttoEmployee';
import HRHolidayCalendar from './pages/HR/HRHolidayCalendar';
import PerformanceReview from './pages/HR/PerformanceReview';
import HRLeave from './pages/HR/HRLeave';
import HRAttendance from './pages/HR/HRAttendance';
import AdminFinancialYear from './pages/Admin/AdminFinancialYear';
import HRDetailsPage from './pages/Admin/HRDetailsPage';
import AdminShiftmanagement from './pages/Admin/AdminShiftManagement';
import AdminAllShift from './pages/Admin/AdminAllShift';
import AdminHolidayList from './pages/Admin/AdminHolidayList';
import AdminLeavePage from './pages/Admin/AdminLeave';
import AdminPerformance from './pages/Admin/AdminPerformance';
import AdminHRCalender from './pages/Admin/AdminHRCalender';
import AdminTraining from './pages/Admin/AdminTraining';
import HRTraining from './pages/HR/HRTraining';
import EmployeeTraining from './pages/Employee/EmployeeTraining';
import AttendancePage from './pages/Admin/AttendancePage';
import ForgotPasswordEmployee from './pages/Employee/ForgotPasswordEmployee';
import ForgotPasswordAdmin from './pages/Admin/ForgotPasswordAdmin';
import ForgotPasswordHR from './pages/HR/ForgotPasswordHR';
import EmployeeRaiseConcern from './pages/Employee/EmployeeRaiseConcern';
import HRConcernList from './pages/HR/HRConcernList';
import AdminConcernList from './pages/Admin/AdminConcernList';
import HrProfile from './pages/HR/HrProfile';
import HRAttendanceReportGenerate from './pages/HR/HRAttendanceReportGenerate';
import AdminProfile from './pages/Admin/Profile';
import HRLeaveApprovals from './pages/HR/HRLeaveApprovals';
import SideForgotPassword from './pages/Employee/SideForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdminSidebar" element={<AdminSidebar />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/HRSidebar" element={<HRSidebar />} />
        <Route path="/HRDashboard" element={<HRDashboard />} />
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />

        {/* Employee Management Part */}
        <Route path="/CreateEmployee" element={<CreateEmployee />} />
        <Route path="/All-Employees-list" element={<AllEmployees />} />
        <Route path="/View-Employee-Details/:employeeId" element={<ViewEmployeeDetails />} />
        <Route path="/employee-details/:employeeId" element={<UpdateEmployee />} />
        <Route path="/Assign-Shift-to-Employee" element={<AssignShift />} />
        <Route path="/Manage-Employee-Details-Page" element={<ManageEmployeeDetails />} />
        <Route path="/Content-Wrapper" element={<ContentWrapper />} />
        <Route path="/Create-Employee-Details" element={<CreateEmployeeDetails />} />

        {/* Payroll Details Route */}
        <Route path="/EmployeeAttendance" element={<EmployeeAttendance />} />
        <Route path="/SalaryStructure" element={<SalaryStructure />} />
        <Route path="/GeneratePayslip" element={<GeneratePayslip />} />
        <Route path="/PromoteEmployeeToHR" element={<PromoteEmployeeToHR />} />
        <Route path="/HRShiftmanagement" element={<HRShiftmanagement />} />
        <Route path="/HRShiftsList" element={<HRShiftsList />} />
        <Route path="/EmployeeShiftDetails" element={<EmployeeShiftDetails />} />
        <Route path="/MyAttendance" element={<MyAttendance />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/MyLeaves" element={<MyLeaves />} />
        <Route path="/EmployeeList" element={<EmployeeList />} />
        <Route path="/HRViewEmployeeDetails/:employeeId" element={<HRViewEmployeeDetails />} />
        <Route path="/HRAllEmployeeslist" element={<HRAllEmployeeslist />} />
        <Route path="/HRCreateEmployeeDetails" element={<HRCreateEmployeeDetails />} />
        <Route path="/HRCreateEmployee" element={<HRCreateEmployee />} />
        <Route path="/HRAssignShifttoEmployee" element={<HRAssignShifttoEmployee />} />
        <Route path="/HRHolidayCalendar" element={<HRHolidayCalendar />} />
        <Route path="/PerformanceReview" element={<PerformanceReview />} />
        <Route path="/HRLeave" element={<HRLeave />} />
        <Route path="/HRAttendance" element={<HRAttendance />} />
        <Route path="/AdminFinancialYear" element={<AdminFinancialYear />} />
        <Route path="/HRDetailsPage" element={<HRDetailsPage />} />
        <Route path="/AdminShiftmanagement" element={<AdminShiftmanagement />} />
        <Route path="/AdminAllShift" element={<AdminAllShift />} />
        <Route path="/AdminHolidayList" element={<AdminHolidayList />} />
        <Route path="/AdminLeavePage" element={<AdminLeavePage />} />
        <Route path="/AdminPerformance" element={<AdminPerformance />} />
        <Route path="/AdminHRCalender" element={<AdminHRCalender />} />
        <Route path="/AdminTraining" element={<AdminTraining />} />
        <Route path="/HRTraining" element={<HRTraining />} />
        <Route path="/EmployeeTraining" element={<EmployeeTraining />} />
        <Route path="/AdminAttendancePage" element={<AttendancePage />} />
        <Route path="/forgot-password/admin" element={<ForgotPasswordAdmin />} />
        <Route path="/forgot-password/hr" element={<ForgotPasswordHR />} />
        <Route path="/forgot-password/employee" element={<ForgotPasswordEmployee />} />
        <Route path="/EmployeeRaiseConcern" element={<EmployeeRaiseConcern />} />
        <Route path="/HRConcernList" element={<HRConcernList />} />
        <Route path="/AdminConcernList" element={<AdminConcernList />} />
        <Route path="/HrProfile" element={<HrProfile />} />
        <Route path="/HRAttendanceReportGenerate" element={<HRAttendanceReportGenerate />} />
        <Route path="/HRLeaveApproval" element={<HRLeaveApprovals />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
        <Route path="/SideForgotPassword" element={<SideForgotPassword />} />
         
      </Routes>
    </Router>
  );
}

export default App;
