// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminSidebar from './components/Common/AdminSidebar';
import AdminDashboard from './dashboards/AdminDashboard';
import HRSidebar from './components/Common/HRSidebar';
import HRDashboard from './dashboards/HRDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';

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
      </Routes>
    </Router>
  );
}

export default App;
