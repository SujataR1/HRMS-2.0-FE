// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import HRSidebar from "../../components/Common/HRSidebar";
// import dayjs from "dayjs";

// const PAYMENT_OPTIONS = ["PAID", "UNPAID", "LOP", "COMP_OFF"];
// const CONFLICTING_COMBOS = [
//     ["PAID", "UNPAID"],
//     ["PAID", "LOP"],
//     ["COMP_OFF", "UNPAID"],
//     ["COMP_OFF", "LOP"],
// ];

// const HRLeaveApprovals = () => {
//     const navigate = useNavigate();
//     const [pendingLeaves, setPendingLeaves] = useState([]);
//     const [leaveDetails, setLeaveDetails] = useState(null);
//     const [action, setAction] = useState("approved");
//     const [paymentStatuses, setPaymentStatuses] = useState([]);
//     const [error, setError] = useState("");
//     const [validationError, setValidationError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [leaveLoading, setLeaveLoading] = useState(false);
//     const [searching, setSearching] = useState(false);
//     const [processedLeaveIds, setProcessedLeaveIds] = useState([]);

//     const [searchParams, setSearchParams] = useState({
//         employeeId: "",
//         fromDate: "",
//         toDate: "",
//         status: "",
//         type: "",
//     });
//     const [searchResults, setSearchResults] = useState([]);
//     // NEW: State for all leaves and toggle
//     const [allLeaves, setAllLeaves] = useState([]);
//     const [showAllLeaves, setShowAllLeaves] = useState(false);

//     // Outside useEffect
//     const fetchPendingLeaves = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get("https://backend.hrms.transev.site/hr/leaves/pending", {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//                 },
//             });

//             if (response.data.status === "success") {
//                 const leaveIds = response?.data?.data?.leaveIds || [];

//                 if (leaveIds.length > 0) {
//                     const detailsRes = await axios.post(
//                         "https://backend.hrms.transev.site/hr/leave/view",
//                         { leaveIds },
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//                             },
//                         }
//                     );

//                     // ✅ Filter only pending status leaves
//                     const allLeaves = detailsRes?.data?.data || [];
//                     const pendingOnly = allLeaves.filter((leave) => leave.status === "pending");
//                     setPendingLeaves(pendingOnly);
//                 } else {
//                     setPendingLeaves([]);
//                 }
//             } else {
//                 setError("Failed to fetch pending leaves.");
//             }
//         } catch (err) {
//             console.error(err);
//             setError("Failed to fetch pending leaves.");
//         } finally {
//             setLoading(false);

//         }
//     };
//     useEffect(() => {
//         fetchPendingLeaves(); // initial call
//         const intervalId = setInterval(fetchPendingLeaves, 10000);
//         return () => clearInterval(intervalId);
//     }, []);




//     const closeModal = () => {
//         setLeaveDetails(null);
//         setValidationError("");
//         setError("");
//         setPaymentStatuses([]);
//     };

//     const fetchLeaveDetails = async (identifier) => {
//         setLeaveLoading(true);
//         try {
//             let requestBody = {};

//             // If it's a UUID, treat as leaveId; else assume it's employeeId
//             const isUUID = /^[0-9a-fA-F-]{36}$/.test(identifier);

//             if (isUUID) {
//                 requestBody.leaveIds = [identifier]; // wrap in array!
//             } else {
//                 requestBody.employeeId = identifier;
//             }

//             const response = await axios.post(
//                 "https://backend.hrms.transev.site/hr/leave/view",
//                 requestBody,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//                     },
//                 }
//             );

//             const data = response.data.data;

//             if (Array.isArray(data) && data.length > 0) {
//                 // If using leaveIds, pick the correct one directly
//                 if (isUUID) {
//                     const found = data.find((leave) => leave.id === identifier);
//                     setLeaveDetails(found || data[0]); // fallback
//                 } else {
//                     setLeaveDetails(data[0]); // First matching leave
//                 }

//                 setError("");
//                 setValidationError("");
//                 setPaymentStatuses([]);
//             } else {
//                 setLeaveDetails(null);
//                 setError("No leave details found.");
//             }
//         } catch (err) {
//             console.error(err);
//             setError("Failed to fetch leave details.");
//         } finally {
//             setLeaveLoading(false);
//         }
//     };



//     const isConflictingCombo = (selected) => {
//         return CONFLICTING_COMBOS.some((combo) =>
//             combo.every((item) => selected.includes(item))
//         );
//     };

