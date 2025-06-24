import React from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const MyProfile = () => {
  // Mock employee data — replace with real API data later
  const employee = {
    name: "Rohit Sharma",
    employeeId: "EMP123",
    email: "rohit.sharma@example.com",
    phone: "9876543210",
    department: "Engineering",
    designation: "Software Developer",
    dateOfJoining: "2023-04-01",
    address: "123, Green Park, New Delhi, India",
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <EmployeeSidebar />

      <main className="flex-1 ml-64 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-yellow-300 p-10">
          <h1 className="text-4xl font-extrabold mb-10 text-yellow-900 border-b border-yellow-300 pb-4 text-center">
            My Profile
          </h1>

          <div className="space-y-6 text-yellow-900 text-lg">
            <div>
              <label className="font-semibold">Name:</label>
              <p className="mt-1">{employee.name}</p>
            </div>

            <div>
              <label className="font-semibold">Employee ID:</label>
              <p className="mt-1">{employee.employeeId}</p>
            </div>

            <div>
              <label className="font-semibold">Email:</label>
              <p className="mt-1">{employee.email}</p>
            </div>

            <div>
              <label className="font-semibold">Phone:</label>
              <p className="mt-1">{employee.phone}</p>
            </div>

            <div>
              <label className="font-semibold">Department:</label>
              <p className="mt-1">{employee.department}</p>
            </div>

            <div>
              <label className="font-semibold">Designation:</label>
              <p className="mt-1">{employee.designation}</p>
            </div>

            <div>
              <label className="font-semibold">Date of Joining:</label>
              <p className="mt-1">
                {new Date(employee.dateOfJoining).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="font-semibold">Address:</label>
              <p className="mt-1">{employee.address}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;
