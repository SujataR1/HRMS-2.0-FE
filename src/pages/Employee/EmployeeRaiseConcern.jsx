import React, { useState } from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const EmployeeRaiseConcern = () => {
  const [concern, setConcern] = useState({
    category: "",
    title: "",
    description: "",
    priority: "medium",
    visibility: "hrOnly",
    ccManager: false,
    attachment: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConcern((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setConcern((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");

    const formData = new FormData();
    for (const key in concern) {
      if (key === "attachment" && concern.attachment) {
        formData.append("attachment", concern.attachment);
      } else {
        formData.append(key, concern[key]);
      }
    }

    try {
      const token = localStorage.getItem("employeeToken");
      const res = await fetch("http://192.168.0.100:9000/employee/raise-concern", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccessMsg("Concern submitted successfully!");
        setConcern({
          category: "",
          title: "",
          description: "",
          priority: "medium",
          visibility: "hrOnly",
          ccManager: false,
          attachment: null,
        });
      } else {
        alert("Failed to raise concern. Try again.");
      }
    } catch (err) {
      alert("Error while submitting concern.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <EmployeeSidebar />
      <div className="p-6 w-full max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-yellow-700 mb-6 text-center">
          Raise a Workplace Concern
        </h2>

        {successMsg && <div className="text-green-600 text-center mb-4">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-yellow-800">Concern Category</label>
            <select
              name="category"
              value={concern.category}
              onChange={handleChange}
              required
              className="border border-yellow-300 rounded-md p-2 w-full"
            >
              <option value="">Select Category</option>
              <option value="salary">Salary / Compensation</option>
              <option value="harassment">Harassment / Discrimination</option>
              <option value="mentalHealth">Mental Health / Burnout</option>
              <option value="leaveIssues">Leave or Time-off Disputes</option>
              <option value="promotion">Promotion / Appraisal</option>
              <option value="workload">Excessive Workload</option>
              <option value="managerConflict">Manager Behavior</option>
              <option value="itSupport">Technical / IT Support</option>
              <option value="safety">Unsafe Work Conditions</option>
              <option value="general">Other / General</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-yellow-800">Title</label>
            <input
              type="text"
              name="title"
              value={concern.title}
              onChange={handleChange}
              placeholder="Summarize your concern"
              required
              className="border border-yellow-300 rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-medium text-yellow-800">Description</label>
            <textarea
              name="description"
              value={concern.description}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Describe the concern in detail..."
              className="border border-yellow-300 rounded-md p-2 w-full resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block font-medium text-yellow-800">Priority</label>
              <select
                name="priority"
                value={concern.priority}
                onChange={handleChange}
                className="border border-yellow-300 rounded-md p-2 w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block font-medium text-yellow-800">Visibility</label>
              <select
                name="visibility"
                value={concern.visibility}
                onChange={handleChange}
                className="border border-yellow-300 rounded-md p-2 w-full"
              >
                <option value="hrOnly">HR Only</option>
                <option value="hrAndAdmin">HR & Admin</option>
                <option value="management">HR + Management</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="ccManager"
                checked={concern.ccManager}
                onChange={handleChange}
              />
              CC My Manager
            </label>
          </div>

          <div>
            <label className="block font-medium text-yellow-800">Attachment (optional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="border border-yellow-300 rounded-md p-2 w-full"
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded bg-yellow-600 text-white font-semibold shadow hover:bg-yellow-500 ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Submit Concern"}
            </button>

            <button
              type="button"
              onClick={() =>
                setConcern({
                  category: "",
                  title: "",
                  description: "",
                  priority: "medium",
                  visibility: "hrOnly",
                  ccManager: false,
                  attachment: null,
                })
              }
              className="text-sm text-red-500 underline"
            >
              Clear All
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeRaiseConcern;
