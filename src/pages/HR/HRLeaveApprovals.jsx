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

    const [searchParams, setSearchParams] = useState({
        employeeId: "",
        fromDate: "",
        toDate: "",
        status: "",
        type: "",
    });
    const [searchResults, setSearchResults] = useState([]);

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

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setSearching(true); // Start searching
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
                            value={searchParams.employeeId}
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
                            value={searchParams.status}
                            onChange={handleSearchChange}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Status</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
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

                    </form>


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
            </div>
        </div>
    );
};

export default HRLeaveApprovals;



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

//     // Fetch pending leaves (your existing code)
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

//                     // Filter only pending status leaves
//                     const allLeavesData = detailsRes?.data?.data || [];
//                     const pendingOnly = allLeavesData.filter((leave) => leave.status === "pending");
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
//                 if (isUUID) {
//                     const found = data.find((leave) => leave.id === identifier);
//                     setLeaveDetails(found || data[0]);
//                 } else {
//                     setLeaveDetails(data[0]);
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

//                 setPendingLeaves((prev) =>
//                     prev.filter((leave) => leave.id !== leaveDetails.id)
//                 );

//                 setProcessedLeaveIds((prev) => [...prev, leaveDetails.id]);
//                 setLeaveDetails(null);
//                 setPaymentStatuses([]);

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

//     const handleSearchSubmit = async (e) => {
//         e.preventDefault();
//         setSearching(true);
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
//             setShowAllLeaves(false); // Hide all leaves table on search
//         } catch {
//             alert("Failed to fetch search results.");
//         } finally {
//             setSearching(false);
//         }
//     };

//     // NEW: Fetch all leaves (all statuses)
//     const fetchAllLeaveDetails = async () => {
//         setLoading(true);
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
//                                         onClick={() => fetchLeaveDetails(leave.id)}
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
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1">Status</label>
//                                         <p
//                                             className={`p-2 border border-gray-300 rounded ${
//                                                 leaveDetails.status === "pending"
//                                                     ? "bg-yellow-100 text-yellow-800"
//                                                     : leaveDetails.status === "approved"
//                                                     ? "bg-green-100 text-green-700"
//                                                     : leaveDetails.status === "rejected"
//                                                     ? "bg-red-100 text-red-700"
//                                                     : "bg-gray-100 text-gray-700"
//                                             }`}
//                                         >
//                                             {leaveDetails.status}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1">Type</label>
//                                         <p className="p-2 border border-gray-300 rounded bg-gray-50">{leaveDetails.type}</p>
//                                     </div>
//                                 </div>

//                                 {/* Action Select */}
//                                 {leaveDetails.status === "pending" && (
//                                     <>
//                                         <label className="block text-sm font-medium text-yellow-700 mb-1 mt-4">
//                                             Action
//                                         </label>
//                                         <select
//                                             className="border border-gray-300 rounded p-2 w-full"
//                                             value={action}
//                                             onChange={(e) => setAction(e.target.value)}
//                                         >
//                                             <option value="approved">Approve</option>
//                                             <option value="rejected">Reject</option>
//                                         </select>

//                                         {/* Payment Status multi-select (only if approving) */}
//                                         {action === "approved" && (
//                                             <>
//                                                 <label className="block text-sm font-medium text-yellow-700 mb-1 mt-4">
//                                                     Payment Statuses
//                                                 </label>
//                                                 <select
//                                                     multiple
//                                                     className="border border-gray-300 rounded p-2 w-full"
//                                                     value={paymentStatuses}
//                                                     onChange={handlePaymentChange}
//                                                 >
//                                                     {PAYMENT_OPTIONS.map((option) => (
//                                                         <option key={option} value={option}>
//                                                             {option}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 {validationError && (
//                                                     <p className="text-red-600 text-sm mt-1">{validationError}</p>
//                                                 )}
//                                             </>
//                                         )}

//                                         <button
//                                             className="mt-6 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
//                                             onClick={handleApproveOrReject}
//                                             disabled={leaveLoading}
//                                         >
//                                             {leaveLoading ? "Submitting..." : "Submit"}
//                                         </button>
//                                     </>
//                                 )}
//                             </div>
//                             {error && <p className="text-red-600 mt-4">{error}</p>}
//                         </div>
//                     </div>
//                 )}

//                 {/* SEARCH FORM */}
//                 <div className="mt-12 bg-white p-6 rounded shadow-md">
//                     <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Search Leaves</h2>
//                     <form
//                         onSubmit={handleSearchSubmit}
//                         className="grid grid-cols-1 sm:grid-cols-3 gap-4"
//                     >
//                         <input
//                             type="text"
//                             placeholder="Employee ID"
//                             name="employeeId"
//                             value={searchParams.employeeId}
//                             onChange={handleSearchChange}
//                             className="border border-gray-300 rounded p-2"
//                         />
//                         <input
//                             type="date"
//                             placeholder="From Date"
//                             name="fromDate"
//                             value={searchParams.fromDate}
//                             onChange={handleSearchChange}
//                             className="border border-gray-300 rounded p-2"
//                         />
//                         <input
//                             type="date"
//                             placeholder="To Date"
//                             name="toDate"
//                             value={searchParams.toDate}
//                             onChange={handleSearchChange}
//                             className="border border-gray-300 rounded p-2"
//                         />
//                         <select
//                             name="status"
//                             value={searchParams.status}
//                             onChange={handleSearchChange}
//                             className="border border-gray-300 rounded p-2"
//                         >
//                             <option value="">Select Status</option>
//                             <option value="pending">Pending</option>
//                             <option value="approved">Approved</option>
//                             <option value="rejected">Rejected</option>
//                         </select>
//                         <input
//                             type="text"
//                             placeholder="Leave Type"
//                             name="type"
//                             value={searchParams.type}
//                             onChange={handleSearchChange}
//                             className="border border-gray-300 rounded p-2"
//                         />
//                         <button
//                             type="submit"
//                             className="bg-yellow-500 text-white rounded p-2 hover:bg-yellow-600 transition"
//                             disabled={searching}
//                         >
//                             {searching ? "Searching..." : "Search"}
//                         </button>
//                     </form>
//                 </div>