//     const handlePaymentChange = (e) => {
//         const selected = [...e.target.selectedOptions].map((o) => o.value);
//         if (isConflictingCombo(selected)) {
//             setValidationError("Selected payment statuses conflict with each other.");
//         } else {
//             setValidationError("");
//         }
//         setPaymentStatuses(selected);
//     };



//     const handleApproveOrReject = async () => {
//         if (validationError) {
//             alert("Please resolve the payment status conflict before submitting.");
//             return;
//         }

//         const selectedAction = leaveDetails?.status?.toLowerCase();

//         if (!["approved", "rejected"].includes(selectedAction)) {
//             alert("Please select a valid status (approved/rejected).");
//             return;
//         }

//         if (selectedAction === "approved" && paymentStatuses.length === 0) {
//             alert("At least one payment status must be selected when approving.");
//             return;
//         }

//         setLeaveLoading(true);
//         try {
//             const response = await axios.patch(
//                 "https://backend.hrms.transev.site/hr/leave/act",
//                 {
//                     leaveId: leaveDetails.id,
//                     action: selectedAction,
//                     paymentStatuses,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//                     },
//                 }
//             );

//             if (response.data.status === "success") {
//                 alert(response.data.data.message || "Leave updated successfully.");

//                 // ✅ Remove this leave from the pendingLeaves immediately
//                 setPendingLeaves((prev) =>
//                     prev.filter((leave) => leave.id !== leaveDetails.id)
//                 );

//                 setProcessedLeaveIds((prev) => [...prev, leaveDetails.id]);
//                 setLeaveDetails(null);
//                 setPaymentStatuses([]);

//                 // Optional: refresh from server to sync
//                 await fetchPendingLeaves();
//             } else {
//                 setError(response.data.message || "Action failed.");
//             }
//         } catch {
//             setError("Failed to update leave.");
//         } finally {
//             setLeaveLoading(false);
//         }

//     };



//     const handleSearchChange = (e) => {
//         const { name, value } = e.target;
//         setSearchParams((prev) => ({ ...prev, [name]: value }));
//     };
//     const clearFilters = () => {
//         setSearchParams({});          // Clears all input fields
//         setSearchResults([]);         // Clears any previous results
//         setShowAllLeaves(false);      // Hide "All Details" if it was showing
//     };
//     const handleSearchSubmit = async (e) => {

//         e.preventDefault();
//         setSearching(true); // Start searching
//         setShowAllLeaves(false); // Hide all leaves view on search
//         try {
//             const response = await axios.post(
//                 "https://backend.hrms.transev.site/hr/leave/view",
//                 {
//                     ...Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v)),
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//                     },
//                 }
//             );
//             setSearchResults(response.data.data || []);
//         } catch {
//             alert("Failed to fetch search results.");
//         }
//         finally {
//             setSearching(false); // End searching
//         }

//     };
//     // NEW: Fetch all leaves (all statuses)
//     const fetchAllLeaveDetails = async () => {
//         setLoading(true);
//         setSearchResults([]); // Clear previous search results
//         try {
//             // Fetch all leaves for all employees or filtered, here just fetch all (or can add filters)
//             // You may want to pass an empty object to fetch all leaves
//             const response = await axios.post(
//                 "https://backend.hrms.transev.site/hr/leave/view",
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
//                     },
//                 }
//             );

//             if (response.data.status === "success") {
//                 setAllLeaves(response.data.data || []);
//                 setShowAllLeaves(true);
//                 setSearchResults([]);
//             } else {
//                 setError("Failed to fetch all leaves.");
//             }
//         } catch (err) {
//             console.error(err);
//             setError("Failed to fetch all leaves.");
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         <div className="flex bg-gray-100 min-h-screen">
//             <HRSidebar />

//             <div className="ml-64 p-8 w-full">
//                 <h1 className="text-3xl font-bold text-yellow-500 mb-8">HR Leave Approvals</h1>

//                 {/* PENDING LEAVES */}
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Pending Leaves</h2>
//                     {loading ? (
//                         <p className="text-gray-600">Loading pending leaves...</p>
//                     ) : pendingLeaves.length === 0 ? (
//                         <p className="text-gray-500">No pending leaves.</p>
//                     ) : (
//                         <ul className="space-y-4">
//                             {pendingLeaves.map((leave) => (
//                                 <li
//                                     key={leave.id}
//                                     className="bg-yellow-100 border border-yellow-300 p-4 rounded flex justify-between items-center"
//                                 >
//                                     <span className="font-medium text-gray-800">
//                                         {leave.employeeName || "Unknown"} ({leave.employeeId})
//                                     </span>
//                                     <button
//                                         onClick={() => fetchLeaveDetails(leave.id)} // passes leaveId
//                                         className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
//                                     >
//                                         View Details
//                                     </button>
//                                 </li>
//                             ))}

