import React from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const EmployeeShiftDetails = () => {
  // Mock data
  const mockEmployee = {
    name: "Rohit Sharma",
    employeeId: "EMP123",
    department: "Engineering",
    designation: "Software Developer",
    email: "rohit.sharma@example.com",
    phone: "9876543210",
    dateOfJoining: "2023-04-01",
  };

  const mockShift = {
    shiftName: "Morning Shift",
    fullShiftStartingTime: "09:00 AM",
    fullShiftEndingTime: "05:00 PM",
    halfShiftStartingTime: "09:00 AM",
    halfShiftEndingTime: "01:00 PM",
    weeklyDaysOff: ["Saturday", "Sunday"],
    weeklyHalfDays: ["Wednesday"],
  };

  return (
    <div className="flex bg-yellow-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-yellow-200 shadow-md">
        <EmployeeSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-yellow-900 mb-8 border-b pb-2 border-yellow-300">
            My Shift Details
          </h2>

          {/* Employee Info */}
          <div className="bg-white p-6 rounded shadow mb-6 border border-yellow-200">
            <h3 className="text-2xl font-semibold mb-4 text-yellow-800">Employee Info</h3>
            <p><strong>Name:</strong> {mockEmployee.name}</p>
            <p><strong>Employee ID:</strong> {mockEmployee.employeeId}</p>
            <p><strong>Department:</strong> {mockEmployee.department}</p>
            <p><strong>Designation:</strong> {mockEmployee.designation}</p>
            <p><strong>Email:</strong> {mockEmployee.email}</p>
            <p><strong>Phone:</strong> {mockEmployee.phone}</p>
            <p><strong>Date of Joining:</strong> {new Date(mockEmployee.dateOfJoining).toLocaleDateString()}</p>
          </div>

          {/* Shift Info */}
          <div className="bg-white p-6 rounded shadow border border-yellow-200">
            <h3 className="text-2xl font-semibold mb-4 text-yellow-800">Assigned Shift</h3>
            <p><strong>Shift Name:</strong> {mockShift.shiftName}</p>
            <p><strong>Full Shift Time:</strong> {mockShift.fullShiftStartingTime} - {mockShift.fullShiftEndingTime}</p>
            <p><strong>Half Shift Time:</strong> {mockShift.halfShiftStartingTime} - {mockShift.halfShiftEndingTime}</p>

            <div className="mt-4">
              <strong>Weekly Days Off:</strong>
              {mockShift.weeklyDaysOff.length ? (
                <ul className="list-disc ml-5 text-yellow-700">
                  {mockShift.weeklyDaysOff.map((day) => (
                    <li key={day}>{day}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-yellow-500">None</p>
              )}
            </div>

            <div className="mt-4">
              <strong>Weekly Half Days:</strong>
              {mockShift.weeklyHalfDays.length ? (
                <ul className="list-disc ml-5 text-yellow-700">
                  {mockShift.weeklyHalfDays.map((day) => (
                    <li key={day}>{day}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-yellow-500">None</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeShiftDetails;
