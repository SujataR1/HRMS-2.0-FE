import React, { useState } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";

const AdminAttendancePage = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    employeeId: "",
    attendanceDate: "",
    punchIn: "",
    punchOut: "",
    status: "fullDay",
    comments: "",
  });
  const [filters, setFilters] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    month: "",
  });
  const [filterType, setFilterType] = useState("date"); // "date" or "month"
  const [editingId, setEditingId] = useState(null);
  const [editedEntry, setEditedEntry] = useState({});
  const [sendingReport, setSendingReport] = useState(false);


  // Format time string like "03:30:00 am" to "03:30 AM"
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const match = timeStr.match(/(\d{1,2}:\d{2}):\d{2} (\w{2})/i);
    if (match) {
      return `${match[1]} ${match[2].toUpperCase()}`; // e.g., "03:30 AM"
    }
    return timeStr;
  };

  // Format date YYYY-MM-DD from string
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0] || dateStr;
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("No auth token found. Please login.");
        setLoading(false);
        return;
      }

      const { employeeId, startDate, endDate, month } = filters;

      if (!employeeId) {
        alert("Please fill Employee ID.");
        setLoading(false);
        return;
      }

      let payload = { employeeId };

      if (filterType === "month") {
        if (!month) {
          alert("Please select a month.");
          setLoading(false);
          return;
        }
        const [year, mon] = month.split("-");
        const firstDay = `${year}-${mon}-01`;
        const lastDayDate = new Date(year, parseInt(mon), 0);
        const lastDay = lastDayDate.toISOString().split("T")[0];
        payload.startDate = firstDay;
        payload.endDate = lastDay;
      } else {
        if (!startDate || !endDate) {
          alert("Please fill start and end date.");
          setLoading(false);
          return;
        }
        payload.startDate = startDate;
        payload.endDate = endDate;
      }

      const response = await fetch("http://192.168.0.100:9000/admin/attendance/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success && Array.isArray(result.data)) {
        setAttendanceList(
          result.data.map((item, idx) => ({
            id: item.id || idx,
            employeeId: item.employeeId || "",
            attendanceDate: item.date || "",
            punchIn: item.punchIn || "",
            punchOut: item.punchOut || "",
            status: item.status || "fullDay",
            comments: item.comments || "",
          }))
        );
      } else {
        alert("Failed to fetch attendance: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error fetching attendance: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddManualAttendance = async () => {
    if (!manualEntry.employeeId || !manualEntry.attendanceDate) {
      alert("Please fill Employee ID and Attendance Date");
      return;
    }
    const token = localStorage.getItem("admin_token");
    if (!token) {
      alert("No auth token found. Please login.");
      return;
    }

    const payload = {
      employeeId: manualEntry.employeeId,
      attendanceDate: manualEntry.attendanceDate,
      punchIn: manualEntry.punchIn
        ? new Date(`${manualEntry.attendanceDate}T${manualEntry.punchIn}:00.000Z`).toISOString()
        : null,
      punchOut: manualEntry.punchOut
        ? new Date(`${manualEntry.attendanceDate}T${manualEntry.punchOut}:00.000Z`).toISOString()
        : null,
      status: manualEntry.status,
      flags: ["manualEntry", "edited"],
      comments: manualEntry.comments,
    };

    try {
      const response = await fetch("http://192.168.0.100:9000/admin/create-attendance-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        alert(result.message || "Manual attendance entry created successfully");
        setAttendanceList((prev) => [
          ...prev,
          {
            id: prev.length + 1000,
            employeeId: manualEntry.employeeId,
            attendanceDate: manualEntry.attendanceDate,
            punchIn: payload.punchIn,
            punchOut: payload.punchOut,
            status: manualEntry.status,
            comments: manualEntry.comments,
          },
        ]);
        setManualEntry({
          employeeId: "",
          attendanceDate: "",
          punchIn: "",
          punchOut: "",
          status: "fullDay",
          comments: "",
        });
      } else {
        alert("Failed to create manual attendance: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error creating manual attendance: " + err.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const entry = attendanceList.find((item) => item.id === id);
    if (!entry) return;
    setEditedEntry({
      employeeId: entry.employeeId,
      attendanceDate: entry.attendanceDate,
      punchIn: entry.punchIn
        ? (() => {
            const m = entry.punchIn.match(/(\d{1,2}:\d{2}):\d{2} (\w{2})/i);
            if (m) return m[1];
            return "";
          })()
        : "",
      punchOut: entry.punchOut
        ? (() => {
            const m = entry.punchOut.match(/(\d{1,2}:\d{2}):\d{2} (\w{2})/i);
            if (m) return m[1];
            return "";
          })()
        : "",
      status: entry.status,
      comments: entry.comments || "",
    });
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      alert("No auth token found. Please login.");
      return;
    }

    const punchInISO = editedEntry.punchIn
      ? new Date(`${editedEntry.attendanceDate}T${editedEntry.punchIn}:00.000Z`).toISOString()
      : null;
    const punchOutISO = editedEntry.punchOut
      ? new Date(`${editedEntry.attendanceDate}T${editedEntry.punchOut}:00.000Z`).toISOString()
      : null;

    const payload = {
      employeeId: editedEntry.employeeId,
      attendanceDate: editedEntry.attendanceDate,
      punchIn: punchInISO,
      punchOut: punchOutISO,
      status: editedEntry.status,
      flags: ["manualEntry", "edited"],
      comments: editedEntry.comments,
    };

    try {
      const response = await fetch("http://192.168.0.100:9000/admin/edit-attendance-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        alert(result.message || "Attendance updated successfully");
        setAttendanceList((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  employeeId: editedEntry.employeeId,
                  attendanceDate: editedEntry.attendanceDate,
                  punchIn: editedEntry.punchIn,
                  punchOut: editedEntry.punchOut,
                  status: editedEntry.status,
                  comments: editedEntry.comments,
                }
              : item
          )
        );
        setEditingId(null);
        setEditedEntry({});
      } else {
        alert("Failed to update attendance: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error updating attendance: " + err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedEntry({});
  };

const handleSendMonthlyReport = async () => {
  if (!filters.month) {
    alert("Please select a month to send the report.");
    return;
  }
  const token = localStorage.getItem("admin_token");
  if (!token) {
    alert("Authentication token missing. Please log in.");
    return;
  }
  const monthYear = filters.month.split("-").reverse().join("-"); // "2025-06" => "06-2025"
  setSendingReport(true);

  try {
    const response = await fetch("http://192.168.0.100:9000/admin/attendance/send-monthly-reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // <--- Add this line
      },
      body: JSON.stringify({ monthYear }),
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
    } else {
      alert("Failed to send report. Please try again.");
    }
  } catch (error) {
    alert("An error occurred while sending the report.");
    console.error("Report sending error:", error);
  } finally {
    setSendingReport(false);
  }
};




  return (
    <>
      <AdminSidebar />
<div className="flex min-h-screen bg-yellow-50 font-sans text-yellow-900">
  <div className="w-56 flex-shrink-0"></div>

  <main className="flex-1 flex justify-center p-6 sm:p-10 box-border">
    <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl border border-yellow-200 p-8">
      <h2 className="text-4xl font-extrabold text-yellow-700 mb-10 text-center drop-shadow-md">
        Employee Attendance Management
      </h2>

      {/* Filter Section */}
      <section className="mb-10">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <label className="font-medium text-yellow-800 flex items-center gap-2">
            <input
              type="radio"
              name="filterType"
              value="date"
              checked={filterType === "date"}
              onChange={() => {
                setFilterType("date");
                setFilters({ ...filters, month: "" });
              }}
              className="accent-yellow-600"
            />
            Filter by Date
          </label>
          <label className="font-medium text-yellow-800 flex items-center gap-2">
            <input
              type="radio"
              name="filterType"
              value="month"
              checked={filterType === "month"}
              onChange={() => {
                setFilterType("month");
                setFilters({ ...filters, startDate: "", endDate: "" });
              }}
              className="accent-yellow-600"
            />
            Filter by Month
          </label>

          <input
            type="text"
            placeholder="Employee ID"
            value={filters.employeeId}
            onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
            className="px-3 py-2 border border-yellow-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900"
          />

          {filterType === "date" && (
            <>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-3 py-2 border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-3 py-2 border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900"
              />
            </>
          )}

          {filterType === "month" && (
            <input
              type="month"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              className="px-3 py-2 border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900"
            />
          )}

          <button
            className={`px-5 py-2 rounded-md font-semibold text-white shadow-md transition ${
              loading
                ? "bg-yellow-400 cursor-not-allowed"
                : "bg-yellow-600 hover:bg-yellow-500"
            }`}
            onClick={fetchAttendance}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </section>

      {/* Manual Entry Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-yellow-700 mb-6 text-center border-b border-yellow-300 pb-2">
          Manual Attendance Entry
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: "employeeId", placeholder: "Employee ID", type: "text" },
            { name: "attendanceDate", type: "date" },
            { name: "punchIn", type: "time", placeholder: "Punch In" },
            { name: "punchOut", type: "time", placeholder: "Punch Out" },
            { name: "comments", placeholder: "Comments", type: "text" },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={manualEntry[name]}
              onChange={handleManualChange}
              className="px-3 py-2 border border-yellow-500 rounded-md text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          ))}

          <select
            name="status"
            value={manualEntry.status}
            onChange={handleManualChange}
            className="px-3 py-2 border border-yellow-500 rounded-md text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="fullDay">Full Day</option>
            <option value="halfDay">Half Day</option>
            <option value="absent">Absent</option>
          </select>

          <button
            className="px-5 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-500 transition"
            onClick={handleAddManualAttendance}
          >
            Add
          </button>
        </div>
      </section>

      {/* Attendance Table Section */}
      <section>
        <h3 className="text-2xl font-bold text-yellow-700 mb-4 text-center border-b border-yellow-300 pb-2">
          Attendance Records
        </h3>

        {attendanceList.length === 0 ? (
  <p className="text-center text-yellow-700">No records found.</p>
) : (
  <>
    <div className="overflow-auto rounded-lg shadow-md">
      <table className="w-full border-collapse text-sm text-yellow-900 bg-yellow-100 rounded">
        <thead className="bg-yellow-700 text-white">
          <tr>
            {["Employee ID", "Date", "Punch In", "Punch Out", "Status", "Comments", "Actions"].map((label) => (
              <th key={label} className="p-3 border border-yellow-600 text-center font-medium">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendanceList.map((item) =>
            editingId === item.id ? (
              <tr key={item.id} className="bg-yellow-50 text-center">
                {["employeeId", "attendanceDate", "punchIn", "punchOut", "status", "comments"].map((key, i) =>
                  key === "status" ? (
                    <td key={i} className="p-2 border border-yellow-300">
                      <select
                        name={key}
                        value={editedEntry[key]}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-yellow-500 rounded text-sm text-yellow-900"
                      >
                        <option value="fullDay">Full Day</option>
                        <option value="halfDay">Half Day</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                  ) : (
                    <td key={i} className="p-2 border border-yellow-300">
                      <input
                        name={key}
                        type={key.includes("Date") ? "date" : key.includes("Punch") ? "time" : "text"}
                        value={editedEntry[key]}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-yellow-500 rounded text-sm text-yellow-900"
                      />
                    </td>
                  )
                )}
                <td className="p-2 border border-yellow-300 space-x-1">
                  <button
                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-500"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-400"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={item.id} className="hover:bg-yellow-200 text-center text-sm">
                <td className="p-2 border border-yellow-300">{item.employeeId}</td>
                <td className="p-2 border border-yellow-300">{formatDate(item.attendanceDate)}</td>
                <td className="p-2 border border-yellow-300">{formatTime(item.punchIn)}</td>
                <td className="p-2 border border-yellow-300">{formatTime(item.punchOut)}</td>
                <td className="p-2 border border-yellow-300 capitalize">{item.status}</td>
                <td className="p-2 border border-yellow-300">{item.comments}</td>
                <td className="p-2 border border-yellow-300">
                  <button
                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-500"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>

    {/* ✅ Correctly placed Send Report Button */}
    {filterType === "month" && filters.month && (
      <div className="text-center mt-6">
        <button
          onClick={handleSendMonthlyReport}
          className={`px-5 py-2 bg-yellow-700 text-white font-bold rounded-md shadow-md hover:bg-yellow-600 transition ${
            sendingReport ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={sendingReport}
        >
          {sendingReport
            ? "Sending..."
            : `Send ${filters.month.split("-").reverse().join("-")} Report to Admin`}
        </button>
      </div>
    )}
  </>
)}


      </section>
    </div>
  </main>
</div>

    </>
  )};

export default AdminAttendancePage;