//                 {/* ALL DETAILS BUTTON */}
//                 <div className="mt-6">
//                     <button
//                         onClick={fetchAllLeaveDetails}
//                         className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded transition"
//                     >
//                         Show All Details
//                     </button>
//                 </div>

//                 {/* SEARCH RESULTS TABLE */}
//                 {searchResults.length > 0 && (
//                     <div className="mt-8 overflow-auto bg-white p-4 rounded shadow-md">
//                         <h2 className="text-xl font-semibold text-yellow-600 mb-4">Search Results</h2>
//                         <table className="min-w-full border-collapse border border-gray-300">
//                             <thead className="bg-yellow-100">
//                                 <tr>
//                                     <th className="border border-gray-300 p-2">Employee ID</th>
//                                     <th className="border border-gray-300 p-2">Name</th>
//                                     <th className="border border-gray-300 p-2">Type</th>
//                                     <th className="border border-gray-300 p-2">From</th>
//                                     <th className="border border-gray-300 p-2">To</th>
//                                     <th className="border border-gray-300 p-2">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {searchResults.map((leave) => (
//                                     <tr
//                                         key={leave.id}
//                                         className="hover:bg-yellow-50 cursor-pointer"
//                                         onClick={() => fetchLeaveDetails(leave.id)}
//                                     >
//                                         <td className="border border-gray-300 p-2">{leave.employeeId}</td>
//                                         <td className="border border-gray-300 p-2">{leave.employeeName || "N/A"}</td>
//                                         <td className="border border-gray-300 p-2">{leave.type}</td>
//                                         <td className="border border-gray-300 p-2">{dayjs(leave.fromDate).format("MMM D, YYYY")}</td>
//                                         <td className="border border-gray-300 p-2">{dayjs(leave.toDate).format("MMM D, YYYY")}</td>
//                                         <td
//                                             className={`border border-gray-300 p-2 ${
//                                                 leave.status === "pending"
//                                                     ? "text-yellow-700"
//                                                     : leave.status === "approved"
//                                                     ? "text-green-700"
//                                                     : leave.status === "rejected"
//                                                     ? "text-red-700"
//                                                     : ""
//                                             }`}
//                                         >
//                                             {leave.status}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 {/* ALL LEAVES TABLE */}
//                 {showAllLeaves && (
//                     <div className="mt-8 overflow-auto bg-white p-4 rounded shadow-md">
//                         <h2 className="text-xl font-semibold text-yellow-600 mb-4">All Leaves Details</h2>
//                         {loading ? (
//                             <p className="text-gray-600">Loading all leaves...</p>
//                         ) : allLeaves.length === 0 ? (
//                             <p className="text-gray-500">No leave data available.</p>
//                         ) : (
//                             <table className="min-w-full border-collapse border border-gray-300">
//                                 <thead className="bg-yellow-100">
//                                     <tr>
//                                         <th className="border border-gray-300 p-2">Employee ID</th>
//                                         <th className="border border-gray-300 p-2">Name</th>
//                                         <th className="border border-gray-300 p-2">Type</th>
//                                         <th className="border border-gray-300 p-2">From</th>
//                                         <th className="border border-gray-300 p-2">To</th>
//                                         <th className="border border-gray-300 p-2">Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {allLeaves.map((leave) => (
//                                         <tr
//                                             key={leave.id}
//                                             className="hover:bg-yellow-50 cursor-pointer"
//                                             onClick={() => fetchLeaveDetails(leave.id)}
//                                         >
//                                             <td className="border border-gray-300 p-2">{leave.employeeId}</td>
//                                             <td className="border border-gray-300 p-2">{leave.employeeName || "N/A"}</td>
//                                             <td className="border border-gray-300 p-2">{leave.type}</td>
//                                             <td className="border border-gray-300 p-2">{dayjs(leave.fromDate).format("MMM D, YYYY")}</td>
//                                             <td className="border border-gray-300 p-2">{dayjs(leave.toDate).format("MMM D, YYYY")}</td>
//                                             <td
//                                                 className={`border border-gray-300 p-2 ${
//                                                     leave.status === "pending"
//                                                         ? "text-yellow-700"
//                                                         : leave.status === "approved"
//                                                         ? "text-green-700"
//                                                         : leave.status === "rejected"
//                                                         ? "text-red-700"
//                                                         : ""
//                                                 }`}
//                                             >
//                                                 {leave.status}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// };

// export default HRLeaveApprovals;
