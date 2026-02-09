import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar";

const GET_ALL_HRS_API = "https://backend.hrms.transev.site/admin/get-all-hrs";
const DEMOTE_HR_API = "https://backend.hrms.transev.site/admin/demote-hr";

const DeleteHR = () => {
    const [hrs, setHrs] = useState([]);
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* Fetch ALL HRs */
    useEffect(() => {
        const fetchHrs = async () => {
            try {
                const token = localStorage.getItem("admin_token");
                if (!token) throw new Error("Not authenticated");

                const res = await fetch(GET_ALL_HRS_API, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await res.json();
                if (!res.ok) throw new Error(json.message);

                // ✅ EXACT FIX BASED ON RESPONSE
                setHrs(json.data?.employees || []);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchHrs();
    }, []);

    const handleDemote = async (e) => {
        e.preventDefault();

        if (!selectedEmpId) {
            setError("Please select an HR");
            return;
        }

        if (!window.confirm("Are you sure you want to demote this HR?")) return;

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const token = localStorage.getItem("admin_token");
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(DEMOTE_HR_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ employeeId: selectedEmpId }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            setMessage(json.message);

            // remove demoted HR from list
            setHrs((prev) =>
                prev.filter((hr) => hr.employeeId !== selectedEmpId)
            );

            setSelectedEmpId("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="min-h-screen bg-yellow-50 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-yellow-900 mb-6 sm:mb-8">
                    Demote HR
                </h1>

                <form
                    onSubmit={handleDemote}
                    className="bg-white border border-yellow-200 rounded-xl shadow-md p-4 sm:p-6 space-y-6"
                >
                    {/* Select HR */}
                    <div>
                        <label className="block text-sm sm:text-base font-medium text-yellow-800 mb-2">
                            Select HR
                        </label>

                        <select
                            value={selectedEmpId}
                            onChange={(e) => setSelectedEmpId(e.target.value)}
                            className="w-full p-2.5 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                        >
                            <option value="">-- Select --</option>

                            {hrs.map((hr) => (
                                <option
                                    key={hr.employeeId}
                                    value={hr.employeeId}
                                >
                                    {hr.name} ({hr.employeeId})
                                </option>
                            ))}
                        </select>

                        {hrs.length === 0 && (
                            <p className="text-yellow-700 text-sm mt-2">
                                No HR users found.
                            </p>
                        )}
                    </div>

                    {/* Warning */}
                    {selectedEmpId && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                            ⚠️ This HR will lose HR access and become a normal employee.
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row sm:justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-red-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
                        >
                            {loading ? "Demoting..." : "Demote HR"}
                        </button>
                    </div>

                    {/* Messages */}
                    {message && (
                        <p className="text-green-700 text-sm sm:text-base font-medium">
                            {message}
                        </p>
                    )}
                    {error && (
                        <p className="text-red-600 text-sm sm:text-base font-medium">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </main>
    </div>
);

};

export default DeleteHR;