//                         </ul>
//                     )}
//                 </div>

//                 {/* LEAVE DETAILS */}
//                 {leaveDetails && (
//                     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//                         <div className="bg-white w-[90%] md:w-[600px] rounded-lg shadow-lg relative p-6">
//                             <button
//                                 onClick={closeModal}
//                                 className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
//                             >
//                                 ✖
//                             </button>

//                             <h2 className="text-2xl font-semibold text-yellow-600 mb-6">Leave Details</h2>

//                             <div className="space-y-4 text-sm text-gray-800">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1">Employee</label>
//                                         <p className="p-2 border border-gray-300 rounded bg-gray-50">
//                                             {leaveDetails.employeeId} - {leaveDetails.employeeName || "N/A"}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1">From</label>
//                                         <p className="p-2 border border-gray-300 rounded bg-gray-50">
//                                             {dayjs(leaveDetails.fromDate).format("MMM D, YYYY")}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1">To</label>
//                                         <p className="p-2 border border-gray-300 rounded bg-gray-50">
//                                             {dayjs(leaveDetails.toDate).format("MMM D, YYYY")}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1">Leave Type</label>
//                                         <select
//                                             value={leaveDetails.leaveType}
//                                             disabled
//                                             className="w-full border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
//                                         >
//                                             <option value={leaveDetails.leaveType}>{leaveDetails.leaveType}</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1">Payment Status</label>
//                                         <select
//                                             name="paymentStatus"
//                                             value={searchParams.paymentStatus || ""}
//                                             onChange={handlePaymentChange}
//                                             className="w-full border border-yellow-400 rounded p-2 focus:outline-yellow-500"
//                                         >
//                                             <option value="">Select Payment Status</option>
//                                             {PAYMENT_OPTIONS.map((status) => (
//                                                 <option key={status} value={status}>
//                                                     {status}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1">Leave Status</label>
//                                         <select
//                                             value={leaveDetails.status}
//                                             onChange={(e) =>
//                                                 setLeaveDetails((prev) => ({ ...prev, status: e.target.value }))
//                                             }
//                                             className="w-full border border-yellow-400 rounded p-2 focus:outline-yellow-500"
//                                         >
//                                             <option value="approved">Approved</option>
//                                             <option value="rejected">Rejected</option>
//                                             <option value="pending">Pending</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleApproveOrReject}
//                                 className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded transition w-full"
//                                 disabled={!!validationError || leaveLoading}
//                             >
//                                 {leaveLoading ? "Processing..." : "Submit"}
//                             </button>


//                             {error && <p className="text-red-600 mt-4">{error}</p>}
//                         </div>
//                     </div>
//                 )}

//                 {/* FILTERED LEAVE SEARCH */}
//                 <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Search Leaves</h2>
//                     <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <input
//                             name="employeeId"
//                             type="text"
//                             placeholder="Employee ID"
//                             value={searchParams.employeeId || ""}
//                             onChange={handleSearchChange}
//                             className="p-2 border border-gray-300 rounded"
//                         />
//                         <input
//                             name="fromDate"
//                             type="date"
//                             value={searchParams.fromDate}
//                             onChange={handleSearchChange}
//                             className="p-2 border border-gray-300 rounded"
//                         />
//                         <input
//                             name="toDate"
//                             type="date"
//                             value={searchParams.toDate}
//                             onChange={handleSearchChange}
//                             className="p-2 border border-gray-300 rounded"
//                         />
//                         <select
//                             name="status"
//                             value={searchParams.status || ""}
//                             onChange={handleSearchChange}
//                             className="p-2 border border-gray-300 rounded"
//                         >
//                             <option value="">Select Status</option>
//                             <option value="approved">Approved</option>
//                             <option value="rejected">Rejected</option>
//                             <option value="cancelled">Cancelled</option>

//                         </select>
//                         <select
//                             name="type"
//                             value={searchParams.type}
//                             onChange={handleSearchChange}
//                             className="p-2 border border-gray-300 rounded"
//                         >
//                             <option value="">Select Leave Type</option>
//                             <option value="CASUAL">CASUAL</option>
//                             <option value="SICK">SICK</option>
//                             <option value="EARNED">EARNED</option>
//                             <option value="UNPAID">UNPAID</option>
//                             <option value="PAID">PAID</option>
//                             <option value="COMP_OFF">COMP_OFF</option>
//                             <option value="MATERNITY">MATERNITY</option>
//                             <option value="PATERNITY">PATERNITY</option>
//                             <option value="BEREAVEMENT">BEREAVEMENT</option>
//                             <option value="LOP">LOP</option>
//                             <option value="OTHER">OTHER</option>
//                         </select>
//                         <button
//                             type="submit"
//                             disabled={searching}
//                             className={`${searching ? "bg-yellow-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
//                                 } text-white font-bold py-2 px-4 rounded`}
//                         >
//                             {searching ? (
//                                 <>
//                                     <span className="animate-spin mr-2">⏳</span> Searching...
//                                 </>
//                             ) : (
//                                 "Search"
//                             )}

