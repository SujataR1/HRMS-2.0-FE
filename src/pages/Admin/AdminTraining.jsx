import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";

const trainingTopics = [
  "Workplace Safety",
  "Time Management",
  "Leadership Skills",
  "Communication Skills",
  "Diversity & Inclusion",
  "Technical Skills Enhancement",
];

const ModalDialog = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto close after 3 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50" />

      {/* Dialog Box */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-xl shadow-xl max-w-md w-full p-6 mx-4
          border-4 border-yellow-400
          animate-fadeInScale
          text-yellow-900 font-semibold text-center
          relative
          ">
          <svg
            className="mx-auto mb-3 w-12 h-12 text-yellow-500 animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
          <p className="text-lg">{message}</p>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease forwards;
        }
      `}</style>
    </>
  );
};

const AdminTraining = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [remarks, setRemarks] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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
        else setErrorMsg(data.message || "Failed to load employees");
      } catch (err) {
        setErrorMsg("Failed to load employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = () => {
    if (!selectedEmployeeId || !selectedTopic) {
      setErrorMsg("Please select employee and training topic");
      return;
    }

    const savedTrainings = JSON.parse(localStorage.getItem("employee_trainings") || "{}");

    const employeeTrainings = savedTrainings[selectedEmployeeId] || [];

    if (employeeTrainings.some((t) => t.topic === selectedTopic)) {
      setErrorMsg("This training topic is already assigned to the employee");
      return;
    }

    const newTraining = {
      topic: selectedTopic,
      remarks: remarks.trim(),
      assignedAt: new Date().toISOString(),
      status: "Assigned",
    };

    const updatedTrainings = {
      ...savedTrainings,
      [selectedEmployeeId]: [...employeeTrainings, newTraining],
    };

    localStorage.setItem("employee_trainings", JSON.stringify(updatedTrainings));

    setModalMessage(`Training "${selectedTopic}" assigned to employee successfully!`);
    setErrorMsg("");
    setSelectedEmployeeId("");
    setSelectedTopic("");
    setRemarks("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-900 text-yellow-50 shadow-lg fixed inset-y-0 left-0 z-20">
        <AdminSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 flex items-center justify-center p-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-yellow-300 p-8">
          <h1 className="text-3xl font-extrabold text-yellow-900 mb-10 text-center drop-shadow-md">
            Assign Training to Employee (Admin)
          </h1>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-200 text-red-900 rounded-md font-semibold shadow-inner">
              {errorMsg}
            </div>
          )}

          <label className="block mb-2 font-semibold text-yellow-900">Select Employee</label>
          <select
            className="w-full p-3 mb-6 border border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
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

          <label className="block mb-2 font-semibold text-yellow-900">Select Training Topic</label>
          <select
            className="w-full p-3 mb-6 border border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition disabled:opacity-50"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={!selectedEmployeeId}
          >
            <option value="">-- Select Training Topic --</option>
            {trainingTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-semibold text-yellow-900">Remarks (Optional)</label>
          <textarea
            className="w-full p-3 mb-6 border border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add remarks or instructions for the training..."
            disabled={!selectedTopic}
          />

          <button
            className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition shadow-md disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!selectedEmployeeId || !selectedTopic}
            aria-label="Assign Training"
          >
            Assign Training
          </button>
        </div>
      </main>

      {modalMessage && (
        <ModalDialog message={modalMessage} onClose={() => setModalMessage("")} />
      )}
    </div>
  );
};

export default AdminTraining;
