import React from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";
import { MdAttachFile } from "react-icons/md";

const AdminConcernList = () => {
  const dummyConcerns = [
    {
      id: "1",
      title: "System Crash",
      category: "equipment",
      priority: "high",
      description: "My system is not booting.",
      employeeName: "Sujata Routh",
      employeeId: "EMP001",
      createdAt: new Date().toISOString(),
      attachmentUrl: "",
    },
  ];

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 lg:ml-64">
        <h2 className="text-3xl font-bold text-yellow-700 mb-6 text-center">
          Employee Raised Concerns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyConcerns.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-yellow-300 rounded-lg shadow p-5"
            >
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-yellow-700 mb-1">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-sm text-yellow-700 mb-1">
                <strong>Priority:</strong>{" "}
                <span
                  className={`font-bold ${
                    item.priority === "high"
                      ? "text-red-600"
                      : item.priority === "low"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {item.priority}
                </span>
              </p>
              <p className="text-sm text-yellow-900 mb-2">
                <strong>Description:</strong> {item.description}
              </p>
              <p className="text-sm text-yellow-700 mb-1">
                <strong>Employee:</strong> {item.employeeName} ({item.employeeId})
              </p>
              <p className="text-sm text-yellow-700 mb-1">
                <strong>Submitted on:</strong>{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              {item.attachmentUrl && (
                <a
                  href={item.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 mt-2 hover:underline"
                >
                  <MdAttachFile />
                  View Attachment
                </a>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminConcernList;