//                         </button>
//                         <button
//                             type="button"
//                             onClick={clearFilters}
//                             className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
//                         >
//                             Clear Filters
//                         </button>


//                     </form>
//                     {/* ALL DETAILS BUTTON */}
//                     <div className="mt-6">
//                         <button
//                             onClick={fetchAllLeaveDetails}
//                             className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded transition"
//                         >
//                             Show All Details
//                         </button>
//                     </div>

//                     {/* ALL LEAVES TABLE */}
//                     {showAllLeaves && (
//                         <div className="mt-8 overflow-auto bg-white p-4 rounded shadow-md">
//                             <h2 className="text-xl font-semibold text-yellow-600 mb-4">All Leaves Details</h2>
//                             {loading ? (
//                                 <p className="text-gray-600">Loading all leaves...</p>
//                             ) : allLeaves.length === 0 ? (
//                                 <p className="text-gray-500">No leave data available.</p>
//                             ) : (
//                                 <table className="min-w-full border-collapse border border-gray-300">
//                                     <thead className="bg-yellow-100">
//                                         <tr>
//                                             <th className="border border-gray-300 p-2">Employee ID</th>
//                                             <th className="border border-gray-300 p-2">Name</th>
//                                             <th className="border border-gray-300 p-2">Type</th>
//                                             <th className="border border-gray-300 p-2">From</th>
//                                             <th className="border border-gray-300 p-2">To</th>
//                                             <th className="border border-gray-300 p-2">Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {allLeaves.map((leave) => (
//                                             <tr
//                                                 key={leave.id}
//                                                 className="hover:bg-yellow-50 cursor-pointer"
//                                                 onClick={() => fetchLeaveDetails(leave.id)}
//                                             >
//                                                 <td className="border border-gray-300 p-2">{leave.employeeId}</td>
//                                                 <td className="border border-gray-300 p-2">{leave.employeeName || "N/A"}</td>
//                                                 <td className="border border-gray-300 p-2">{[leave.leaveType, ...(leave.paymentStatuses || [])].join(", ")} </td>
//                                                 <td className="border border-gray-300 p-2">{dayjs(leave.fromDate).format("MMM D, YYYY")}</td>
//                                                 <td className="border border-gray-300 p-2">{dayjs(leave.toDate).format("MMM D, YYYY")}</td>
//                                                 <td
//                                                     className={`border border-gray-300 p-2 ${leave.status === "pending"
//                                                         ? "text-yellow-700"
//                                                         : leave.status === "approved"
//                                                             ? "text-green-700"
//                                                             : leave.status === "rejected"
//                                                                 ? "text-red-700"
//                                                                 : ""
//                                                         }`}
//                                                 >
//                                                     {leave.status}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             )}
//                         </div>
//                     )}

//                     {searchResults.length > 0 ? (
//                         <div className="mt-6 overflow-x-auto">
//                             <table className="w-full table-auto border border-gray-300">
//                                 <thead>
//                                     <tr className="bg-yellow-200">
//                                         <th className="p-2 border">Employee Name</th>
//                                         <th className="p-2 border">Employee ID</th>
//                                         <th className="p-2 border">From</th>
//                                         <th className="p-2 border">To</th>
//                                         <th className="p-2 border">Type</th>
//                                         <th className="p-2 border">Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {searchResults.map((leave) => (
//                                         <tr key={leave.id} className="text-center bg-yellow-50 hover:bg-yellow-100">
//                                             <td className="p-2 border">{leave.employeeName || "N/A"}</td>
//                                             <td className="p-2 border">{leave.employeeId}</td>
//                                             <td className="p-2 border">{dayjs(leave.fromDate).format("YYYY-MM-DD")}</td>
//                                             <td className="p-2 border">{dayjs(leave.toDate).format("YYYY-MM-DD")}</td>
//                                             <td className="p-2 border">{[leave.leaveType, ...(leave.paymentStatuses || [])].join(", ")}</td>
//                                             <td className="p-2 border">{leave.status}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         !searching && (
//                             <p className="mt-6 text-center text-gray-500">No results found for the given search.</p>
//                         )
//                     )}

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HRLeaveApprovals;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HRSidebar from "../../components/Common/HRSidebar";
import dayjs from "dayjs";

