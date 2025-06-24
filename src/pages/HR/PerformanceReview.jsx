import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const dummyProjects = [
  { id: "p1", name: "Project Apollo" },
  { id: "p2", name: "Project Zeus" },
  { id: "p3", name: "Project Athena" },
];

const PerformanceReview = () => {
  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState({});

  // Fetch employees
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
        if (res.ok) {
          setEmployees(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error.message);
      }
    };

    fetchEmployees();

    const saved = localStorage.getItem("hr_performance_reviews");
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  // Realtime update listener for localStorage changes
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "hr_performance_reviews") {
        const updated = event.newValue ? JSON.parse(event.newValue) : {};
        setReviews(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 font-sans">
      <HRSidebar />

      <main className="ml-64 flex-1 p-10">
        <div className="bg-white rounded-2xl shadow-xl border border-yellow-300 p-10">
          <h1 className="text-4xl font-extrabold text-yellow-900 mb-10 text-center drop-shadow-sm">
            HR Performance Review Dashboard
          </h1>

          {Object.keys(reviews).length === 0 ? (
            <div className="text-center text-yellow-700 font-semibold text-lg bg-yellow-100 p-6 rounded-xl shadow-inner">
              <p>No performance reviews submitted yet.</p>
              <p className="text-yellow-500 mt-2">Waiting for HR or Admin input...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-yellow-300 text-yellow-900 rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-yellow-200 text-yellow-900 uppercase text-sm font-bold">
                  <tr>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Employee</th>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Project</th>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Rating</th>
                    <th className="px-6 py-3 border border-yellow-300 text-left">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(reviews).map(([empId, projects]) =>
                    Object.entries(projects).map(([projId, review], index) => {
                      const emp = employees.find((e) => e.employeeId === empId);
                      const proj = dummyProjects.find((p) => p.id === projId);

                      return (
                        <tr
                          key={`${empId}-${projId}`}
                          className={
                            index % 2 === 0 ? "bg-yellow-50 hover:bg-yellow-100" : "bg-yellow-100 hover:bg-yellow-200"
                          }
                        >
                          <td className="px-6 py-4 border border-yellow-300 font-medium">
                            {emp ? `${emp.name} (${emp.employeeId})` : empId}
                          </td>
                          <td className="px-6 py-4 border border-yellow-300">{proj ? proj.name : projId}</td>
                          <td className="px-6 py-4 border border-yellow-300 font-semibold text-yellow-800">
                            {review.rating}
                          </td>
                          <td className="px-6 py-4 border border-yellow-300 whitespace-pre-wrap">
                            {review.comments || "-"}
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

export default PerformanceReview;
