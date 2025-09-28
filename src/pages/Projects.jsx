import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmProjectDeleteModal from "./ConfirmProjectDeleteModal";
import AddProjectModal from "../components/AddProjectModal";
import EditProjectInfo from "../components/EditProjectInfo";
import formatDate from "../services/formatDate";
import useFetchInvitations from "../hooks/useFetchInvitations";
import useProjectsCount from "../hooks/useProjectsCount";
import toast from "react-hot-toast";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  setProjects,
  upsertProject,
  removeInvitationFirebase,
  removeProject,
} from "../Redux/projectsSlice";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";

export default function Projects() {
  const dispatch = useDispatch();
  useProjectsCount();
  useFetchInvitations();

  const projects = useSelector((state) => state.projects.projects);
  const invitations = useSelector((state) => state.projects.invitations);

  /* Search Projects */
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (p.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Pending",
    progress: 0,
    updated: new Date().toISOString(),
  });

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsList = querySnapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            createdAt:
              data.createdAt && typeof data.createdAt.toDate === "function"
                ? data.createdAt.toDate().getTime()
                : data.createdAt || Date.now(),
            updated:
              data.updated && typeof data.updated.toDate === "function"
                ? data.updated.toDate().getTime()
                : data.updated || Date.now(),
          };
        });

        dispatch(setProjects({ projectsList, currentUserId: currentUser.uid }));
      } catch (err) {
        toast.error("Error fetching projects");
        console.error(err);
      }
    };

    fetchProjects();
  }, [dispatch]);

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((p) => ({ ...p, [name]: value }));
  };

  // Add Projects
  const handleAddProject = async (projectData) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return toast.error("User not logged in");

      // Add project to Firestore
      const projectRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        createdAt: new Date().toISOString(),
        updated: new Date().toISOString(),
        ownerId: currentUser.uid,
        members: [
          {
            userId: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email,
            role: "Owner",
            status: "active",
          },
        ],
      });

      const projectSnap = await getDoc(projectRef);
      const project = { id: projectRef.id, ...projectSnap.data() };

      // Update Redux
      dispatch(upsertProject(project));

      // Reset form
      setNewProject({
        name: "",
        description: "",
        status: "Active",
        progress: 0,
        updated: new Date().toISOString(),
      });
      setShowProjectForm(false);

      toast.success("Project added successfully 🎉");
    } catch (err) {
      console.error("Error adding project:", err);
      toast.error("Error saving project");
    }
  };

  // Edit project
  const handleEditProject = (project) => {
    setEditProject(project);
    setShowEditForm(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "projects", selectedProject.id));
      toast.success("Project deleted successfully 🗑️");
      dispatch(removeProject(selectedProject.id));
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleteOpen(false);
      setSelectedProject(null);
    }
  };

  // Save Project Edit
  const handleSaveEdit = async () => {
    if (!editProject) return;
    try {
      const projectRef = doc(db, "projects", editProject.id);

      const updatedData = {
        name: editProject.name?.trim() || "Untitled Project", // ✅ تعديل الاسم
        description: editProject.description?.trim() || "", // ✅ تعديل الوصف
        status: editProject.status,
        progress: Number(editProject.progress),
        updated: new Date().toISOString(),
      };

      await updateDoc(projectRef, updatedData);

      const updatedSnap = await getDoc(projectRef);
      const updatedProject = { id: updatedSnap.id, ...updatedSnap.data() };

      dispatch(upsertProject(updatedProject));
      setShowEditForm(false);
      toast.success("Project updated successfully ✅");
    } catch (err) {
      console.error("Error updating project:", err);
      toast.error("Failed to update project");
    }
  };

  // Accept invitation
  const handleAcceptInvitation = async (inv) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return toast.error("User not logged in");

      const projectRef = doc(db, "projects", inv.projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        return toast.error("Project not found");
      }

      const projectData = projectSnap.data();
      const members = Array.isArray(projectData.members)
        ? projectData.members
        : [];

      const newMember = {
        userId: currentUser.uid,
        name:
          inv.inviteeName ||
          currentUser.displayName ||
          inv.inviteeEmail?.split?.("@")?.[0] ||
          "",
        email: currentUser.email,
        role: inv.role || "Viewer",
        status: "active",
      };

      const updatedMembers = [
        ...members.filter((m) => m.userId !== newMember.userId),
        newMember,
      ];

      await updateDoc(projectRef, { members: updatedMembers });
      console.log("Member added successfully to firestore");

      const updatedSnap = await getDoc(projectRef);
      const updatedProject = updatedSnap.exists()
        ? { id: updatedSnap.id, ...updatedSnap.data() }
        : { id: projectSnap.id, ...projectData };

      dispatch(upsertProject(updatedProject));
      await removeInvitationFirebase(inv.id, dispatch);

      toast.success("Invitation accepted! You joined the project 🎉");
    } catch (err) {
      console.error("Error in handleAcceptInvitation:", err);
      toast.error("Failed to accept invitation");
    }
  };

  //Reject Invetation
  const handleRejectInvitation = async (invId) => {
    try {
      await removeInvitationFirebase(invId, dispatch);
      toast.success("Invitation rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject invitation");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>

            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border-gray-300 pl-10 pr-3 py-2"
            />
          </div>

          {/* Filter */}
          <select className="w-full md:w-auto rounded-xl border-gray-300 py-2 px-3">
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        <button className="w-full md:w-auto bg-indigo-600 text-white py-2 px-4 rounded-xl md:text-sm">
          + Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition min-h-[280px]"
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === "In Process"
                    ? "bg-yellow-100 text-yellow-700"
                    : project.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {project.status}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditProject(project)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(project)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <Link to={`/projects/${project.id}`} className="cursor-pointer">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition line-clamp-2">
                {project.name}
              </h2>
            </Link>
            <Link to={`/projects/${project.id}`} className="cursor-pointer">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                {project.description}
              </p>
            </Link>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    project.status === "Completed"
                      ? "bg-green-500"
                      : project.status === "In Process"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                  style={{ width: `${project.progress ?? 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {project.progress ?? 0}%
              </p>
            </div>
            <Link to={`/projects/${project.id}`} className="cursor-pointer">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                <div className="flex -space-x-1 sm:-space-x-2">
                  {project.members?.slice(0, 3).map((m, index) => (
                    <span
                      key={m.userId ?? index}
                      className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border-2 border-white"
                      title={m.name || m.email}
                    >
                      {(m.name && m.name.charAt(0)) ||
                        (m.email && m.email.charAt(0)) ||
                        "?"}
                    </span>
                  ))}
                  {project.members?.length > 3 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border-2 border-white">
                      +{project.members.length - 3}
                    </span>
                  )}
                </div>
                <span className="text-right">
                  <span className="hidden sm:inline">Updated </span>
                  {formatDate(project.updated)}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(projects.length === 0 || filteredProjects.length === 0) && (
        <div className="text-center py-12 px-4">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📋</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first project to get started
          </p>
          <button
            onClick={() => setShowProjectForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Create Project
          </button>
        </div>
      )}

      {/* Invitations Section */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Pending Invitations
        </h2>

        {invitations.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No pending invitations
          </p>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block sm:hidden space-y-4">
              {invitations.map((inv, index) => (
                <div
                  key={inv.id || index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Project
                      </span>
                      <p className="font-semibold text-gray-800">
                        {inv.projectName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Invited By
                        </span>
                        <p className="text-sm text-gray-700 truncate">
                          {inv.inviterEmail}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Role
                        </span>
                        <p className="text-sm font-medium text-blue-600">
                          {inv.role}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Invitee
                      </span>
                      <p className="text-sm text-gray-700">
                        {inv.inviteeName || inv.name || ""} ({inv.inviteeEmail})
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleAcceptInvitation(inv)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectInvitation(inv.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-gray-600 text-sm border-b">
                    <th className="p-3 font-semibold">Project</th>
                    <th className="p-3 font-semibold">Invited By</th>
                    <th className="p-3 font-semibold">Invitee</th>
                    <th className="p-3 font-semibold">Role</th>
                    <th className="p-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {invitations.map((inv, index) => (
                    <tr
                      key={inv.id || index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{inv.projectName}</td>
                      <td className="p-3 text-gray-600">{inv.inviterEmail}</td>
                      <td className="p-3 text-gray-600">
                        <div>
                          <div className="font-medium">
                            {inv.inviteeName || inv.name || ""}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inv.inviteeEmail}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {inv.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptInvitation(inv)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectInvitation(inv.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmProjectDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        project={selectedProject}
      />
    </div>
  );
}
