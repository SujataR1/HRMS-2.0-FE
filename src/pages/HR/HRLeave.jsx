import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const dummyLeaveRequests = [
  {
    id: "req1",
    employeeId: "E1001",
    employeeName: "Alice Johnson",
    leaveType: "Paid",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    reason: "Family Function",
    status: "Pending",
  },
  {
    id: "req2",
    employeeId: "E1002",
    employeeName: "Bob Smith",
    leaveType: "Non-Paid",
    startDate: "2025-07-15",
    endDate: "2025-07-18",
    reason: "Personal Work",
    status: "Pending",
  },
];

const dummyLeaveBalances = {
  E1001: { paidLeavesRemaining: 8, nonPaidLeavesRemaining: 5 },
  E1002: { paidLeavesRemaining: 4, nonPaidLeavesRemaining: 7 },
};

const dummyLeaveHistory = {
  E1001: [
    { type: "Paid", from: "2025-06-01", to: "2025-06-03", status: "Approved" },
    { type: "Paid", from: "2025-05-15", to: "2025-05-15", status: "Approved" },
    { type: "Non-Paid", from: "2025-04-10", to: "2025-04-11", status: "Approved" },
  ],
  E1002: [
    { type: "Paid", from: "2025-06-05", to: "2025-06-06", status: "Approved" },
    { type: "Non-Paid", from: "2025-05-20", to: "2025-05-22", status: "Disapproved" },
    { type: "Paid", from: "2025-03-12", to: "2025-03-15", status: "Approved" },
  ],
};

const Modal = ({ title, children, onClose }) => (
  <>
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 cursor-pointer"
    />
   <div className="fixed z-50 top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 space-y-5 font-sans">
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 text-yellow-600 hover:text-yellow-800 transition text-2xl font-bold leading-none"
      >
        &times;
      </button>
      <h3 className="text-2xl font-semibold text-yellow-900">{title}</h3>
      {children}
    </div>
  </>
);

const HRLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRequestId, setModalRequestId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [modalReason, setModalReason] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const saved = localStorage.getItem("hr_leave_requests");
      if (saved) setLeaveRequests(JSON.parse(saved));
      else setLeaveRequests(dummyLeaveRequests);
      setLoading(false);
    }, 700);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("hr_leave_requests", JSON.stringify(leaveRequests));
    }
  }, [leaveRequests, loading]);

  const openModal = (requestId, action) => {
    setModalRequestId(requestId);
    setModalAction(action);
    setModalReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalRequestId(null);
    setModalAction(null);
    setModalReason("");
  };

  const handleDecision = () => {
    if (!modalRequestId || !modalAction) return;

    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === modalRequestId
          ? {
              ...req,
              status: modalAction === "approve" ? "Approved" : "Disapproved",
              hrComment: modalReason.trim() || "-",
              decisionDate: new Date().toISOString().split("T")[0],
            }
          : req
      )
    );
    closeModal();
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-yellow-50">
        <HRSidebar />
        <main className="ml-64 flex-1 flex items-center justify-center font-sans">
          <p className="text-yellow-600 animate-pulse font-semibold text-xl">
            Loading leave requests...
          </p>
        </main>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 font-sans">
      <HRSidebar />

      <main className="ml-64 flex-1 flex flex-col items-center p-10">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl border border-yellow-200 p-10 space-y-10">
          <h1 className="text-5xl font-extrabold text-yellow-900 text-center tracking-wide drop-shadow-md">
            HR Leave Requests
          </h1>

          {leaveRequests.length === 0 ? (
            <p className="text-center text-yellow-700 font-semibold text-lg">
              No leave requests found.
            </p>
          ) : (
            leaveRequests.map((req) => {
              const leaveBalance = dummyLeaveBalances[req.employeeId] || {
                paidLeavesRemaining: 0,
                nonPaidLeavesRemaining: 0,
              };
              const history = dummyLeaveHistory[req.employeeId] || [];

              return (
                <div
                  key={req.id}
                  className="border border-yellow-300 rounded-2xl p-8 shadow-md bg-yellow-50 hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
                    <div className="space-y-3 max-w-lg">
                      <h2 className="text-2xl font-semibold text-yellow-900 tracking-wide">
                        {req.employeeName}{" "}
                        <span className="text-yellow-700 font-normal">({req.employeeId})</span>
                      </h2>
                      <p className="text-yellow-800 font-semibold">
                        Leave Type:{" "}
                        <span
                          className={`font-extrabold ${
                            req.leaveType === "Paid"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {req.leaveType} Leave
                        </span>
                      </p>
                      <p className="text-yellow-700">
                        Requested Dates:{" "}
                        <span className="font-semibold">
                          {req.startDate} to {req.endDate}
                        </span>
                      </p>
                      <p className="text-yellow-700">{req.reason}</p>
                      <p className="italic text-yellow-600 text-sm mt-2">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            req.status === "Pending"
                              ? "text-yellow-600"
                              : req.status === "Approved"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </p>
                      {req.status !== "Pending" && (
                        <>
                          <p className="mt-1 text-yellow-700">
                            HR Comment: <em>{req.hrComment || "-"}</em>
                          </p>
                          <p className="text-yellow-700 text-sm">
                            Decision Date: {req.decisionDate}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 md:items-end text-yellow-900 font-medium">
                      <div className="bg-yellow-100 p-4 rounded-xl w-48 text-center shadow-inner border border-yellow-200">
                        <p className="mb-1 font-semibold tracking-wide">Leave Balance</p>
                        <p className="text-green-700">
                          Paid: <span className="font-bold">{leaveBalance.paidLeavesRemaining}</span>{" "}
                          days
                        </p>
                        <p className="text-red-600">
                          Non-Paid:{" "}
                          <span className="font-bold">{leaveBalance.nonPaidLeavesRemaining}</span>{" "}
                          days
                        </p>
                      </div>

                      {req.status === "Pending" && (
                        <div className="flex space-x-5">
                          <button
                            onClick={() => openModal(req.id, "approve")}
                            className="bg-green-600 hover:bg-green-700 focus:outline-yellow-300 focus:ring-4 focus:ring-green-400 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition"
                            aria-label={`Approve leave request for ${req.employeeName}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openModal(req.id, "disapprove")}
                            className="bg-red-600 hover:bg-red-700 focus:outline-yellow-300 focus:ring-4 focus:ring-red-400 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition"
                            aria-label={`Disapprove leave request for ${req.employeeName}`}
                          >
                            Disapprove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Leave History */}
                  <div className="mt-8 border-t border-yellow-200 pt-5">
                    <h3 className="text-yellow-900 font-semibold text-lg mb-3 tracking-wide">
                      Recent Leave History
                    </h3>
                    {history.length === 0 ? (
                      <p className="text-yellow-700 italic">No recent leaves.</p>
                    ) : (
                      <ul className="text-yellow-800 text-sm space-y-2 max-w-md">
                        {history.map((h, i) => (
                          <li
                            key={i}
                            className="flex justify-between bg-yellow-100 rounded-lg px-4 py-2 shadow-inner"
                          >
                            <span>
                              {h.type} Leave: {h.from} to {h.to}
                            </span>
                            <span
                              className={`font-semibold ${
                                h.status === "Approved"
                                  ? "text-green-700"
                                  : h.status === "Disapproved"
                                  ? "text-red-700"
                                  : "text-yellow-700"
                              }`}
                            >
                              {h.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {modalOpen && (
          <Modal
            title={`${modalAction === "approve" ? "Approve" : "Disapprove"} Leave Request`}
            onClose={closeModal}
          >
            <label className="block text-yellow-900 font-medium mb-2">
              {modalAction === "disapprove"
                ? "Reason for Disapproval"
                : "Optional Comment"}
            </label>
            <textarea
              value={modalReason}
              onChange={(e) => setModalReason(e.target.value)}
              placeholder="Write a comment or reason (optional)"
              className="w-full border border-yellow-300 rounded-lg px-4 py-3 resize-none focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300 transition"
              rows={5}
            />
            <div className="flex justify-end space-x-5 mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-lg border border-yellow-400 text-yellow-700 hover:bg-yellow-100 transition focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDecision}
                className={`px-6 py-2 rounded-lg font-semibold text-white ${
                  modalAction === "approve"
                    ? "bg-green-600 hover:bg-green-700 focus:ring-green-400 focus:outline-none focus:ring-4"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-400 focus:outline-none focus:ring-4"
                } transition`}
              >
                {modalAction === "approve" ? "Approve" : "Disapprove"}
              </button>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default HRLeave;