const PAYMENT_OPTIONS = ["PAID", "UNPAID", "LOP", "COMP_OFF"];
const CONFLICTING_COMBOS = [
    ["PAID", "UNPAID"],
    ["PAID", "LOP"],
    ["COMP_OFF", "UNPAID"],
    ["COMP_OFF", "LOP"],
];

const HRLeaveApprovals = () => {
    const navigate = useNavigate();
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [leaveDetails, setLeaveDetails] = useState(null);
    const [action, setAction] = useState("approved");
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [error, setError] = useState("");
    const [validationError, setValidationError] = useState("");
    const [loading, setLoading] = useState(false);
    const [leaveLoading, setLeaveLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [processedLeaveIds, setProcessedLeaveIds] = useState([]);
    const [editPaymentModal, setEditPaymentModal] = useState(null); // leave object
    const [updatingPayment, setUpdatingPayment] = useState(false);


    const [searchParams, setSearchParams] = useState({
        employeeId: "",
        fromDate: "",
        toDate: "",
        status: "",
        type: "",
    });
    const [searchResults, setSearchResults] = useState([]);
    // NEW: State for all leaves and toggle
    const [allLeaves, setAllLeaves] = useState([]);
    const [showAllLeaves, setShowAllLeaves] = useState(false);

    // Outside useEffect
    const fetchPendingLeaves = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://backend.hrms.transev.site/hr/leaves/pending", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
                },
            });

            if (response.data.status === "success") {
                const leaveIds = response?.data?.data?.leaveIds || [];

                if (leaveIds.length > 0) {
                    const detailsRes = await axios.post(
                        "https://backend.hrms.transev.site/hr/leave/view",
                        { leaveIds },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
                            },
                        }
                    );

                    // ✅ Filter only pending status leaves
                    const allLeaves = detailsRes?.data?.data || [];
                    const pendingOnly = allLeaves.filter((leave) => leave.status === "pending");
                    setPendingLeaves(pendingOnly);
                } else {
                    setPendingLeaves([]);
                }
            } else {
                setError("Failed to fetch pending leaves.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch pending leaves.");
        } finally {
            setLoading(false);

        }
    };
    useEffect(() => {
        fetchPendingLeaves(); // initial call
        const intervalId = setInterval(fetchPendingLeaves, 10000);
        return () => clearInterval(intervalId);
    }, []);




    const closeModal = () => {
        setLeaveDetails(null);
        setValidationError("");
        setError("");
        setPaymentStatuses([]);
    };

    const fetchLeaveDetails = async (identifier) => {
        setLeaveLoading(true);
        try {
            let requestBody = {};

            // If it's a UUID, treat as leaveId; else assume it's employeeId
            const isUUID = /^[0-9a-fA-F-]{36}$/.test(identifier);

            if (isUUID) {
                requestBody.leaveIds = [identifier]; // wrap in array!
            } else {
                requestBody.employeeId = identifier;
            }

            const response = await axios.post(
                "https://backend.hrms.transev.site/hr/leave/view",
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
                    },
                }
            );

            const data = response.data.data;

            if (Array.isArray(data) && data.length > 0) {
                // If using leaveIds, pick the correct one directly
                if (isUUID) {
                    const found = data.find((leave) => leave.id === identifier);
                    setLeaveDetails(found || data[0]); // fallback
                } else {
                    setLeaveDetails(data[0]); // First matching leave
                }

                setError("");
                setValidationError("");
                setPaymentStatuses([]);
            } else {
                setLeaveDetails(null);
                setError("No leave details found.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch leave details.");
        } finally {
            setLeaveLoading(false);
        }
    };



    const isConflictingCombo = (selected) => {
        return CONFLICTING_COMBOS.some((combo) =>
            combo.every((item) => selected.includes(item))
        );
    };

    const handlePaymentChange = (e) => {
        const selected = [...e.target.selectedOptions].map((o) => o.value);
        if (isConflictingCombo(selected)) {
            setValidationError("Selected payment statuses conflict with each other.");
        } else {
            setValidationError("");
        }
        setPaymentStatuses(selected);
    };



    const handleApproveOrReject = async () => {
        if (validationError) {
            alert("Please resolve the payment status conflict before submitting.");
            return;
        }

        const selectedAction = leaveDetails?.status?.toLowerCase();

        if (!["approved", "rejected"].includes(selectedAction)) {
            alert("Please select a valid status (approved/rejected).");
            return;
        }

        if (selectedAction === "approved" && paymentStatuses.length === 0) {
            alert("At least one payment status must be selected when approving.");
            return;
        }

        setLeaveLoading(true);
        try {
            const response = await axios.patch(
                "https://backend.hrms.transev.site/hr/leave/act",
                {
                    leaveId: leaveDetails.id,
                    action: selectedAction,
                    paymentStatuses,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
                    },
                }
            );

            if (response.data.status === "success") {
                alert(response.data.data.message || "Leave updated successfully.");

                // ✅ Remove this leave from the pendingLeaves immediately
                setPendingLeaves((prev) =>
                    prev.filter((leave) => leave.id !== leaveDetails.id)
                );

                setProcessedLeaveIds((prev) => [...prev, leaveDetails.id]);
                setLeaveDetails(null);
                setPaymentStatuses([]);

                // Optional: refresh from server to sync
                await fetchPendingLeaves();
            } else {
                setError(response.data.message || "Action failed.");
            }
        } catch {
            setError("Failed to update leave.");
        } finally {
            setLeaveLoading(false);
        }

    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };
    const clearFilters = () => {
        setSearchParams({});          // Clears all input fields
        setSearchResults([]);         // Clears any previous results
        setShowAllLeaves(false);      // Hide "All Details" if it was showing
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setSearching(true); // Start searching
        setShowAllLeaves(false); // Hide all leaves view on search
        try {
            const response = await axios.post(
                "https://backend.hrms.transev.site/hr/leave/view",
                {
                    ...Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v)),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
                    },
                }
            );
            setSearchResults(response.data.data || []);
        } catch {
            alert("Failed to fetch search results.");
        }
        finally {
            setSearching(false); // End searching
        }
    };

    // NEW: Fetch all leaves (all statuses)
    const fetchAllLeaveDetails = async () => {
        setLoading(true);
        setSearchResults([]); // Clear previous search results
        try {
            // Fetch all leaves for all employees or filtered, here just fetch all (or can add filters)
            // You may want to pass an empty object to fetch all leaves
            const response = await axios.post(
                "https://backend.hrms.transev.site/hr/leave/view",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
                    },
                }
            );

            if (response.data.status === "success") {
                setAllLeaves(response.data.data || []);
                setShowAllLeaves(true);
                setSearchResults([]);
            } else {
                setError("Failed to fetch all leaves.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch all leaves.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <HRSidebar />

            <div className="ml-64 p-8 w-full">
                <h1 className="text-3xl font-bold text-yellow-500 mb-8">HR Leave Approvals</h1>

                {/* PENDING LEAVES */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Pending Leaves</h2>
                    {loading ? (
                        <p className="text-gray-600">Loading pending leaves...</p>
                    ) : pendingLeaves.length === 0 ? (
                        <p className="text-gray-500">No pending leaves.</p>
                    ) : (
                        <ul className="space-y-4">
                            {pendingLeaves.map((leave) => (
                                <li
                                    key={leave.id}
                                    className="bg-yellow-100 border border-yellow-300 p-4 rounded flex justify-between items-center"
                                >
                                    <span className="font-medium text-gray-800">
                                        {leave.employeeName || "Unknown"} ({leave.employeeId})
                                    </span>
                                    <button
                                        onClick={() => fetchLeaveDetails(leave.id)} // passes leaveId
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                                    >
                                        View Details
                                    </button>
                                </li>
                            ))}

                        </ul>
                    )}
                </div>


                {/* LEAVE DETAILS */}
                {leaveDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white w-[90%] md:w-[600px] rounded-lg shadow-lg relative p-6">
                            <button
                                onClick={closeModal}
                                className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
                            >
                                ✖
                            </button>

                            <h2 className="text-2xl font-semibold text-yellow-600 mb-6">Leave Details</h2>

                            <div className="space-y-4 text-sm text-gray-800">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-yellow-700 mb-1">Employee</label>
                                        <p className="p-2 border border-gray-300 rounded bg-gray-50">
                                            {leaveDetails.employeeId} - {leaveDetails.employeeName || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-yellow-700 mb-1">From</label>
                                        <p className="p-2 border border-gray-300 rounded bg-gray-50">
                                            {dayjs(leaveDetails.fromDate).format("MMM D, YYYY")}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-yellow-700 mb-1">To</label>
                                        <p className="p-2 border border-gray-300 rounded bg-gray-50">
                                            {dayjs(leaveDetails.toDate).format("MMM D, YYYY")}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-yellow-700 mb-1">Leave Type</label>
                                        <select
                                            value={leaveDetails.leaveType}
                                            disabled
                                            className="w-full border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
                                        >
                                            <option value={leaveDetails.leaveType}>{leaveDetails.leaveType}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-yellow-700 mb-1">Payment Status</label>
                                        <select
                                            name="paymentStatus"
                                            value={searchParams.paymentStatus || ""}
                                            onChange={handlePaymentChange}
                                            className="w-full border border-yellow-400 rounded p-2 focus:outline-yellow-500"
                                        >
                                            <option value="">Select Payment Status</option>
                                            {PAYMENT_OPTIONS.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-yellow-700 mb-1">Leave Status</label>
                                        <select
                                            value={leaveDetails.status}
                                            onChange={(e) =>
                                                setLeaveDetails((prev) => ({ ...prev, status: e.target.value }))
                                            }
                                            className="w-full border border-yellow-400 rounded p-2 focus:outline-yellow-500"
                                        >
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleApproveOrReject}
                                className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded transition w-full"
                                disabled={!!validationError || leaveLoading}
                            >
                                {leaveLoading ? "Processing..." : "Submit"}
                            </button>


                            {error && <p className="text-red-600 mt-4">{error}</p>}
                        </div>
                    </div>
                )}

                {/* FILTERED LEAVE SEARCH */}
                <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Search Leaves</h2>
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            name="employeeId"
                            type="text"
                            placeholder="Employee ID"
                            value={searchParams.employeeId || ""}
                            onChange={handleSearchChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            name="fromDate"
                            type="date"
                            value={searchParams.fromDate}
                            onChange={handleSearchChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            name="toDate"
                            type="date"
                            value={searchParams.toDate}
                            onChange={handleSearchChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <select
                            name="status"
                            value={searchParams.status || ""}
                            onChange={handleSearchChange}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Status</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>

                        </select>
                        <select
                            name="type"
                            value={searchParams.type}
                            onChange={handleSearchChange}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Leave Type</option>
                            <option value="CASUAL">CASUAL</option>
                            <option value="SICK">SICK</option>
                            <option value="EARNED">EARNED</option>
                            <option value="UNPAID">UNPAID</option>
                            <option value="PAID">PAID</option>
                            <option value="COMP_OFF">COMP_OFF</option>
                            <option value="MATERNITY">MATERNITY</option>
                            <option value="PATERNITY">PATERNITY</option>
                            <option value="BEREAVEMENT">BEREAVEMENT</option>
                            <option value="LOP">LOP</option>
                            <option value="OTHER">OTHER</option>
                        </select>
                        <button
                            type="submit"
                            disabled={searching}
                            className={`${searching ? "bg-yellow-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
                                } text-white font-bold py-2 px-4 rounded`}
                        >
                            {searching ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span> Searching...
                                </>
                            ) : (
                                "Search"
                            )}

                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                        >
                            Clear Filters
                        </button>


                    </form>
                    {/* ALL DETAILS BUTTON */}
                    <div className="mt-6">
                        <button
                            onClick={fetchAllLeaveDetails}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded transition"
                        >
                            Show All Details
                        </button>
                    </div>

                    {/* ALL LEAVES TABLE */}
                    {showAllLeaves && (
                        <div className="mt-8 overflow-auto bg-white p-4 rounded shadow-md">
                            <h2 className="text-xl font-semibold text-yellow-600 mb-4">All Leaves Details</h2>
                            {loading ? (
                                <p className="text-gray-600">Loading all leaves...</p>
                            ) : allLeaves.length === 0 ? (
                                <p className="text-gray-500">No leave data available.</p>
                            ) : (
                                <table className="min-w-full border-collapse border border-gray-300">
                                    <thead className="bg-yellow-100">
                                        <tr>
                                            <th className="border border-gray-300 p-2">Employee ID</th>
                                            <th className="border border-gray-300 p-2">Name</th>
                                            <th className="border border-gray-300 p-2">Type</th>
                                            <th className="border border-gray-300 p-2">From</th>
                                            <th className="border border-gray-300 p-2">To</th>
                                            <th className="border border-gray-300 p-2">Status</th>
                                            <th className="border border-gray-300 p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allLeaves.map((leave) => (
                                            <tr
                                                key={leave.id}
                                                className="hover:bg-yellow-50 cursor-pointer"
                                                // onClick={() => fetchLeaveDetails(leave.id)}
                                            >
                                                <td className="border border-gray-300 p-2">{leave.employeeId}</td>
                                                <td className="border border-gray-300 p-2">{leave.employeeName || "N/A"}</td>
                                                <td className="border border-gray-300 p-2">{[leave.leaveType, ...(leave.paymentStatuses || [])].join(", ")} </td>
                                                <td className="border border-gray-300 p-2">{dayjs(leave.fromDate).format("MMM D, YYYY")}</td>
                                                <td className="border border-gray-300 p-2">{dayjs(leave.toDate).format("MMM D, YYYY")}</td>
                                                <td
                                                    className={`border border-gray-300 p-2 ${leave.status === "pending"
                                                        ? "text-yellow-700"
                                                        : leave.status === "approved"
                                                            ? "text-green-700"
                                                            : leave.status === "rejected"
                                                                ? "text-red-700"
                                                                : ""
                                                        }`}
                                                >
                                                    {leave.status}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // prevent row click
                                                            setEditPaymentModal(leave);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {searchResults.length > 0 ? (
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full table-auto border border-gray-300">
                                <thead>
                                    <tr className="bg-yellow-200">
                                        <th className="p-2 border">Employee Name</th>
                                        <th className="p-2 border">Employee ID</th>
                                        <th className="p-2 border">From</th>
                                        <th className="p-2 border">To</th>
                                        <th className="p-2 border">Type</th>
                                        <th className="p-2 border">Status</th>
                                        <th className="border border-gray-300 p-2">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((leave) => (
                                        <tr key={leave.id} className="text-center bg-yellow-50 hover:bg-yellow-100">
                                            <td className="p-2 border">{leave.employeeName || "N/A"}</td>
                                            <td className="p-2 border">{leave.employeeId}</td>
                                            <td className="p-2 border">{dayjs(leave.fromDate).format("YYYY-MM-DD")}</td>
                                            <td className="p-2 border">{dayjs(leave.toDate).format("YYYY-MM-DD")}</td>
                                            <td className="p-2 border">{[leave.leaveType, ...(leave.paymentStatuses || [])].join(", ")}</td>
                                            <td className="p-2 border">{leave.status}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        !searching && (
                            <p className="mt-6 text-center text-gray-500">No results found for the given search.</p>
                        )
                    )}

                </div>
                {editPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative">
                            <button
                                onClick={() => setEditPaymentModal(null)}
                                className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl"
                            >
                                ✖
                            </button>
                            <h2 className="text-xl font-semibold text-yellow-600 mb-4">Edit Payment Status</h2>
                            <p className="mb-2"><strong>Employee:</strong> {editPaymentModal.employeeName} ({editPaymentModal.employeeId})</p>
                            <p className="mb-2"><strong>Leave Type:</strong> {editPaymentModal.leaveType}</p>


                            {/* Toggle Option */}
                            <div className="mb-4">
                                <label className="block font-medium mb-1 text-sm text-yellow-800">Change To:</label>
                                <select
                                    className="w-full border border-yellow-400 rounded p-2"
                                    value={
                                        editPaymentModal.paymentStatuses?.includes("PAID") ? "UNPAID" : "PAID"
                                    }
                                    onChange={(e) =>
                                        setEditPaymentModal((prev) => ({
                                            ...prev,
                                            newPaymentStatus: e.target.value
                                        }))
                                    }
                                >
                                    <option value={editPaymentModal.paymentStatuses?.includes("PAID") ? "UNPAID" : "PAID"}>
                                        {editPaymentModal.paymentStatuses?.includes("PAID") ? "UNPAID" : "PAID"}
                                    </option>
                                </select>
                            </div>
                            <button
                                disabled={updatingPayment}
                                onClick={async () => {
                                    setUpdatingPayment(true);
                                    const isCurrentlyPaid = editPaymentModal.paymentStatuses?.[0] === "PAID";
                                    const payload = {
                                        leaveId: editPaymentModal.id,
                                        statusAdd: [isCurrentlyPaid ? "UNPAID" : "PAID"],
                                        statusRemove: [isCurrentlyPaid ? "PAID" : "UNPAID"],
                                    };

                                    try {
                                        const response = await axios.patch(
                                            "https://backend.hrms.transev.site/hr/leave/payment-status/edit",
                                            payload,
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
                                                },
                                            }
                                        );

                                        if (response.data.status === "success") {
                                            alert("Payment status updated successfully.");
                                            // Update the UI after change
                                            fetchAllLeaveDetails();
                                            setEditPaymentModal(null);
                                        } else {
                                            alert("Failed to update payment status.");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error updating payment status.");
                                    } finally {
                                        setUpdatingPayment(false);
                                    }
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded w-full"
                            >
                                {updatingPayment ? "Updating..." : "Confirm Change"}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default HRLeaveApprovals;
