// import React, { useState, useEffect } from "react";
// import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

// const EmployeeAllowedLeaveTypes = [
//   "CASUAL",
//   "SICK",
//   "BEREAVEMENT",
//   "OTHER",
//   "MATERNITY",
//   "PATERNITY",
//   "COMP_OFF",
// ];

// const LeaveStatuses = ["approved", "pending", "rejected", "cancelled"];


// const LeaveFormAndView = () => {
//   const [form, setForm] = useState({
//     fromDate: "",
//     toDate: "",
//     leaveType: "",
//     applicationNotes: "",
//     otherTypeDescription: "",
//   });

//   const [filter, setFilter] = useState({
//     fromDate: "",
//     toDate: "",
//     status: "",
//     type: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [appliedLeaves, setAppliedLeaves] = useState([]);
//   const [editLeaveId, setEditLeaveId] = useState(null);
//   const [editNotes, setEditNotes] = useState("");
//   const [applying, setApplying] = useState(false);
//   const [leaveBalance, setLeaveBalance] = useState(null);
//   const [showAllLeaves, setShowAllLeaves] = useState(false);
//   const [attachments, setAttachments] = useState([]);
// const [previewUrl, setPreviewUrl] = useState(null);
// const [previewType, setPreviewType] = useState(null);


//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLeaveTypeChange = (e) => {
//     const selected = e.target.value;
//     setForm({
//       ...form,
//       leaveType: selected,
//       applicationNotes: selected === "OTHER" ? "" : form.applicationNotes,
//       otherTypeDescription: selected !== "OTHER" ? "" : form.otherTypeDescription,
//     });
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilter((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleClearFilter = () => {
//     setFilter({
//       fromDate: "",
//       toDate: "",
//       status: "",
//       type: "",
//     });
//     setAppliedLeaves([]);
//     setError("");
//     setMessage("");
//   };

//   const handleViewAllDetails = () => {
//     setFilter({
//       fromDate: "",
//       toDate: "",
//       status: "",
//       type: "",
//     });
//     setError("");
//     setMessage("");
//     fetchAppliedLeaves();
//   };

//   const fetchAppliedLeaves = async () => {
//     const employee_token = localStorage.getItem("employee_token");
//     if (!employee_token) {
//       setError("Authentication token missing. Please login.");
//       setAppliedLeaves([]);
//       return;
//     }

//     const body = {
//       ...(filter.fromDate && { fromDate: filter.fromDate }),
//       ...(filter.toDate && { toDate: filter.toDate }),
//       ...(filter.status && { status: filter.status.toLowerCase() }), // ✅ lowercase
//       ...(filter.type && { type: filter.type.toUpperCase() }),       // ✅ uppercase
//     };

//     console.log("📦 Sending filter body:", body);

//     try {
//       const res = await fetch("https://backend.hrms.transev.site/employee/leave/view", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${employee_token}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (res.ok && data.status === "success") {
//         setAppliedLeaves(data.data);
//         setError("");
//       } else {
//         setError(data.message || "Failed to fetch applied leaves.");
//         setAppliedLeaves([]);
//       }
//     } catch {
//       setError("❌ Failed to fetch applied leaves.");
//       setAppliedLeaves([]);
//     }
//   };
//   const handleEditClick = (leave) => {
//     setEditLeaveId(leave.id);
//     setEditNotes(leave.applicationNotes || leave.otherTypeDescription || "");
//   };

//   const handleCancelEdit = () => {
//     setEditLeaveId(null);
//     setEditNotes("");
//   };

//   const handleUpdateNotes = async () => {
//     const employee_token = localStorage.getItem("employee_token");
//     if (!employee_token) {
//       setError("Authentication token missing. Please login.");
//       return;
//     }

//     try {
//       const response = await fetch("https://backend.hrms.transev.site/employee/leave/edit-notes", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${employee_token}`,
//         },
//         body: JSON.stringify({
//           leaveId: editLeaveId,
//           applicationNotes: editNotes,
//           otherTypeDescription: editNotes,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok && data.status === "success") {
//         setMessage("✅ " + (data.message || "Leave notes updated successfully."));
//         setEditLeaveId(null);
//         setEditNotes("");
//         fetchAppliedLeaves();
//       } else {
//         setError(data.message || "Failed to update notes.");
//       }
//     } catch {
//       setError("❌ Failed to update notes.");
//     }
//   };
//   const handleCancelLeave = async (leaveId) => {
//     const employee_token = localStorage.getItem("employee_token");
//     if (!employee_token) {
//       setError("Authentication token missing. Please login.");
//       return;
//     }

//     const confirmCancel = window.confirm("Are you sure you want to cancel this leave?");
//     if (!confirmCancel) return;

//     try {
//       const res = await fetch("https://backend.hrms.transev.site/employee/leave/cancel", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${employee_token}`,
//         },
//         body: JSON.stringify({ leaveId }),
//       });

//       const data = await res.json();
//       if (res.ok && data.status === "success") {
//         alert("Leave cancelled successfully."); // ✅ basic confirmation
//         setMessage("✅ " + data.message);
//         fetchAppliedLeaves();
//       } else {
//         setError(data.message || "Failed to cancel leave.");
//       }
//     } catch {
//       setError("❌ Failed to cancel leave.");
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     setApplying(true); // ✅ Start loader

//     const { fromDate, toDate, leaveType, applicationNotes, otherTypeDescription } = form;

//     if (!fromDate || !toDate || !leaveType) {
//       setError("Please fill all required fields.");
//       setApplying(false); // ✅ Stop loader on error
//       return;
//     }

//     if (leaveType === "OTHER" && !otherTypeDescription.trim()) {
//       setError("Description is required when leave type is OTHER.");
//       setApplying(false); // ✅ Stop loader on error
//       return;
//     }

//     const payload = {
//       fromDate,
//       toDate,
//       leaveType: [leaveType],
//       applicationNotes: leaveType === "OTHER" ? null : applicationNotes,
//       otherTypeDescription: leaveType === "OTHER" ? otherTypeDescription : null,
//     };

//     const employee_token = localStorage.getItem("employee_token");
//     if (!employee_token) {
//       setError("Authentication token missing. Please login.");
//       setApplying(false); // ✅ Stop loader on error
//       return;
//     }

//     try {
//       const res = await fetch("https://backend.hrms.transev.site/employee/leave/apply", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${employee_token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (res.ok && data.status === "success") {
//   setMessage("✅ " + (data.message || "Leave applied successfully."));
//   setForm({
//     fromDate: "",
//     toDate: "",
//     leaveType: "",
//     applicationNotes: "",
//     otherTypeDescription: "",
//   });
//   setAttachments([]); // Clear attachments
//   fetchAppliedLeaves();

//   // 🔽 Upload attachments if any
//   if (attachments.length > 0) {
//     const formData = new FormData();
//     formData.append("leaveId", data.leaveId || data.data?.id); // Adjust based on actual response

//     attachments.forEach((file) => {
//       formData.append("attachments", file);
//     });

//     try {
//       const uploadRes = await fetch(
//         "https://backend.hrms.transev.site/employee/leave/upload-attachments",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${employee_token}`,
//           },
//           body: formData,
//         }
//       );

//       const uploadData = await uploadRes.json();
//       if (uploadRes.ok && uploadData.status === "success") {
//         console.log("📎 Attachments uploaded:", uploadData.paths);
//       } else {
//         console.warn("⚠️ Attachment upload failed:", uploadData.message);
//       }
//     } catch (err) {
//       console.error("❌ Attachment upload error:", err);
//     }
//   }
// } else {
//   setError(data.message || "Something went wrong.");
// }

//     } catch {
//       setError("❌ Failed to apply. Please try again.");
//     } finally {
//       setApplying(false); // ✅ Stop loader after success/failure
//     }
//   };


//   const fetchLeaveBalance = async () => {
//     const employee_token = localStorage.getItem("employee_token");
//     if (!employee_token) {
//       console.error("Token missing for fetching leave balance.");
//       return;
//     }

//     try {
//       const res = await fetch("https://backend.hrms.transev.site/employee/leave-register", {
//         headers: {
//           Authorization: `Bearer ${employee_token}`,
//         },
//       });

//       const data = await res.json();
//       if (res.ok && data.status === "success") {
//         setLeaveBalance(data.data);
//       } else {
//         console.error("Error fetching leave balance:", data.message);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   // 🔁 Refetch applied leaves when filters change
//   useEffect(() => {
//     fetchAppliedLeaves();
//     fetchLeaveBalance()
//   }, [filter]);


//   return (
//     <div className="flex min-h-screen bg-yellow-50">
//   <div className="w-64">
//     <EmployeeSidebar />
//   </div>

//       <main className="flex-1 ml-10 p-10 max-w-7xl mx-auto">
//         <div className="bg-white shadow-xl border border-yellow-300 rounded-2xl p-10 mb-10">
//           <h1 className="text-3xl font-extrabold text-yellow-900 mb-8 border-b pb-4">
//             Apply for Leave
//           </h1>

//           {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
//           {message && <p className="text-green-700 font-semibold mb-4">{message}</p>}

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end"
//           >
//             {/* Leave Type */}
//             <div>
//               <label className="block text-yellow-800 font-semibold mb-1">
//                 Leave Type <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="leaveType"
//                 value={form.leaveType}
//                 onChange={handleLeaveTypeChange}
//                 className="w-full border border-yellow-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-yellow-400"
//               >
//                 <option value="">Select Type</option>
//                 {EmployeeAllowedLeaveTypes.map((type) => (
//                   <option key={type} value={type.toUpperCase()}>
//                     {type.charAt(0) + type.slice(1).toLowerCase()}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* From Date */}
//             <div>
//               <label className="block text-yellow-800 font-semibold mb-1">
//                 From Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="fromDate"
//                 value={form.fromDate}
//                 onChange={handleChange}
//                 className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400"
//               />
//             </div>

//             {/* To Date */}
//             <div>
//               <label className="block text-yellow-800 font-semibold mb-1">
//                 To Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="toDate"
//                 value={form.toDate}
//                 onChange={handleChange}
//                 className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400"
//               />
//             </div>
// {/* File Attachments */}
// <div className="md:col-span-2">
//   <label className="block text-yellow-800 font-semibold mb-1">
//     Attachments (Max 5 files)
//   </label>
//   <input
//     type="file"
//     multiple
//     onChange={(e) => {
//       const selectedFiles = Array.from(e.target.files);
//       if (selectedFiles.length > 5) {
//         alert("You can only upload up to 5 files.");
//         return;
//       }
//       setAttachments(selectedFiles);
//     }}
//     className="w-full border border-yellow-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-yellow-400"
//   />
// </div>

//             {/* Reason or Other Description */}
//             {form.leaveType === "OTHER" ? (
//               <div>
//                 <label className="block text-yellow-800 font-semibold mb-1">
//                   Other Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="otherTypeDescription"
//                   value={form.otherTypeDescription}
//                   onChange={(e) => {
//                     handleChange(e);
//                     e.target.style.height = "auto";
//                     e.target.style.height = e.target.scrollHeight + "px";
//                   }}
//                   className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 overflow-hidden resize-none"
//                   style={{ minHeight: "60px" }}
//                 ></textarea>

//               </div>
//             ) : (
//               <div>
//                 <label className="block text-yellow-800 font-semibold mb-1">
//                   Reason <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="applicationNotes"
//                   value={form.applicationNotes}
//                   onChange={(e) => {
//                     handleChange(e);
//                     e.target.style.height = "auto"; // Reset height
//                     e.target.style.height = e.target.scrollHeight + "px"; // Set new height
//                   }}
//                   className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 overflow-hidden resize-none"
//                   style={{ minHeight: "60px" }}
//                 ></textarea>

//               </div>
//             )}

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={applying}
//                 className={`w-full ${applying ? "bg-yellow-300" : "bg-yellow-400 hover:bg-yellow-500"} text-yellow-900 font-bold py-3 px-6 rounded-md shadow transition-all`}
//               >
//                 {applying ? "Applying..." : "Apply"}
//               </button>
//             </div>

//           </form>
//         </div>


//         {/* View Applied Leaves */}
//         <div className="bg-white shadow-xl border border-yellow-300 rounded-2xl p-10">
//           <h2 className="text-2xl font-bold mb-6 text-yellow-900">View Applied Leaves</h2>

//           <div className="flex flex-wrap gap-4 mb-6 items-end">
//             <div>
//               <label className="block font-semibold text-yellow-800 mb-1">From Date</label>
//               <input
//                 type="date"
//                 name="fromDate"
//                 value={filter.fromDate}
//                 onChange={handleFilterChange}
//                 className="border border-yellow-300 rounded-md px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block font-semibold text-yellow-800 mb-1">To Date</label>
//               <input
//                 type="date"
//                 name="toDate"
//                 value={filter.toDate}
//                 onChange={handleFilterChange}
//                 className="border border-yellow-300 rounded-md px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block font-semibold text-yellow-800 mb-1">Status</label>
//               <select
//                 name="status"
//                 value={filter.status}
//                 onChange={handleFilterChange}
//                 className="border border-yellow-300 rounded-md px-3 py-2"
//               >
//                 <option value="">All</option>
//                 {LeaveStatuses.map((status) => (
//                   <option key={status} value={status.toLowerCase()}>
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block font-semibold text-yellow-800 mb-1">Type</label>
//               <select
//                 name="type"
//                 value={filter.type}
//                 onChange={handleFilterChange}
//                 className="border border-yellow-300 rounded-md px-3 py-2"
//               >
//                 <option value="">All</option>
//                 {EmployeeAllowedLeaveTypes.map((type) => (
//                   <option key={type} value={type.toUpperCase()}>
//                     {type.charAt(0) + type.slice(1).toLowerCase()}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Below existing filters */}
//             <div className="flex gap-4 mt-4">
//               <button
//                 onClick={handleClearFilter}
//                 className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400"
//               >
//                 Clear Filter
//               </button>
//             </div>
//           </div>

//           {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

//           {appliedLeaves.length === 0 && !error && <p>No leave records found.</p>}

//           {appliedLeaves.length > 0 && (
//             <table className="min-w-full bg-white border border-yellow-300 rounded-lg">
//               <thead>
//                 <tr className="bg-yellow-100 text-yellow-900">
//                   <th className="py-2 px-4 border border-yellow-300">From Date</th>
//                   <th className="py-2 px-4 border border-yellow-300">To Date</th>
//                   <th className="py-2 px-4 border border-yellow-300">Type</th>
//                   <th className="py-2 px-4 border border-yellow-300">Status</th>
//                   <th className="py-2 px-4 border border-yellow-300">Notes</th>
//                 </tr>
//               </thead>
//               {message && (
//                 <p className="text-green-700 font-semibold mb-4">
//                   {message}
//                 </p>
//               )}

//               <tbody>
//                 {appliedLeaves.map((leave, idx) => (
//                   <tr
//                     key={leave.id}
//                     className={`${idx % 2 === 0 ? "bg-yellow-50" : "bg-yellow-100"
//                       } hover:bg-yellow-200 transition-colors duration-150`}
//                   >
//                     <td className="py-3 px-4 border border-yellow-300 font-medium text-gray-700">
//                       {leave.fromDate || "-"}
//                     </td>
//                     <td className="py-3 px-4 border border-yellow-300 font-medium text-gray-700">
//                       {leave.toDate || "-"}
//                     </td>
//                     <td className="py-3 px-4 border border-yellow-300 font-medium text-gray-700">
//                       {leave.leaveType?.join(", ") || "-"}
//                     </td>
//                     <td className="py-3 px-4 border border-yellow-300">
//                       <span
//                         className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${leave.status === "cancelled"
//                           ? "bg-red-200 text-red-800"
//                           : leave.status === "approved"
//                             ? "bg-green-200 text-green-800"
//                             : "bg-yellow-200 text-yellow-800"
//                           }`}
//                       >
//                         {leave.status || "-"}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 border border-yellow-300 text-gray-700">
//                       {editLeaveId === leave.id ? (
//                         <div className="space-y-2">
//                           <textarea
//                             value={editNotes}
//                             onChange={(e) => setEditNotes(e.target.value)}
//                             rows={2}
//                             className="w-full border border-yellow-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                           />
//                           <div className="flex gap-2">
//                             <button
//                               onClick={handleUpdateNotes}
//                               className="bg-green-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-green-600 transition"
//                             >
//                               ✅ Save
//                             </button>
//                             <button
//                               onClick={handleCancelEdit}
//                               className="bg-gray-400 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-500 transition"
//                             >
//                               ❌ Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
//                           <span className="text-sm leading-relaxed">
//                             {leave.applicationNotes || leave.otherTypeDescription || "-"}
//                           </span>

//                           {/* 👇 Only show buttons if not cancelled */}
//                           {leave.status !== "cancelled" && (
//                             <div className="flex gap-2 mt-1 md:mt-0">
//                               <button
//                                 onClick={() => handleEditClick(leave)}
//                                 className="inline-flex items-center px-4 py-1.5 text-sm font-semibold text-yellow-900 bg-yellow-400 rounded-md shadow-sm hover:bg-yellow-500 hover:shadow-md transition-all duration-200"
//                               >
//                                 ✏️ Edit
//                               </button>
//                               <button
//                                 onClick={() => handleCancelLeave(leave.id)}
//                                 className="inline-flex items-center px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 rounded-md shadow-sm hover:bg-red-200 hover:shadow-md transition-all duration-200"
//                               >
//                                 ❌ Cancel
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>



//             </table>
//           )}
//         </div>

//         {/* Available Leaves Section */}
//         {leaveBalance && (
//           <div className="bg-white shadow-xl border border-yellow-300 rounded-2xl p-8 mt-10">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-yellow-900">Available Leaves</h2>
//               <button
//                 onClick={() => setShowAllLeaves(!showAllLeaves)}
//                 className="text-sm font-semibold text-yellow-800 border border-yellow-400 px-4 py-1.5 rounded hover:bg-yellow-100 transition"
//               >
//                 {showAllLeaves ? "🔽 Show Only Active" : "📋 Show All Types"}
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {Object.entries(leaveBalance).map(([key, value]) => {
//                 if (["grandTotal", "lastResetYear", "updatedAt"].includes(key)) return null;

//                 const total = value.current + value.carried;
//                 if (!showAllLeaves && total === 0) return null;

//                 return (
//                   <div key={key} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-yellow-700 font-bold text-sm">
//                         {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toUpperCase()}
//                       </span>
//                       <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
//                         Total: {total}
//                       </span>
//                     </div>
//                     <div className="text-sm text-yellow-800 space-y-1">
//                       <p>✅ Current: <span className="font-semibold">{value.current}</span></p>
//                       <p>♻️ Carried: <span className="font-semibold">{value.carried}</span></p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="bg-yellow-100 mt-6 p-4 rounded-xl border-t border-yellow-300">
//               <div className="flex flex-wrap justify-between items-center text-yellow-900 font-semibold">
//                 <p>🏁 <span className="font-bold">Grand Total:</span> {leaveBalance.grandTotal}</p>
//                 <p>📅 <span className="font-bold">Last Reset Year:</span> {leaveBalance.lastResetYear}</p>
//                 <p className="text-sm text-yellow-700">
//                   ⏱️ Last Updated: {new Date(leaveBalance.updatedAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           </div>

//         )}


//       </main>
//     </div>
//   );
// };

// export default LeaveFormAndView;

import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../../components/Common/EmployeeSidebar";

const EmployeeAllowedLeaveTypes = [
  "CASUAL",
  "SICK",
  "BEREAVEMENT",
  "OTHER",
  "MATERNITY",
  "PATERNITY",
  "COMP_OFF",
];

const LeaveStatuses = ["approved", "pending", "rejected", "cancelled"];


const LeaveFormAndView = () => {
  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "",
    applicationNotes: "",
    otherTypeDescription: "",
  });

  const [filter, setFilter] = useState({
    fromDate: "",
    toDate: "",
    status: "",
    type: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [editLeaveId, setEditLeaveId] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [applying, setApplying] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [showAllLeaves, setShowAllLeaves] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
const [generatedLeaveId, setGeneratedLeaveId] = useState(null); // New - Line 47
const [selectedFiles, setSelectedFiles] = useState([]);         // New - Line 48
const [uploading, setUploading] = useState(false);              // New - Line 49



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAttachments([]);

  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [...attachments, ...files];

    if (newFiles.length > 5) {
      alert("You can upload a maximum of 5 attachments.");
      return;
    }

    setAttachments(newFiles);
  };
  const removeAttachment = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  const handleLeaveTypeChange = (e) => {
    const selected = e.target.value;
    setForm({
      ...form,
      leaveType: selected,
      applicationNotes: selected === "OTHER" ? "" : form.applicationNotes,
      otherTypeDescription: selected !== "OTHER" ? "" : form.otherTypeDescription,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilter = () => {
    setFilter({
      fromDate: "",
      toDate: "",
      status: "",
      type: "",
    });
    setAppliedLeaves([]);
    setError("");
    setMessage("");
  };

  const handleViewAllDetails = () => {
    setFilter({
      fromDate: "",
      toDate: "",
      status: "",
      type: "",
    });
    setError("");
    setMessage("");
    fetchAppliedLeaves();

  };

  const fetchAppliedLeaves = async () => {
    const employee_token = localStorage.getItem("employee_token");
    if (!employee_token) {
      setError("Authentication token missing. Please login.");
      setAppliedLeaves([]);
      return;
    }

    const body = {
      ...(filter.fromDate && { fromDate: filter.fromDate }),
      ...(filter.toDate && { toDate: filter.toDate }),
      ...(filter.status && { status: filter.status.toLowerCase() }), // ✅ lowercase
      ...(filter.type && { type: filter.type.toUpperCase() }),       // ✅ uppercase
    };

    console.log("📦 Sending filter body:", body);

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/leave/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employee_token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setAppliedLeaves(data.data);
        setError("");
      } else {
        setError(data.message || "Failed to fetch applied leaves.");
        setAppliedLeaves([]);
      }
    } catch {
      setError("❌ Failed to fetch applied leaves.");
      setAppliedLeaves([]);
    }
  };
  const handleEditClick = (leave) => {
    setEditLeaveId(leave.id);
    setEditNotes(leave.applicationNotes || leave.otherTypeDescription || "");
  };

  const handleCancelEdit = () => {
    setEditLeaveId(null);
    setEditNotes("");
  };

  const handleUpdateNotes = async () => {
    const employee_token = localStorage.getItem("employee_token");
    if (!employee_token) {
      setError("Authentication token missing. Please login.");
      return;
    }

    try {
      const response = await fetch("https://backend.hrms.transev.site/employee/leave/edit-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employee_token}`,
        },
        body: JSON.stringify({
          leaveId: editLeaveId,
          applicationNotes: editNotes,
          otherTypeDescription: editNotes,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        setMessage("✅ " + (data.message || "Leave notes updated successfully."));
        setEditLeaveId(null);
        setEditNotes("");
        fetchAppliedLeaves();
      } else {
        setError(data.message || "Failed to update notes.");
      }
    } catch {
      setError("❌ Failed to update notes.");
    }
  };
  const handleCancelLeave = async (leaveId) => {
    const employee_token = localStorage.getItem("employee_token");
    if (!employee_token) {
      setError("Authentication token missing. Please login.");
      return;
    }

    const confirmCancel = window.confirm("Are you sure you want to cancel this leave?");
    if (!confirmCancel) return;

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/leave/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employee_token}`,
        },
        body: JSON.stringify({ leaveId }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        alert("Leave cancelled successfully."); // ✅ basic confirmation
        setMessage("✅ " + data.message);
        fetchAppliedLeaves();
      } else {
        setError(data.message || "Failed to cancel leave.");
      }
    } catch {
      setError("❌ Failed to cancel leave.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setApplying(true); // ✅ Start loader

    const { fromDate, toDate, leaveType, applicationNotes, otherTypeDescription } = form;

    if (!fromDate || !toDate || !leaveType) {
      setError("Please fill all required fields.");
      setApplying(false); // ✅ Stop loader on error
      return;
    }

    if (leaveType === "OTHER" && !otherTypeDescription.trim()) {
      setError("Description is required when leave type is OTHER.");
      setApplying(false); // ✅ Stop loader on error
      return;
    }

    const payload = {
      fromDate,
      toDate,
      leaveType: [leaveType],
      applicationNotes: leaveType === "OTHER" ? null : applicationNotes,
      otherTypeDescription: leaveType === "OTHER" ? otherTypeDescription : null,
    };

    const employee_token = localStorage.getItem("employee_token");
    if (!employee_token) {
      setError("Authentication token missing. Please login.");
      setApplying(false); // ✅ Stop loader on error
      return;
    }

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employee_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMessage("✅ " + (data.message || "Leave applied successfully."));
        setForm({
          fromDate: "",
          toDate: "",
          leaveType: "",
          applicationNotes: "",
          otherTypeDescription: "",
        });
        setAttachments([]); // Clear attachments
        fetchAppliedLeaves();
        // 🔽 Upload attachments if any
        if (attachments.length > 0) {
          const formData = new FormData();
          formData.append("leaveId", data.leaveId || data.data?.id); // adjust based on response

          attachments.forEach((file) => {
            formData.append("attachments", file);
          });

          try {
            const uploadRes = await fetch(
              "https://backend.hrms.transev.site/employee/leave/upload-attachments",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${employee_token}`,
                },
                body: formData,
              }
            );

            const uploadData = await uploadRes.json();
            if (uploadRes.ok && uploadData.status === "success") {
              console.log("📎 Attachments uploaded:", uploadData.paths);
            } else {
              console.warn("⚠️ Attachment upload failed:", uploadData.message);
            }
          } catch (err) {
            console.error("❌ Attachment upload error:", err);
          }
        }

        // 🔽 Upload attachments if any
        if (attachments.length > 0) {
          const formData = new FormData();
          formData.append("leaveId", data.leaveId || data.data?.id); // Adjust based on actual response

          attachments.forEach((file) => {
            formData.append("attachments", file);
          });

          try {
            const uploadRes = await fetch(
              "https://backend.hrms.transev.site/employee/leave/upload-attachments",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${employee_token}`,
                },
                body: formData,
              }
            );

            const uploadData = await uploadRes.json();
            if (uploadRes.ok && uploadData.status === "success") {
              console.log("📎 Attachments uploaded:", uploadData.paths);
            } else {
              console.warn("⚠️ Attachment upload failed:", uploadData.message);
            }
          } catch (err) {
            console.error("❌ Attachment upload error:", err);
          }
        }
      } else {
        setError(data.message || "Something went wrong.");
      }

    } catch {
      setError("❌ Failed to apply. Please try again.");
    } finally {
      setApplying(false); // ✅ Stop loader after success/failure
    }
  };


  const fetchLeaveBalance = async () => {
    const employee_token = localStorage.getItem("employee_token");
    if (!employee_token) {
      console.error("Token missing for fetching leave balance.");
      return;
    }

    try {
      const res = await fetch("https://backend.hrms.transev.site/employee/leave-register", {
        headers: {
          Authorization: `Bearer ${employee_token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setLeaveBalance(data.data);
      } else {
        console.error("Error fetching leave balance:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 🔁 Refetch applied leaves when filters change
  useEffect(() => {
    fetchAppliedLeaves();
    fetchLeaveBalance()
  }, [filter]);


  return (
    <div className="flex min-h-screen bg-yellow-50">
      <div className="w-64">
        <EmployeeSidebar />
      </div>

      <main className="flex-1 ml-10 p-10 max-w-7xl mx-auto">
        <div className="bg-white shadow-xl border border-yellow-300 rounded-2xl p-10 mb-10">
          <h1 className="text-3xl font-extrabold text-yellow-900 mb-8 border-b pb-4">
            Apply for Leave
          </h1>

          {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
          {message && <p className="text-green-700 font-semibold mb-4">{message}</p>}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end"
          >
            {/* Leave Type */}
            <div>
              <label className="block text-yellow-800 font-semibold mb-1">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleLeaveTypeChange}
                className="w-full border border-yellow-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Type</option>
                {EmployeeAllowedLeaveTypes.map((type) => (
                  <option key={type} value={type.toUpperCase()}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-yellow-800 font-semibold mb-1">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-yellow-800 font-semibold mb-1">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            {/* File Attachments */}
            {/* Attachment Upload */}
            <div className="md:col-span-2">
              <label className="block text-yellow-800 font-semibold mb-1">
                Attachments (Max: 5)
              </label>

              {/* Dynamic input box: show new file input until 5 files are selected */}
              {attachments.length < 5 && (
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border border-yellow-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-yellow-400 mb-2"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
              )}

              {/* List selected attachments */}
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-yellow-100 border border-yellow-300 rounded-md px-3 py-1 text-sm"
                  >
                    <span className="truncate w-3/4 text-gray-800">Attachment {index + 1}: {file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>


            {/* Reason or Other Description */}
            {form.leaveType === "OTHER" ? (
              <div>
                <label className="block text-yellow-800 font-semibold mb-1">
                  Other Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="otherTypeDescription"
                  value={form.otherTypeDescription}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 overflow-hidden resize-none"
                  style={{ minHeight: "60px" }}
                ></textarea>

              </div>
            ) : (
              <div>
                <label className="block text-yellow-800 font-semibold mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="applicationNotes"
                  value={form.applicationNotes}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.style.height = "auto"; // Reset height
                    e.target.style.height = e.target.scrollHeight + "px"; // Set new height
                  }}
                  className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 overflow-hidden resize-none"
                  style={{ minHeight: "60px" }}
                ></textarea>

              </div>
            )}


            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={applying}
                className={`w-full ${applying ? "bg-yellow-300" : "bg-yellow-400 hover:bg-yellow-500"} text-yellow-900 font-bold py-3 px-6 rounded-md shadow transition-all`}
              >
                {applying ? "Applying..." : "Apply"}
              </button>
            </div>

          </form>
        </div>


        {/* View Applied Leaves */}
        <div className="bg-white shadow-xl border border-yellow-300 rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-6 text-yellow-900">View Applied Leaves</h2>

          <div className="flex flex-wrap gap-4 mb-6 items-end">
            <div>
              <label className="block font-semibold text-yellow-800 mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={filter.fromDate}
                onChange={handleFilterChange}
                className="border border-yellow-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-yellow-800 mb-1">To Date</label>
              <input
                type="date"
                name="toDate"
                value={filter.toDate}
                onChange={handleFilterChange}
                className="border border-yellow-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-yellow-800 mb-1">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="border border-yellow-300 rounded-md px-3 py-2"
              >
                <option value="">All</option>
                {LeaveStatuses.map((status) => (
                  <option key={status} value={status.toLowerCase()}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-yellow-800 mb-1">Type</label>
              <select
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
                className="border border-yellow-300 rounded-md px-3 py-2"
              >
                <option value="">All</option>
                {EmployeeAllowedLeaveTypes.map((type) => (
                  <option key={type} value={type.toUpperCase()}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            {/* Below existing filters */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleClearFilter}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400"
              >
                Clear Filter
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

          {appliedLeaves.length === 0 && !error && <p>No leave records found.</p>}

          {appliedLeaves.length > 0 && (
            <table className="min-w-full bg-white border border-yellow-300 rounded-lg">
              <thead>
                <tr className="bg-yellow-100 text-yellow-900">
                  <th className="py-2 px-4 border border-yellow-300">From Date</th>
                  <th className="py-2 px-4 border border-yellow-300">To Date</th>
                  <th className="py-2 px-4 border border-yellow-300">Type</th>
                  <th className="py-2 px-4 border border-yellow-300">Status</th>
                  <th className="py-2 px-4 border border-yellow-300">Attachments</th>
                  <th className="py-2 px-4 border border-yellow-300">Notes</th>
                </tr>
              </thead>
              {message && (
                <p className="text-green-700 font-semibold mb-4">
                  {message}
                </p>
              )}

              <tbody>
                 {appliedLeaves.map((leave, idx) => (
                 
                  <tr
                    key={leave.id}
                    className={`${idx % 2 === 0 ? "bg-yellow-50" : "bg-yellow-100"
                      } hover:bg-yellow-200 transition-colors duration-150`}
                  >
                    <td className="py-3 px-4 border border-yellow-300 font-medium text-gray-700">
                      {leave.fromDate || "-"}
                    </td>
                    <td className="py-3 px-4 border border-yellow-300 font-medium text-gray-700">
                      {leave.toDate || "-"}
                    </td>
                    <td className="py-3 px-4 border border-yellow-300 font-medium text-gray-700">
                      {leave.leaveType?.join(", ") || "-"}
                    </td>
                    <td className="py-3 px-4 border border-yellow-300">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${leave.status === "cancelled"
                          ? "bg-red-200 text-red-800"
                          : leave.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                          }`}
                      >
                        {leave.status || "-"}
                      </span>
                    </td>
{/*                    <td className="py-3 px-4 border border-yellow-300 text-blue-600">
  {Array.isArray(leave.attachments) && leave.attachments.length > 0 ? (
    <div className="flex flex-col gap-1">
      {leave.attachments.map((fileUrl, i) => {
        const fileName = fileUrl?.split("/").pop();
        const fullUrl = fileUrl?.startsWith("/")
          ? `https://backend.hrms.transev.site${fileUrl}`
          : fileUrl;

        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
        const isPDF = /\.pdf$/i.test(fileName);

        return (
          <button
            key={i}
            onClick={() => {
              setPreviewUrl(fullUrl);
              setPreviewType(isImage ? "image" : isPDF ? "pdf" : "other");
            }}
            className="text-blue-600 underline text-sm hover:text-blue-800 transition"
          >
            📎 {fileName}
          </button>
        );
      })}
    </div>
  ) : (
    <span className="text-gray-500 text-sm">No attachments</span>
  )}
</td> */}


                    <td className="py-3 px-4 border border-yellow-300 text-sm text-blue-700">
                      {leave.attachments && leave.attachments.length > 0 ? (
                        leave.attachments.map((fileUrl, idx) => (
                          <div key={idx}>
                            <a
                              href={`https://backend.hrms.transev.site${fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-blue-600"
                            >
                              Attachment {idx + 1}
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">No Files</span>
                      )}
                    </td>

                    <td className="py-3 px-4 border border-yellow-300 text-gray-700">
                      {editLeaveId === leave.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            rows={2}
                            className="w-full border border-yellow-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdateNotes}
                              className="bg-green-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-green-600 transition"
                            >
                              ✅ Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-400 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-500 transition"
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <span className="text-sm leading-relaxed">
                            {leave.applicationNotes || leave.otherTypeDescription || "-"}
                          </span>

                          {/* 👇 Only show buttons if not cancelled */}
                          {leave.status !== "cancelled" && (
                            <div className="flex gap-2 mt-1 md:mt-0">
                              <button
                                onClick={() => handleEditClick(leave)}
                                className="inline-flex items-center px-4 py-1.5 text-sm font-semibold text-yellow-900 bg-yellow-400 rounded-md shadow-sm hover:bg-yellow-500 hover:shadow-md transition-all duration-200"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleCancelLeave(leave.id)}
                                className="inline-flex items-center px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 rounded-md shadow-sm hover:bg-red-200 hover:shadow-md transition-all duration-200"
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>



            </table>
          )}
        </div>

        {/* Available Leaves Section */}
        {leaveBalance && (
          <div className="bg-white shadow-xl border border-yellow-300 rounded-2xl p-8 mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-900">Available Leaves</h2>
              <button
                onClick={() => setShowAllLeaves(!showAllLeaves)}
                className="text-sm font-semibold text-yellow-800 border border-yellow-400 px-4 py-1.5 rounded hover:bg-yellow-100 transition"
              >
                {showAllLeaves ? "🔽 Show Only Active" : "📋 Show All Types"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(leaveBalance).map(([key, value]) => {
                if (["grandTotal", "lastResetYear", "updatedAt"].includes(key)) return null;

                const total = value.current + value.carried;
                if (!showAllLeaves && total === 0) return null;

                return (
                  <div key={key} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-700 font-bold text-sm">
                        {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                        Total: {total}
                      </span>
                    </div>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <p>✅ Current: <span className="font-semibold">{value.current}</span></p>
                      <p>♻️ Carried: <span className="font-semibold">{value.carried}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-yellow-100 mt-6 p-4 rounded-xl border-t border-yellow-300">
              <div className="flex flex-wrap justify-between items-center text-yellow-900 font-semibold">
                <p>🏁 <span className="font-bold">Grand Total:</span> {leaveBalance.grandTotal}</p>
                <p>📅 <span className="font-bold">Last Reset Year:</span> {leaveBalance.lastResetYear}</p>
                <p className="text-sm text-yellow-700">
                  ⏱️ Last Updated: {new Date(leaveBalance.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

        )}
        {previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full relative">
              <button
                onClick={() => setPreviewUrl(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
              >
                ✖
              </button>
              <h2 className="text-lg font-bold mb-4 text-yellow-900">Attachment Preview</h2>

              {previewType === "image" ? (
                <img src={previewUrl} alt="attachment" className="max-h-[500px] w-auto mx-auto rounded" />
              ) : previewType === "pdf" ? (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  className="w-full h-[500px] rounded border"
                />
              ) : (
                <div className="text-sm text-gray-600">
                  Cannot preview this file type.{" "}
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default LeaveFormAndView;

