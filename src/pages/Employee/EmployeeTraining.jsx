import React, { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const EmployeeTraining = ({ employeeId }) => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    const savedTrainings = JSON.parse(localStorage.getItem("employee_trainings") || "{}");
    if (employeeId && savedTrainings[employeeId]) {
      setTrainings(savedTrainings[employeeId]);
    } else {
      setTrainings([]);
    }
  }, [employeeId]);

  return (
    <div className="min-h-screen flex bg-yellow-50 font-sans">
      {/* Sidebar fixed width */}
      <aside className="w-64 border-r border-yellow-300">
        <EmployeeSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex justify-center items-start p-10">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-yellow-300 p-8">
          <h1 className="text-3xl font-extrabold text-yellow-900 mb-8 text-center">
            My Assigned Trainings
          </h1>

          {trainings.length === 0 ? (
            <p className="text-yellow-700 text-center font-semibold">
              No trainings assigned to you yet.
            </p>
          ) : (
            <ul className="space-y-6">
              {trainings.map(({ topic, remarks, assignedAt, status }, index) => (
                <li
                  key={`${topic}-${index}`}
                  className="p-4 rounded-lg border border-yellow-300 bg-yellow-100 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-yellow-900">{topic}</h2>
                  {remarks && (
                    <p className="mt-2 text-yellow-800 whitespace-pre-wrap">{remarks}</p>
                  )}
                  <p className="mt-2 text-yellow-700 italic text-sm">
                    Assigned on: {new Date(assignedAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`mt-1 font-semibold ${
                      status === "Assigned"
                        ? "text-yellow-600"
                        : status === "Completed"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    Status: {status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeTraining;
