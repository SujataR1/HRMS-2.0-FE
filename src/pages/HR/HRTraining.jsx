import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const dummyEmployees = []; // fallback if needed

const trainingStatusColors = {
  Assigned: "bg-yellow-300 text-yellow-900",
  Completed: "bg-green-300 text-green-900",
  Overdue: "bg-red-300 text-red-900",
};

const HRTraining = () => {
  const [employees, setEmployees] = useState([]);
  const [trainings, setTrainings] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:9000/admin/employee-profiles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) setEmployees(data.data);
      } catch (error) {
        console.error("Failed to fetch employees", error.message);
        setEmployees(dummyEmployees);
      }
    };
    fetchEmployees();

    // Load saved trainings from localStorage
    const saved = localStorage.getItem("employee_trainings");
    if (saved) setTrainings(JSON.parse(saved));
  }, []);

  // Real-time update for training assignments
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === "employee_trainings") {
        const updated = event.newValue ? JSON.parse(event.newValue) : {};
        setTrainings(updated);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 font-sans">
      <HRSidebar />

      <main className="ml-64 flex-1 p-10">
        <div className="bg-white rounded-2xl shadow-xl border border-yellow-300 p-10">
          <h1 className="text-4xl font-extrabold text-yellow-900 mb-10 text-center drop-shadow-sm">
            Training Assignments Overview (HR)
          </h1>

          {Object.keys(trainings).length === 0 ? (
            <p className="text-center text-yellow-700 font-semibold text-lg">
              No training assignments available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-yellow-300 text-yellow-900 rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-yellow-200 text-yellow-900 uppercase text-sm font-bold">
                  <tr>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Employee</th>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Training Topic</th>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Remarks</th>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Assigned At</th>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(trainings).map(([empId, assignedTrainings]) =>
                    assignedTrainings.map((training, index) => {
                      const emp = employees.find((e) => e.employeeId === empId);

                      return (
                        <tr
                          key={`${empId}-${training.topic}`}
                          className={index % 2 === 0 ? "bg-yellow-50 hover:bg-yellow-100" : "bg-yellow-100 hover:bg-yellow-200"}
                        >
                          <td className="px-6 py-4 border border-yellow-300 font-medium">
                            {emp ? `${emp.name} (${emp.employeeId})` : empId}
                          </td>
                          <td className="px-6 py-4 border border-yellow-300 font-semibold">{training.topic}</td>
                          <td className="px-6 py-4 border border-yellow-300 whitespace-pre-wrap">
                            {training.remarks || "-"}
                          </td>
                          <td className="px-6 py-4 border border-yellow-300">
                            {new Date(training.assignedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 border border-yellow-300">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                trainingStatusColors[training.status] || "bg-gray-300 text-gray-700"
                              }`}
                            >
                              {training.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRTraining;
