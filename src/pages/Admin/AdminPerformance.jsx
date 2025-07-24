import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";

const dummyProjects = [
  { id: "p1", name: "Project Apollo" },
  { id: "p2", name: "Project Zeus" },
  { id: "p3", name: "Project Athena" },
];

// Reusable Modal component
const Modal = ({ title, message, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
      />
      {/* Modal Box */}
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-xl shadow-xl p-6 flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-yellow-900">{title}</h3>
        <p className="text-yellow-800">{message}</p>
        <button
          onClick={onClose}
          className="self-end bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition"
        >
          Close
        </button>
      </div>
    </>
  );
};

const AdminPerformance = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [reviews, setReviews] = useState({});

  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");

  // Modal state
  const [modal, setModal] = useState({ show: false, title: "", message: "" });

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://backend.hrms.transev.site/admin/employee-profiles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
        setEmployees(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();

    const savedReviews = localStorage.getItem("hr_performance_reviews");
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  useEffect(() => {
    if (!selectedEmployeeId || !selectedProjectId) {
      setRating("");
      setComments("");
      return;
    }
    const employeeReviews = reviews[selectedEmployeeId] || {};
    const projectReview = employeeReviews[selectedProjectId];
    if (projectReview) {
      setRating(projectReview.rating);
      setComments(projectReview.comments);
    } else {
      setRating("");
      setComments("");
    }
  }, [selectedEmployeeId, selectedProjectId, reviews]);

  const handleSaveReview = () => {
    if (!selectedEmployeeId || !selectedProjectId || !rating) return;

    const employeeReviews = reviews[selectedEmployeeId] || {};
    if (employeeReviews[selectedProjectId]) {
      // Show modal warning
      setModal({
        show: true,
        title: "Duplicate Review",
        message: "Review already submitted for this employee and project.",
      });
      return;
    }

    const updatedReviews = {
      ...reviews,
      [selectedEmployeeId]: {
        ...employeeReviews,
        [selectedProjectId]: { rating, comments },
      },
    };
    setReviews(updatedReviews);
    localStorage.setItem("hr_performance_reviews", JSON.stringify(updatedReviews));

    setModal({
      show: true,
      title: "Success",
      message: "Review saved successfully!",
    });

    // Clear form inputs after saving
    setSelectedEmployeeId("");
    setSelectedProjectId("");
    setRating("");
    setComments("");
  };

  const selectedEmployee = employees.find((e) => e.employeeId === selectedEmployeeId);
  const selectedProject = dummyProjects.find((p) => p.id === selectedProjectId);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <AdminSidebar />

      <main className="ml-64 flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-10 space-y-10 border border-yellow-300">
          <h1 className="text-4xl font-extrabold text-yellow-900 text-center tracking-wide drop-shadow-sm">
            Employee Performance Review
          </h1>

          {loading ? (
            <p className="text-center text-yellow-600 animate-pulse font-semibold">Loading employees...</p>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          ) : (
            <>
              {/* Employee Select */}
              <div>
                <label
                  htmlFor="employee-select"
                  className="block text-yellow-900 font-semibold mb-2 text-lg"
                >
                  Select Employee
                </label>
                <select
                  id="employee-select"
                  className="w-full px-5 py-3 rounded-lg border border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-yellow-900 font-medium shadow-sm transition"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Select */}
              <div>
                <label
                  htmlFor="project-select"
                  className="block text-yellow-900 font-semibold mb-2 text-lg"
                >
                  Select Project
                </label>
                <select
                  id="project-select"
                  className="w-full px-5 py-3 rounded-lg border border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-yellow-900 font-medium shadow-sm transition disabled:opacity-50"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={!selectedEmployeeId}
                >
                  <option value="">-- Select Project --</option>
                  {dummyProjects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Review Form */}
              {selectedEmployee && selectedProject && (
                <section className="bg-yellow-50 rounded-lg p-8 border border-yellow-300 shadow-inner">
                  <h2 className="text-2xl font-semibold text-yellow-900 mb-6">
                    Review for <span className="font-extrabold">{selectedEmployee.name}</span> on{" "}
                    <span className="font-extrabold">{selectedProject.name}</span>
                  </h2>

                  <div className="mb-6">
                    <label
                      htmlFor="rating"
                      className="block text-yellow-900 font-semibold mb-2"
                    >
                      Rating <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="rating"
                      className="w-full px-4 py-3 rounded-lg border border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-yellow-900 font-medium shadow-sm transition"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">-- Select Rating --</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="comments"
                      className="block text-yellow-900 font-semibold mb-2"
                    >
                      Comments
                    </label>
                    <textarea
                      id="comments"
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg border border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-yellow-900 font-medium shadow-sm transition resize-none"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add comments or feedback..."
                    />
                  </div>

                  <button
                    onClick={handleSaveReview}
                    disabled={!rating}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg shadow-md transition"
                  >
                    Save Review
                  </button>
                </section>
              )}

              {/* All Reviews Table */}
              {Object.keys(reviews).length > 0 && (
                <section className="bg-yellow-50 rounded-lg p-8 border border-yellow-300 shadow-inner">
                  <h2 className="text-2xl font-semibold text-yellow-900 mb-6 text-center">
                    All Reviews
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-yellow-900">
                      <thead>
                        <tr className="bg-yellow-200">
                          <th className="border border-yellow-300 px-6 py-3 text-left font-semibold">
                            Employee
                          </th>
                          <th className="border border-yellow-300 px-6 py-3 text-left font-semibold">
                            Project
                          </th>
                          <th className="border border-yellow-300 px-6 py-3 text-left font-semibold">
                            Rating
                          </th>
                          <th className="border border-yellow-300 px-6 py-3 text-left font-semibold">
                            Comments
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(reviews).map(([empId, projects]) =>
                          Object.entries(projects).map(([projId, review], idx) => {
                            const emp = employees.find((e) => e.employeeId === empId);
                            const proj = dummyProjects.find((p) => p.id === projId);
                            return (
                              <tr
                                key={`${empId}-${projId}`}
                                className={idx % 2 === 0 ? "bg-yellow-100" : "bg-yellow-50"}
                              >
                                <td className="border border-yellow-300 px-6 py-3">
                                  {emp ? `${emp.name} (${emp.employeeId})` : empId}
                                </td>
                                <td className="border border-yellow-300 px-6 py-3">
                                  {proj ? proj.name : projId}
                                </td>
                                <td className="border border-yellow-300 px-6 py-3">{review.rating}</td>
                                <td className="border border-yellow-300 px-6 py-3 whitespace-pre-wrap">
                                  {review.comments || "-"}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal popup */}
      {modal.show && (
        <Modal
          title={modal.title}
          message={modal.message}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </div>
  );
};

export default AdminPerformance;
