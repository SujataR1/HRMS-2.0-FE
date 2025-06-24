import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";

const dummyLeaveRequests = [
  {
    id: "req1",
    employeeId: "E1001",
    employeeName: "Alice Johnson",
    leaveType: "Paid",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    reason: "Family Function",
    status: "Approved",
    hrComment: "Approved for genuine reason",
    decisionDate: "2025-07-01",
  },
  {
    id: "req2",
    employeeId: "E1002",
    employeeName: "Bob Smith",
    leaveType: "Non-Paid",
    startDate: "2025-07-15",
    endDate: "2025-07-18",
    reason: "Personal Work",
    status: "Disapproved",
    hrComment: "Leave quota exhausted",
    decisionDate: "2025-07-02",
  },
];

const AdminLeavePage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    // You can later fetch from backend
    setLeaveRequests(dummyLeaveRequests);
  }, []);

  return (
    <div className="flex min-h-screen bg-yellow-50 font-sans">
      <AdminSidebar />
      <main className="ml-64 p-10 w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-yellow-900 mb-10">
          Leave Applications Overview
        </h1>

        <div className="space-y-8">
          {leaveRequests.length === 0 ? (
            <p className="text-yellow-800 font-medium">No leave requests found.</p>
          ) : (
            leaveRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl shadow-lg border border-yellow-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-yellow-900">
                      {req.employeeName} ({req.employeeId})
                    </h2>
                    <p className="text-yellow-800 font-medium">
                      Type:{" "}
                      <span className={`font-bold ${req.leaveType === "Paid" ? "text-green-700" : "text-red-600"}`}>
                        {req.leaveType} Leave
                      </span>
                    </p>
                    <p className="text-yellow-700">
                      Date: {req.startDate} to {req.endDate}
                    </p>
                    <p className="text-yellow-700">Reason: {req.reason}</p>
                    <p>
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          req.status === "Pending"
                            ? "text-yellow-600"
                            : req.status === "Approved"
                            ? "text-green-700"
                            : "text-red-600"
                        }`}
                      >
                        {req.status}
                      </span>
                    </p>
                    {req.hrComment && (
                      <p className="text-yellow-800">
                        HR Comment: <em>{req.hrComment}</em>
                      </p>
                    )}
                    {req.decisionDate && (
                      <p className="text-sm text-yellow-600">
                        Decision Date: {req.decisionDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminLeavePage;
