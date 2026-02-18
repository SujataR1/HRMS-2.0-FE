import { useEffect, useState } from "react";
import HRSidebar from "../../components/Common/HRSidebar";

const HRProjects = () => {
    /* ===================== STATE ===================== */
    const [projects, setProjects] = useState([]);
    const [activeProject, setActiveProject] = useState(null);

    // create project
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("planned");

    // edit project modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState("planned");

    const [loading, setLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [includeInactive, setIncludeInactive] = useState(false);
    const [membersLoading, setMembersLoading] = useState(false);


    // assign members
    const [assignRole, setAssignRole] = useState("contributor");
    const [assignEmployeeIds, setAssignEmployeeIds] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);


    // unassign member
    const [showUnassignModal, setShowUnassignModal] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [unassignLoading, setUnassignLoading] = useState(false);


    // employee search (NEW)
    const [employees, setEmployees] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);


    const token = localStorage.getItem("hr_token");

    const PROJECT_STATUS = [
        { value: "planned", label: "Planned" },
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    /* ===================== GET ALL PROJECTS ===================== */
    const fetchProjects = () => {
        fetch("https://backend.hrms.transev.site/hr/project/get-all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status === "success") {
                    setProjects(d.data || []);
                }
            });
    };

    useEffect(() => {
        fetchProjects();
    }, []);


    /* ===================== FETCH EMPLOYEES ===================== */
    useEffect(() => {
        fetch("https://backend.hrms.transev.site/hr/employees", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((d) => setEmployees(d.data || []));
    }, []);

    /* ===================== CREATE PROJECT ===================== */
    const createProject = () => {
        if (!name.trim()) return alert("Project name is required");

        setLoading(true);

        fetch("https://backend.hrms.transev.site/hr/project/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description: description || null,
                status,
            }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status === "success") {
                    setName("");
                    setDescription("");
                    setStatus("planned");
                    fetchProjects();
                }
            })
            .finally(() => setLoading(false));
    };

    /* ===================== GET PROJECT (ON CLICK) ===================== */
    const fetchProjectDetails = (projectId) => {
        setDetailsLoading(true);
        setActiveProject(null);


        // 🔥 RESET & LOAD MEMBERS
        setMembers([]);
        fetchProjectMembers(projectId, includeInactive);


        fetch("https://backend.hrms.transev.site/hr/project/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ projectId }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status === "success") {
                    setActiveProject(d.data);
                }
            })
            .finally(() => setDetailsLoading(false));
    };
    const fetchProjectMembers = (projectId, includeInactiveValue) => {
        setMembersLoading(true);

        fetch("https://backend.hrms.transev.site/hr/project/get-members", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                projectId,
                includeInactive: includeInactiveValue,
            }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status === "success") {
                    setMembers(d.data || []);
                } else {
                    setMembers([]);
                }
            })
            .catch(() => setMembers([]))
            .finally(() => setMembersLoading(false));
    };


    /* ===================== ASSIGN MEMBERS ===================== */
    const assignMembers = () => {
        if (!activeProject) return;

        if (!selectedEmployee) {
            return alert("Select an employee");
        }

        const employeeIds = [selectedEmployee.employeeId];


        setAssignLoading(true);

        fetch("https://backend.hrms.transev.site/hr/project/assign-members", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                projectId: activeProject.id,
                role: assignRole,
                employeeIds,
            }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status === "success") {
                    setEmployeeSearch("");
                    setSelectedEmployee(null);
                    fetchProjectMembers(activeProject.id, includeInactive);
                } else {
                    alert(d.message || "Failed to assign members");
                }
            })

            .finally(() => setAssignLoading(false));
    };


    /* ===================== UNASSIGN MEMBER ===================== */
    const unassignMember = () => {
        if (!activeProject || !memberToRemove) return;

        setUnassignLoading(true);

        fetch("https://backend.hrms.transev.site/hr/project/unassign-members", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                projectId: activeProject.id,
                employeeIds: [memberToRemove.employee.employeeId],
            }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status === "success") {
                    setShowUnassignModal(false);
                    setMemberToRemove(null);
                    fetchProjectMembers(activeProject.id, includeInactive);
                } else {
                    alert("Failed to remove member");
                }
            })
            .finally(() => setUnassignLoading(false));
    };

    /* ===================== UPDATE MEMBER ROLE ===================== */
    const updateMemberRole = (employeeId, newRole) => {
        if (!["lead", "contributor"].includes(newRole)) return;
        if (!activeProject) return;


        // Optimistic UI update
        setMembers((prev) =>
            prev.map((m) =>
                m.employee.employeeId === employeeId
                    ? { ...m, role: newRole }
                    : m
            )
        );

        fetch("https://backend.hrms.transev.site/hr/project/update-member-roles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                projectId: activeProject.id,
                role: newRole,
                employeeIds: [employeeId],
            }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status !== "success") {
                    // rollback on failure
                    fetchProjectMembers(activeProject.id, includeInactive);
                    alert("Failed to update role");
                }
            })
            .catch(() => {
                fetchProjectMembers(activeProject.id, includeInactive);
                alert("Error updating role");
            });
    };



    /* ===================== OPEN EDIT MODAL ===================== */
    const openEditModal = () => {
        if (!activeProject) return;

        setEditName(activeProject.name);
        setEditDescription(activeProject.description || "");
        setEditStatus(activeProject.status);
        setShowEditModal(true);
    };

    /* ===================== EDIT PROJECT ===================== */
    const updateProject = () => {
        if (!editName.trim()) return alert("Project name required");

        fetch("https://backend.hrms.transev.site/hr/project/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                projectId: activeProject.id,
                name: editName,
                description: editDescription || null,
                status: editStatus,
            }),
        })
            .then((res) => res.json())
            .then((d) => {
                if (d.status === "success") {
                    setActiveProject(d.data);
                    setShowEditModal(false);
                    fetchProjects(); // sync list
                } else {
                    alert("Failed to update project");
                }
            });
    };
    const filteredEmployees =
        employeeSearch.trim() === ""
            ? []
            : employees.filter(
                (e) =>
                    e.employeeId.startsWith(employeeSearch) ||
                    e.name.toLowerCase().includes(employeeSearch.toLowerCase())
            );

    /* ===================== UI ===================== */
    return (
        <div className="min-h-screen bg-amber-50/40 text-slate-800">
            <HRSidebar />

            <main className="ml-64 py-12 px-10">
                <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">

                    {/* LEFT */}
                    <aside className="col-span-4 space-y-6">
                        {/* CREATE */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-yellow-200">
                            <h3 className="font-semibold mb-4">Create Project</h3>

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Project name"
                                className="w-full mb-3 px-4 py-2 rounded-xl border"
                            />

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                className="w-full mb-3 px-4 py-2 rounded-xl border"
                            />

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full mb-4 px-4 py-2 rounded-xl border"
                            >
                                {PROJECT_STATUS.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={createProject}
                                disabled={loading}
                                className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white"
                            >
                                {loading ? "Creating..." : "Create Project"}
                            </button>
                        </div>

                        {/* LIST */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-yellow-200">
                            <h3 className="font-semibold mb-4">Projects</h3>

                            {projects.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => fetchProjectDetails(p.id)}
                                    className={`p-4 rounded-xl cursor-pointer ${activeProject?.id === p.id
                                        ? "bg-amber-100 border-l-4 border-amber-400"
                                        : "hover:bg-yellow-50"
                                        }`}
                                >
                                    <p className="font-medium">{p.name}</p>
                                    <p className="text-xs capitalize text-slate-500">{p.status}</p>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* RIGHT */}
                    <section className="col-span-8">
                        <div className="bg-white rounded-2xl p-8 shadow-md border border-yellow-200 min-h-[300px]">
                            {!activeProject && !detailsLoading && (
                                <p className="text-center text-slate-400">
                                    Select a project to view details
                                </p>
                            )}

                            {detailsLoading && <p>Loading...</p>}

                            {activeProject && (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-slate-800">
                                            {activeProject.name}
                                        </h2>

                                        <button
                                            onClick={openEditModal}
                                            className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-500 mb-1">Description</p>
                                        <p className="text-slate-700">
                                            {activeProject.description || "No description provided"}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-500 mb-1">Status</p>
                                        <p className="capitalize font-semibold text-amber-600">
                                            {activeProject.status}
                                        </p>
                                    </div>

                                    {/* Created At */}
                                    <div className="mb-2">
                                        <p className="text-sm text-slate-500 mb-1">Created At</p>
                                        <p className="text-slate-700">
                                            {new Date(activeProject.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Updated At */}
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Last Updated</p>
                                        <p className="text-slate-700">
                                            {new Date(activeProject.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Members Toggle */}
                            <div className="flex items-center gap-2 mt-6">
                                <input
                                    type="checkbox"
                                    checked={includeInactive}
                                    onChange={(e) => {
                                        const value = e.target.checked;
                                        setIncludeInactive(value);
                                        fetchProjectMembers(activeProject.id, value);
                                    }}
                                />
                                <span className="text-sm text-slate-600">
                                    Show inactive members
                                </span>
                            </div>
                            {/* Assign Members */}
                            <div className="mt-6 p-4 rounded-xl border bg-amber-50">
                                <h3 className="font-semibold mb-3">Add Member</h3>

                                {/* Role */}
                                <select
                                    value={assignRole}
                                    onChange={(e) => setAssignRole(e.target.value)}
                                    className="w-full mb-2 px-3 py-2 rounded-xl border"
                                >
                                    <option value="contributor">Contributor</option>
                                    <option value="lead">Lead</option>
                                    <option value="hr">HR</option>
                                    <option value="admin">Admin</option>
                                </select>

                                {/* Employee Search */}
                                <input
                                    value={employeeSearch}
                                    onChange={(e) => setEmployeeSearch(e.target.value)}
                                    placeholder="Search employee by name or ID"
                                    className="w-full mb-2 px-3 py-2 rounded-xl border"
                                />

                                {/* Dropdown */}
                                {filteredEmployees.length > 0 && (
                                    <div className="max-h-40 overflow-y-auto border rounded-xl mb-3 bg-white">
                                        {filteredEmployees.map((e) => (
                                            <div
                                                key={e.employeeId}
                                                onClick={() => {
                                                    setSelectedEmployee(e);
                                                    setEmployeeSearch(`${e.employeeId} - ${e.name}`);
                                                }}
                                                className="px-4 py-2 cursor-pointer hover:bg-yellow-50"
                                            >
                                                {e.employeeId} – {e.name}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={assignMembers}
                                    disabled={assignLoading || !selectedEmployee}
                                    className={`px-4 py-2 rounded-xl text-white ${assignLoading || !selectedEmployee
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-amber-400 hover:bg-amber-500"
                                        }`}
                                >
                                    {assignLoading ? "Assigning..." : "Assign Member"}
                                </button>
                            </div>


                            {/* Members List */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Project Members</h3>

                                {membersLoading && (
                                    <p className="text-sm text-gray-500">Loading members...</p>
                                )}

                                {!membersLoading && members.length === 0 && (
                                    <p className="text-sm text-gray-500">No members found</p>
                                )}

                                <div className="space-y-3">
                                    {members.map((m) => (
                                        <div
                                            key={m.id}
                                            className="flex justify-between items-center p-3 rounded-xl border bg-gray-50"
                                        >
                                            <div>
                                                <p className="font-medium">{m.employee.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Employee ID: {m.employee.employeeId}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <select
                                                    value={m.role}
                                                    onChange={(e) =>
                                                        updateMemberRole(m.employee.employeeId, e.target.value)
                                                    }
                                                    className="text-sm border rounded-lg px-2 py-1 capitalize"
                                                >
                                                    <option value="lead">Lead</option>
                                                    <option value="contributor">Contributor</option>
                                                </select>


                                                <p className="text-xs text-gray-500">
                                                    Joined: {new Date(m.joinedAt).toLocaleDateString()}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setMemberToRemove(m);
                                                        setShowUnassignModal(true);
                                                    }}
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* ===================== EDIT MODAL ===================== */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-[420px]">
                        <h3 className="font-semibold mb-4">Edit Project</h3>

                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full mb-3 px-4 py-2 rounded-xl border"
                        />

                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full mb-3 px-4 py-2 rounded-xl border"
                        />

                        <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full mb-4 px-4 py-2 rounded-xl border"
                        >
                            {PROJECT_STATUS.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 rounded-xl border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateProject}
                                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showUnassignModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[360px]">
                        <h3 className="font-semibold mb-2">Remove project member?</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Are you sure you want to remove{" "}
                            <b>{memberToRemove?.employee.name}</b> from this project?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowUnassignModal(false);
                                    setMemberToRemove(null);
                                }}
                                className="px-4 py-2 rounded-xl border"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={unassignMember}
                                disabled={unassignLoading}
                                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                            >
                                {unassignLoading ? "Removing..." : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HRProjects;
