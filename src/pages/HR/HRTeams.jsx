import { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const HRTeams = () => {
    /* ===================== STATE ===================== */
    const [teams, setTeams] = useState([]);
    const [deactivatedTeams, setDeactivatedTeams] = useState([]);
    const [activeTeam, setActiveTeam] = useState(null);
    const [members, setMembers] = useState([]);

    const [viewMode, setViewMode] = useState("list"); // list | details
    const [includeInactive, setIncludeInactive] = useState(false);

    // Create team
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Assign member modal
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [assignRole, setAssignRole] = useState("member");
    // Inside HRTeams component, before return(...)
    const isTeamDeactivated = activeTeam && activeTeam.isActive === false;


    // Unassign / deactivate member modal
    const [showUnassignModal, setShowUnassignModal] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);

    const token = localStorage.getItem("hr_token");

    /* ===================== HELPERS ===================== */
    const handleInactiveClick = (member) => {
        setMemberToRemove(member);
        setShowUnassignModal(true);
    };

    /* ===================== FETCH TEAMS ===================== */
    const fetchTeams = () => {
        // Active Teams
        fetch("https://backend.hrms.transev.site/hr/team/get-all", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isActive: true }),
        })
            .then((res) => res.json())
            .then((d) => setTeams(d.data || []));

        // Deactivated Teams
        fetch("https://backend.hrms.transev.site/hr/team/get-all", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isActive: false }),
        })
            .then((res) => res.json())
            .then((d) => setDeactivatedTeams(d.data || []));
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    /* ===================== FETCH MEMBERS ===================== */
    const fetchMembers = (teamId) => {
        fetch("https://backend.hrms.transev.site/hr/team/get-members", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ teamId, includeInactive }),
        })
            .then((res) => res.json())
            .then((d) => setMembers(d.data || []));
    };

    useEffect(() => {
        if (activeTeam) fetchMembers(activeTeam.id);
    }, [includeInactive, activeTeam]);

    /* ===================== CREATE TEAM ===================== */
    const createTeam = () => {
        if (!name.trim()) return;

        fetch("https://backend.hrms.transev.site/hr/team/create", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name, description }),
        }).then(() => {
            setName("");
            setDescription("");
            fetchTeams(); // Refresh lists after creating
        });
    };

    /* ===================== FETCH EMPLOYEES ===================== */
    useEffect(() => {
        fetch("https://backend.hrms.transev.site/hr/employees", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((d) => setEmployees(d.data || []));
    }, []);

    const filteredEmployees =
        employeeSearch.trim() === ""
            ? []
            : employees.filter(
                (e) =>
                    e.employeeId.startsWith(employeeSearch) ||
                    e.name.toLowerCase().includes(employeeSearch.toLowerCase())
            );

    /* ===================== ASSIGN MEMBER ===================== */
    const assignMemberToTeam = () => {
        if (!selectedEmployee || !activeTeam) return;

        fetch("https://backend.hrms.transev.site/hr/team/assign-members", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                teamId: activeTeam.id,
                role: assignRole,
                employeeIds: [selectedEmployee.employeeId],
            }),
        }).then(() => {
            setShowAssignModal(false);
            setEmployeeSearch("");
            setSelectedEmployee(null);
            fetchMembers(activeTeam.id);
        });
    };

    /* ===================== DEACTIVATE TEAM ===================== */
    const deactivateTeam = (teamId) => {
        if (!teamId) return;
        if (!window.confirm("Are you sure you want to deactivate this team?")) return;

        fetch("https://backend.hrms.transev.site/hr/team/deactivate", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ teamId }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status === "success") {
                    // Remove from active
                    setTeams((prev) => prev.filter((t) => t.id !== teamId));
                    // Refresh deactivated list
                    fetchTeams();

                    if (activeTeam?.id === teamId) {
                        setActiveTeam(null);
                        setViewMode("list");
                        setMembers([]);
                    }

                    alert("Team deactivated successfully!");
                } else {
                    alert("Failed to deactivate team. Try again.");
                }
            })
            .catch(() => alert("Error deactivating team. Try again."));
    };

    /* ===================== UNASSIGN / INACTIVE MEMBER ===================== */
    const unassignMemberFromTeam = () => {
        if (!memberToRemove || !activeTeam) return;

        fetch("https://backend.hrms.transev.site/hr/team/unassign-members", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ teamId: activeTeam.id, employeeIds: [memberToRemove.employee.employeeId] }),
        }).then(() => {
            setShowUnassignModal(false);
            setMemberToRemove(null);
            fetchMembers(activeTeam.id);
        });
    };

    /* ===================== UPDATE MEMBER ROLE ===================== */
    const updateMemberRole = (employeeId, newRole) => {
        if (!activeTeam) return;

        // Optimistic UI update
        setMembers((prev) =>
            prev.map((m) => (m.employee.employeeId === employeeId ? { ...m, role: newRole } : m))
        );

        fetch("https://backend.hrms.transev.site/hr/team/update-member-roles", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ teamId: activeTeam.id, role: newRole, employeeIds: [employeeId] }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status !== "success") {
                    // Revert if fails
                    setMembers((prev) =>
                        prev.map((m) => (m.employee.employeeId === employeeId ? { ...m, role: m.role } : m))
                    );
                    alert("Failed to update role. Please try again.");
                }
            })
            .catch(() => alert("Error updating role. Please try again."));
    };

    /* ===================== UI ===================== */
    return (
        <div className="min-h-screen bg-amber-50/40 text-slate-800">
            <HRSidebar />

            <main className="ml-64 py-12 px-10">
                <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">

                    {/* ===================== LEFT PANEL ===================== */}
                    <aside className="col-span-3 space-y-6">
                        {/* Active Teams */}
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-yellow-100">
                            <h2 className="text-lg font-semibold mb-4">Active Teams</h2>
                            <div className="space-y-3">
                                {teams.length > 0 ? (
                                    teams.map((team) => (
                                        <div
                                            key={team.id}
                                            onClick={() => {
                                                setActiveTeam(team);
                                                setViewMode("details");
                                                fetchMembers(team.id);
                                            }}
                                            className={`p-4 rounded-xl cursor-pointer shadow-sm transition duration-200 ${activeTeam?.id === team.id
                                                    ? "bg-amber-100 border-l-4 border-amber-400 shadow-md"
                                                    : "hover:bg-yellow-50 hover:shadow"
                                                }`}
                                        >
                                            <p className="font-medium">{team.name}</p>
                                            <p className="text-sm text-slate-500 truncate">{team.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400">No active teams</p>
                                )}
                            </div>
                        </div>

                        {/* Deactivated Teams */}
                        {deactivatedTeams.length > 0 && (
                            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-red-100">
                                <h2 className="text-lg font-semibold mb-4 text-red-600">Deactivated Teams</h2>
                                <div className="space-y-3">
                                    {deactivatedTeams.map((team) => (
                                        <div
                                            key={team.id}
                                            onClick={() => {
                                                setActiveTeam(team);
                                                setViewMode("details");
                                                fetchMembers(team.id);
                                            }}
                                            className={`p-4 rounded-xl cursor-pointer shadow-sm transition duration-200 ${activeTeam?.id === team.id
                                                    ? "bg-red-100 border-l-4 border-red-400 shadow-md"
                                                    : "hover:bg-red-50 hover:shadow"
                                                }`}
                                        >
                                            <p className="font-medium">{team.name}</p>
                                            <p className="text-sm text-slate-500 truncate">{team.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* ===================== RIGHT PANEL ===================== */}
                    <section className="col-span-9 space-y-6">
                        {/* Create Team */}
                        {viewMode === "list" && (
                            <div className="bg-white/90 rounded-2xl p-8 shadow-md border border-yellow-200">
                                <h3 className="text-xl font-semibold mb-6 border-b pb-3">Create Team</h3>
                                <div className="space-y-4">
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Team name"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                                    />
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Description"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                                    />
                                    <button
                                        onClick={createTeam}
                                        className="bg-amber-400 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-amber-500 transition"
                                    >
                                        Create Team
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Team Details */}
                        {viewMode === "details" && activeTeam && (
                            <div className="bg-white/90 rounded-2xl p-8 shadow-md border border-yellow-200 space-y-6">
                                {/* Back & Actions */}
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => {
                                            setViewMode("list");
                                            setActiveTeam(null);
                                            setMembers([]);
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold text-sm border border-amber-300 hover:bg-amber-200 transition"
                                    >
                                        ← Back to Teams
                                    </button>
                                    {/* Assign Member & Deactivate buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowAssignModal(true)}
                                            className={`px-4 py-2 rounded-xl bg-amber-400 transition ${isTeamDeactivated ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-500"
                                                }`}
                                            disabled={isTeamDeactivated}
                                        >
                                            + Assign Member
                                        </button>

                                        <button
                                            onClick={() => deactivateTeam(activeTeam.id)}
                                            className={`px-4 py-2 rounded-xl text-red-700 transition ${isTeamDeactivated ? "opacity-50 cursor-not-allowed bg-red-100" : "hover:bg-red-200 bg-red-100"
                                                }`}
                                            disabled={isTeamDeactivated}
                                        >
                                            Deactivate Team
                                        </button>
                                    </div>

                                </div>

                                {/* Team Header */}
                                <h3 className="text-2xl font-bold">{activeTeam.name}</h3>
                                {activeTeam.description && <p className="text-gray-500">{activeTeam.description}</p>}

                                {/* Show Inactive Toggle */}
                                <label className="flex items-center gap-2 text-sm mt-2">
                                    <input
                                        type="checkbox"
                                        checked={includeInactive}
                                        onChange={(e) => setIncludeInactive(e.target.checked)}
                                    />
                                    Show inactive members
                                </label>

                                {/* Members Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto border-collapse rounded-xl overflow-hidden">
                                        <thead className="bg-yellow-100">
                                            <tr>
                                                <th className="p-3 text-left">Name</th>
                                                <th className="p-3 text-left">ID</th>
                                                <th className="p-3 text-left">Role</th>
                                                <th className="p-3 text-left">Status</th>
                                                <th className="p-3 text-left">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {members.map((m) => (
                                                <tr
                                                    key={m.id}
                                                    className={`border-t transition duration-200 hover:bg-yellow-50 ${m.leftAt ? "bg-red-50/30" : ""
                                                        }`}
                                                >
                                                    <td className="p-3 font-medium">{m.employee.name}</td>
                                                    <td className="p-3">{m.employee.employeeId}</td>
                                                    <td className="p-3">
                                                        {!m.leftAt ? (
                                                            <select
                                                                value={m.role}
                                                                onChange={(e) => updateMemberRole(m.employee.employeeId, e.target.value)}
                                                                className="border px-2 py-1 rounded"
                                                                disabled={isTeamDeactivated} // <-- disable for deactivated teams
                                                                style={isTeamDeactivated ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
                                                            >
                                                                <option value="member">Member</option>
                                                                <option value="leader">Leader</option>
                                                            </select>

                                                        ) : (
                                                            <span className="capitalize">{m.role}</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        {m.leftAt ? (
                                                            <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                                                                Inactive
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                                                Active
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        {!m.leftAt && (
                                                            <button
                                                                onClick={() => handleInactiveClick(m)}
                                                                className={`text-red-600 text-sm hover:underline ${isTeamDeactivated ? "opacity-50 cursor-not-allowed" : ""
                                                                    }`}
                                                                disabled={isTeamDeactivated}
                                                            >
                                                                Unassign
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                </div>
            </main>

            {/* ===================== MODALS ===================== */}
            {/* ===================== MODALS ===================== */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-[420px]">
                        <h3 className="mb-4 font-medium">Assign Member</h3>

                        <input
                            value={employeeSearch}
                            onChange={(e) => setEmployeeSearch(e.target.value)}
                            placeholder="Search employee"
                            className="w-full mb-3 border px-4 py-2 rounded-xl"
                        />

                        <div className="max-h-40 overflow-y-auto border rounded-xl mb-3">
                            {filteredEmployees.map((e) => (
                                <div
                                    key={e.employeeId}
                                    onClick={() => {
                                        setSelectedEmployee(e);
                                        setEmployeeSearch(`${e.employeeId} - ${e.name}`);
                                    }}
                                    className={`px-4 py-2 cursor-pointer transition ${selectedEmployee?.employeeId === e.employeeId
                                            ? "bg-amber-100 font-medium"
                                            : "hover:bg-yellow-50"
                                        }`}
                                >
                                    {e.employeeId} – {e.name}
                                </div>
                            ))}
                        </div>

                        <select
                            value={assignRole}
                            onChange={(e) => setAssignRole(e.target.value)}
                            className="w-full mb-4 border px-4 py-2 rounded-xl"
                        >
                            <option value="member">Member</option>
                            <option value="leader">Leader</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-4 py-2 rounded-xl border hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!selectedEmployee}
                                onClick={assignMemberToTeam}
                                className={`px-4 py-2 rounded-xl transition ${selectedEmployee
                                        ? "bg-amber-400 hover:bg-amber-500"
                                        : "bg-gray-300 cursor-not-allowed pointer-events-none"
                                    }`}
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showUnassignModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-[400px] border border-yellow-200">
                        <h3 className="text-lg font-medium mb-2 text-slate-800">
                            {memberToRemove?.leftAt ? "Unassign Member?" : "Mark Member as Inactive?"}
                        </h3>

                        <p className="text-sm text-slate-600 mb-6">
                            Are you sure you want to{" "}
                            <span className="font-medium">{memberToRemove?.employee?.name}</span>{" "}
                            {memberToRemove?.leftAt ? "from this team?" : "mark as inactive?"}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowUnassignModal(false);
                                    setMemberToRemove(null);
                                }}
                                className="px-4 py-2 rounded-full text-sm border border-slate-200 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={unassignMemberFromTeam}
                                className="px-5 py-2 rounded-full bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition text-sm font-medium"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HRTeams;
