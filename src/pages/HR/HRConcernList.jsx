import React, { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";
import { MdAttachFile } from "react-icons/md";

const HRConcernList = () => {
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated concern list for UI
    setTimeout(() => {
      setConcerns([
        {
          id: 1,
          title: "Salary Delay for March",
          category: "Salary / Compensation",
          priority: "high",
          description: "My March salary is delayed. Kindly look into it.",
          employeeId: "EMP1023",
          employeeName: "Riya Das",
          createdAt: "2025-07-04T10:30:00Z",
          attachmentUrl: "",
        },
        {
          id: 2,
          title: "Laptop Screen Flickering",
          category: "Equipment / IT",
          priority: "medium",
          description: "Laptop screen is flickering frequently.",
          employeeId: "EMP1017",
          employeeName: "Amit Roy",
          createdAt: "2025-07-05T14:20:00Z",
          attachmentUrl: "https://via.placeholder.com/150",
        },
        {
          id: 3,
          title: "Leave not approved",
          category: "Leave Issues",
          priority: "low",
          description: "My casual leave from 1st July is still not approved.",
          employeeId: "EMP1020",
          employeeName: "Sneha Saha",
          createdAt: "2025-07-06T09:00:00Z",
          attachmentUrl: "",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="flex bg-yellow-50 min-h-screen">
      <HRSidebar />

      <main className="flex-1 ml-64 px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-yellow-700 mb-8 text-center">
            Employee Raised Concerns
          </h2>

          {loading ? (
            <div className="text-center text-yellow-600 text-lg font-medium">
              Loading concerns...
            </div>
          ) : concerns.length === 0 ? (
            <div className="text-center text-yellow-600 text-lg font-medium">
              No concerns submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {concerns.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md border border-yellow-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-yellow-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted on:{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-sm mb-2">
                    <span className="font-medium text-yellow-700">
                      Category:
                    </span>{" "}
                    {item.category}
                  </div>

                  <div className="text-sm mb-2">
                    <span className="font-medium text-yellow-700">
                      Priority:
                    </span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-bold capitalize ${
                        item.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : item.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <div className="text-sm mb-3 text-gray-700">
                    <span className="font-medium text-yellow-700">
                      Description:
                    </span>{" "}
                    {item.description}
                  </div>

                  <div className="text-sm mb-2 text-yellow-800">
                    <span className="font-medium">Employee:</span>{" "}
                    {item.employeeName || "Anonymous"} ({item.employeeId})
                  </div>

                  {item.attachmentUrl && (
                    <a
                      href={item.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 mt-3 hover:underline hover:text-blue-800"
                    >
                      <MdAttachFile className="mr-1" />
                      View Attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRConcernList;
