// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminSidebar from './components/Common/AdminSidebar';
import AdminDashboard from './dashboards/AdminDashboard';
import HRSidebar from './components/Common/HRSidebar';
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


   {/* <Route path="/Update-Employee-Info" element={<UpdateEmployee />} /> */}
   <Route path="/employee-details/:employeeId" element={<UpdateEmployee />} />

    <Route path="/Assign-Shift-to-Employee" element={<AssignShift />} />
     <Route path="/Manage-Employee-Details-Page" element={<ManageEmployeeDetails />} />
    <Route path="/Content-Wrapper" element={<ContentWrapper />} />
        <Route path="/Create-Employee-Details" element={<CreateEmployeeDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
