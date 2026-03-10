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


    // create task (NEW)
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState("medium");
    const [taskDueAt, setTaskDueAt] = useState("");
    const [taskLoading, setTaskLoading] = useState(false);



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


    // TASK FILTERS
    const [filterStatus, setFilterStatus] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterAssignedTo, setFilterAssignedTo] = useState("");
    const [filterDueFrom, setFilterDueFrom] = useState("");
    const [filterDueTo, setFilterDueTo] = useState("");


    // assign task modal
    const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
    const [assignTaskId, setAssignTaskId] = useState(null);
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);


    /* ===================== TASK DETAILS ===================== */
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [taskLoadingDetails, setTaskLoadingDetails] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [taskStatus, setTaskStatus] = useState("todo");


    const [showTasks, setShowTasks] = useState(false);




    // edit task modal
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskPriority, setEditTaskPriority] = useState("medium");
    const [editTaskDueAt, setEditTaskDueAt] = useState("");

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

    /* ===================== CREATE TASK ===================== */
    /* ===================== CREATE TASK ===================== */
    const createTask = async () => {
        if (!activeProject) return alert("Select a project first");
        if (!taskTitle.trim()) return alert("Task title is required");

        setTaskLoading(true);

        try {
            const createRes = await fetch(
                "https://backend.hrms.transev.site/hr/task/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        projectId: activeProject.id,
                        title: taskTitle.trim(),
                        description: taskDescription?.trim() || null,
                        priority: taskPriority,
                        status: taskStatus, // ✅ ADD HERE
                        dueAt: taskDueAt
                            ? new Date(taskDueAt).toISOString()
                            : null,
                    }),
                }
            );

            const createData = await createRes.json();
            console.log("Create Response:", createData);

            if (createData.status !== "success") {
                alert("Failed to create task");
                return;
            }

            await fetchTasks(); // ✅ correct place
            setTaskTitle("");
            setTaskDescription("");
            setTaskDueAt("");
            setTaskPriority("medium");

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setTaskLoading(false);
        }

    };
    useEffect(() => {
        if (!activeProject) return;
        if (!filterStatus) return; // 🔥 DO NOT LOAD UNTIL STATUS IS SELECTED

        fetchTasks();
    }, [filterStatus]);

    const fetchTasks = async () => {
        if (!activeProject) return;
        if (!filterStatus) return; // 🔥 extra safety

        // ✅ ADD THIS BLOCK HERE
        const payload = {
            projectId: activeProject.id,
            onlyIds: false,
        };

        if (filterStatus) payload.status = filterStatus;
        if (filterPriority) payload.priority = filterPriority;
        if (filterDueFrom) payload.dueFrom = filterDueFrom;
        if (filterDueTo) payload.dueTo = filterDueTo;

        // ✅ fetch uses payload
        const res = await fetch(
            "https://backend.hrms.transev.site/hr/task/get-by-project",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();
        if (data.status === "success") {
            setTasks(data.data);
        }
    };




    /* ===================== EDIT TASK ===================== */
    const editTask = async ({ taskId, priority, dueAt }) => {
        if (!taskId) return;

        try {
            const res = await fetch(
                "https://backend.hrms.transev.site/hr/task/edit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        taskId,
                        priority,
                        dueAt,
                    }),
                }
            );

            const data = await res.json();

            if (data.status !== "success") {
                alert("Failed to update task");
                return;
            }

            // ✅ Refresh list + active task
            await fetchTasks();

            if (activeTaskId === taskId) {
                setActiveTask((prev) =>
                    prev
                        ? {
                            ...prev,
                            priority,
                            dueAt,
                        }
                        : prev
                );
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong while updating task");
        }
    };

    const openAssignTaskModal = (task) => {
        setAssignTaskId(task.id);
        setSelectedMemberIds(
            task.assignments?.map((a) => a.projectMemberId) || []
        );
        setShowAssignTaskModal(true);
    };

    const openEditTaskModal = (task) => {
        setEditTaskId(task.id);
        setEditTaskPriority(task.priority);
        setEditTaskDueAt(
            task.dueAt ? task.dueAt.split("T")[0] : ""
        );
        setShowEditTaskModal(true);
    };
    const assignTask = async ({ taskId, projectMemberIds }) => {
        try {
            await fetch("https://backend.hrms.transev.site/hr/task/assign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    taskId,
                    projectMemberIds,
                }),
            });

            fetchTasks(); // refresh list
        } catch (err) {
            console.error("Assign task failed", err);
        }
    };


    /* ===================== GET PROJECT (ON CLICK) ===================== */
    const fetchProjectDetails = (projectId) => {
        setDetailsLoading(true);


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
                    setTasks([]);
                    setFilterStatus(""); // 🔥 reset status filter

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
                    <aside className="col-span-4 space-y-6 sticky top-8 h-fit">
                        {/* CREATE */}
                        <div className="bg-gradient-to-br from-amber-100 to-white 
                rounded-2xl p-6 border border-amber-200 shadow-sm">

                            <h3 className="font-semibold text-lg mb-4 text-slate-800">
                                ➕ Create New Project
                            </h3>


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
                                    className={`p-4 rounded-xl cursor-pointer transition-all
    ${activeProject?.id === p.id
                                            ? "bg-amber-100 border-l-4 border-amber-500 shadow-sm"
                                            : "hover:bg-yellow-50"
                                        }`}
                                >
                                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full 
                 bg-amber-200 text-amber-800 capitalize">
                                        {p.status}
                                    </span>

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
                                    {/* ===== PROJECT HEADER (SLICK & COMPACT) ===== */}
                                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 flex items-center justify-between">

                                        {/* LEFT */}
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-semibold text-slate-800 truncate">
                                                {activeProject.name}
                                            </h2>

                                            <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                                                <span className="capitalize font-medium text-amber-600">
                                                    ● {activeProject.status}
                                                </span>

                                                <span>
                                                    Created{" "}
                                                    <b className="text-slate-700">
                                                        {new Date(activeProject.createdAt).toLocaleDateString()}
                                                    </b>
                                                </span>

                                                <span>
                                                    Updated{" "}
                                                    <b className="text-slate-700">
                                                        {new Date(activeProject.updatedAt).toLocaleDateString()}
                                                    </b>
                                                </span>
                                            </div>
                                        </div>

                                        {/* RIGHT */}
                                        <button
                                            onClick={openEditModal}
                                            className="shrink-0 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium hover:bg-amber-100"
                                        >
                                            ✏️ Edit
                                        </button>
                                    </div>

                                    {/* ===== CREATE TASK (HORIZONTAL & CLEAN) ===== */}
                                    <div className="mb-6 flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm focus-within:border-blue-500">

                                        <input
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                            placeholder="New task title"
                                            className="flex-[2] bg-transparent outline-none text-sm font-medium placeholder:text-slate-400"
                                        />

                                        <input
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            placeholder="Short note"
                                            className="flex-[3] bg-transparent outline-none text-xs text-slate-500 placeholder:text-slate-400"
                                        />

                                        <select
                                            value={taskPriority}
                                            onChange={(e) => setTaskPriority(e.target.value)}
                                            className="text-xs rounded-lg bg-slate-100 px-2 py-1 outline-none"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>

                                        <input
                                            type="date"
                                            value={taskDueAt}
                                            onChange={(e) => setTaskDueAt(e.target.value)}
                                            className="text-xs rounded-lg bg-slate-100 px-2 py-1 outline-none"
                                        />

                                        <button
                                            onClick={createTask}
                                            disabled={!taskTitle}
                                            className="h-8 w-8 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40"
                                        >
                                            +
                                        </button>
                                    </div>
                                    {/* ===== ACTIVE TASK PREVIEW ===== */}
                                    {activeTask && (
                                        <div className="mb-6 rounded-xl border bg-slate-50 px-4 py-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-semibold text-slate-800">
                                                    {activeTask.title}
                                                </h4>

                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] text-blue-700 capitalize">
                                                    {activeTask.status}
                                                </span>
                                            </div>

                                            {activeTask.description && (
                                                <p className="mt-1 text-xs text-slate-600">
                                                    {activeTask.description}
                                                </p>
                                            )}

                                            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                                                <span>Priority: <b>{activeTask.priority}</b></span>

                                                {activeTask.dueAt && (
                                                    <span>
                                                        Due:{" "}
                                                        <b>{new Date(activeTask.dueAt).toLocaleDateString()}</b>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-4 flex items-center gap-2">

                                        {/* Status FILTER */}
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="text-xs rounded-lg bg-slate-100 px-2 py-1 outline-none"
                                        >
                                            <option value="">All</option>
                                            <option value="todo">To do</option>
                                            <option value="in_progress">In progress</option>
                                            <option value="blocked">Blocked</option>
                                            <option value="done">Done</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>

                                    </div>

                                    {/* ===== TASK LIST ===== */}
                                    {/* ===== TASK LIST ===== */}
                                    {tasks.length === 0 && (
                                        <p className="text-[11px] text-slate-500 mb-3 italic">
                                            No tasks yet
                                        </p>
                                    )}

                                    {tasks.map((task) => {
                                        const isActive = activeTaskId === task.id;

                                        return (
                                            <div
                                                key={task.id}
                                                onClick={() => {
                                                    setActiveTaskId(task.id);
                                                    setActiveTask(task);
                                                }}
                                                className={`
                mb-2 p-3 rounded-lg cursor-pointer
                border transition-all duration-150
                ${isActive
                                                        ? "border-slate-300 bg-slate-50"
                                                        : "border-transparent hover:border-slate-200 hover:bg-slate-50/70"}
            `}
                                            >
                                                {/* Title + Status */}
                                                <div className="flex justify-between items-center mb-1 gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openAssignTaskModal(task);
                                                        }}
                                                        className="text-[10px] px-2 py-0.5 rounded-md border hover:bg-slate-100"
                                                    >
                                                        👤 Assign
                                                    </button>
                                                    <p className="text-sm font-medium text-slate-900 truncate">
                                                        {task.title}
                                                    </p>

                                                    <span
                                                        className={`
                        text-[10px] capitalize px-2 py-[2px] rounded-full
                        ${task.status === "done" && "bg-emerald-50 text-emerald-600"}
                        ${task.status === "in_progress" && "bg-sky-50 text-sky-600"}
                        ${task.status === "blocked" && "bg-rose-50 text-rose-600"}
                        ${task.status === "todo" && "bg-slate-100 text-slate-500"}
                    `}
                                                    >
                                                        {task.status.replace("_", " ")}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditTaskModal(task);
                                                        }}
                                                        className="text-[10px] px-2 py-0.5 rounded-md border hover:bg-slate-100"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                </div>

                                                {/* Meta */}
                                                <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 mt-1">
                                                    <span>
                                                        Priority:
                                                        <b
                                                            className={`
                            ml-1
                            ${task.priority === "urgent" && "text-rose-600"}
                            ${task.priority === "high" && "text-orange-600"}
                            ${task.priority === "medium" && "text-sky-600"}
                            ${task.priority === "low" && "text-slate-600"}
                        `}
                                                        >
                                                            {task.priority}
                                                        </b>
                                                    </span>

                                                    {task.dueAt && (
                                                        <span>
                                                            Due:
                                                            <b className="ml-1 text-slate-700">
                                                                {new Date(task.dueAt).toLocaleDateString()}
                                                            </b>
                                                        </span>
                                                    )}

                                                    {task.assignments?.length > 0 && (
                                                        <span className="truncate">
                                                            {task.assignments.length} assignee
                                                            {task.assignments.length > 1 ? "s" : ""}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                {task.description && (
                                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </>
                            )}


                            {/* ===== MEMBERS CONTROL BAR ===== */}
                            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">

                                {/* Toggle */}
                                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeInactive}
                                        onChange={(e) => {
                                            const value = e.target.checked;
                                            setIncludeInactive(value);
                                            fetchProjectMembers(activeProject.id, value);
                                        }}
                                        className="accent-amber-500"
                                    />
                                    Show inactive
                                </label>

                                {/* Divider */}
                                <div className="h-5 w-px bg-slate-200" />

                                {/* Role */}
                                <select
                                    value={assignRole}
                                    onChange={(e) => setAssignRole(e.target.value)}
                                    className="rounded-lg bg-slate-100 px-2 py-1 text-xs outline-none"
                                >
                                    <option value="contributor">Contributor</option>
                                    <option value="lead">Lead</option>
                                    <option value="hr">HR</option>
                                    <option value="admin">Admin</option>
                                </select>

                                {/* Employee Search */}
                                <div className="relative flex-1 min-w-[220px]">
                                    <input
                                        value={employeeSearch}
                                        onChange={(e) => setEmployeeSearch(e.target.value)}
                                        placeholder="Search employee"
                                        className="w-full rounded-lg border px-3 py-1.5 text-xs outline-none focus:border-amber-400"
                                    />

                                    {/* Dropdown */}
                                    {filteredEmployees.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border bg-white shadow">
                                            {filteredEmployees.map((e) => (
                                                <div
                                                    key={e.employeeId}
                                                    onClick={() => {
                                                        setSelectedEmployee(e);
                                                        setEmployeeSearch(`${e.employeeId} - ${e.name}`);
                                                    }}
                                                    className="cursor-pointer px-3 py-2 text-xs hover:bg-amber-50"
                                                >
                                                    {e.employeeId} — {e.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Assign Button */}
                                <button
                                    onClick={assignMembers}
                                    disabled={assignLoading || !selectedEmployee}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition
      ${assignLoading || !selectedEmployee
                                            ? "bg-slate-300 cursor-not-allowed"
                                            : "bg-amber-500 hover:bg-amber-600"
                                        }`}
                                >
                                    {assignLoading ? "Assigning..." : "Add"}
                                </button>
                            </div>



                            {/* ===== PROJECT MEMBERS (COMPACT) ===== */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-slate-700">
                                        Project Members
                                    </h3>
                                    <span className="text-xs text-slate-400">
                                        {members.length} total
                                    </span>
                                </div>

                                {membersLoading && (
                                    <p className="text-xs text-slate-400">Loading members...</p>
                                )}

                                {!membersLoading && members.length === 0 && (
                                    <p className="text-xs text-slate-400">No members found</p>
                                )}

                                <div className="divide-y rounded-xl border bg-white">
                                    {members.map((m) => {
                                        const isActive = m.leftAt === null; // ✅ DEFINE IT HERE

                                        return (
                                            <div
                                                key={m.id}
                                                className={`flex justify-between items-center p-3 rounded-xl border
        ${isActive ? "bg-white" : "bg-slate-50 opacity-70"}
      `}
                                            >
                                                {/* LEFT */}
                                                <div>
                                                    <p className="font-medium text-sm">{m.employee.name}</p>
                                                    <p className="text-[11px] text-gray-500">
                                                        ID: {m.employee.employeeId}
                                                    </p>
                                                </div>

                                                {/* RIGHT */}
                                                <div className="text-right space-y-1">
                                                    <select
                                                        value={m.role}
                                                        disabled={!isActive}
                                                        onChange={(e) =>
                                                            updateMemberRole(m.employee.employeeId, e.target.value)
                                                        }
                                                        className="text-xs border rounded-lg px-2 py-1 capitalize disabled:bg-slate-100"
                                                    >
                                                        <option value="lead">Lead</option>
                                                        <option value="contributor">Contributor</option>
                                                    </select>

                                                    <p className="text-[11px] text-gray-500">
                                                        Joined: {new Date(m.joinedAt).toLocaleDateString()}
                                                    </p>

                                                    {isActive ? (
                                                        <button
                                                            onClick={() => {
                                                                setMemberToRemove(m);
                                                                setShowUnassignModal(true);
                                                            }}
                                                            className="text-xs text-red-600 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    ) : (
                                                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </main>

            {/* ===================== EDIT MODAL ===================== */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-xl bg-white shadow-lg">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-5 py-3">
                            <h3 className="text-sm font-semibold text-slate-800">
                                Edit Project
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4 space-y-3">
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Project name"
                                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                            />

                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Project description"
                                rows={3}
                                className="w-full rounded-lg border px-3 py-2 text-sm resize-none focus:border-amber-400 focus:outline-none"
                            />

                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full rounded-lg border bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                            >
                                {PROJECT_STATUS.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t px-5 py-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="rounded-lg border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateProject}
                                className="rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showUnassignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-5 py-3">
                            <h3 className="text-sm font-semibold text-slate-800">
                                Remove member
                            </h3>
                            <button
                                onClick={() => {
                                    setShowUnassignModal(false);
                                    setMemberToRemove(null);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Remove <span className="font-medium text-slate-800">
                                    {memberToRemove?.employee.name}
                                </span>{" "}
                                from this project?
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t px-5 py-3">
                            <button
                                onClick={() => {
                                    setShowUnassignModal(false);
                                    setMemberToRemove(null);
                                }}
                                className="rounded-lg border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={unassignMember}
                                disabled={unassignLoading}
                                className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                            >
                                {unassignLoading ? "Removing…" : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showEditTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-5 py-3">
                            <h3 className="text-sm font-semibold text-slate-800">
                                Edit Task
                            </h3>
                            <button
                                onClick={() => setShowEditTaskModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4 space-y-3">

                            {/* Priority */}
                            <select
                                value={editTaskPriority}
                                onChange={(e) => setEditTaskPriority(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>

                            {/* Due Date */}
                            <input
                                type="date"
                                value={editTaskDueAt}
                                onChange={(e) => setEditTaskDueAt(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t px-5 py-3">
                            <button
                                onClick={() => setShowEditTaskModal(false)}
                                className="rounded-lg border px-3 py-1.5 text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await editTask({
                                        taskId: editTaskId,
                                        priority: editTaskPriority,
                                        dueAt: editTaskDueAt
                                            ? new Date(editTaskDueAt).toISOString()
                                            : null,
                                    });
                                    setShowEditTaskModal(false);
                                }}
                                className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>


            )}

            {showAssignTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-5 py-3">
                            <h3 className="text-sm font-semibold text-slate-800">
                                Assign Task
                            </h3>
                            <button
                                onClick={() => setShowAssignTaskModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4 space-y-2 max-h-64 overflow-y-auto">

{members.map((m) => (
    <label
        key={m.id}
        className="flex items-center gap-2 text-sm"
    >
        <input
            type="checkbox"
            checked={selectedMemberIds.includes(m.id)}
            onChange={(e) => {
                setSelectedMemberIds((prev) =>
                    e.target.checked
                        ? [...prev, m.id]
                        : prev.filter((id) => id !== m.id)
                );
            }}
        />
        <span>{m.employee.name}</span>
    </label>
))}

                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t px-5 py-3">
                            <button
                                onClick={() => setShowAssignTaskModal(false)}
                                className="rounded-lg border px-3 py-1.5 text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await assignTask({
                                        taskId: assignTaskId,
                                        projectMemberIds: selectedMemberIds,
                                    });
                                    setShowAssignTaskModal(false);
                                }}
                                className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default HRProjects;
