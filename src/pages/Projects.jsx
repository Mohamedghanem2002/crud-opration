import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddProjectModal from "../components/AddProjectModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useSelector, useDispatch } from "react-redux";
import {
  setProjects,
  upsertProject,
  removeInvitationFirebase,
} from "../redux/projectsSlice";

import { auth, db } from "./../../firebaseconfig";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import formatDate from "../services/formatDate";
import toast from "react-hot-toast";
import useFetchInvitations from "../hooks/useFetchInvitations";
import useProjectsCount from "../hooks/useProjectsCount";

export default function Projects() {
  useProjectsCount();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const invitations = useSelector((state) => state.projects.invitations);

  useFetchInvitations();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Active",
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

  const handleSaveEdit = async () => {
    if (!editProject) return;
    try {
      const projectRef = doc(db, "projects", editProject.id);
      const updatedData = {
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

      // عضو جديد
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
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-10 min-h-screen">
      {/* Projects Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Projects
        </h2>
        <button
          onClick={() => setShowProjectForm(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm sm:text-base"
        >
          + Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition min-h-[280px]"
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${project.status === "Active"
                  ? "bg-yellow-100 text-yellow-700"
                  : project.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {project.status}
              </span>
              <button
                onClick={() => handleEditProject(project)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
            </div>

            <Link to={`/projects/${project.id}`} className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition line-clamp-2">
                {project.name}
              </h2>
            </Link>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
              {project.description}
            </p>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${project.status === "Completed"
                    ? "bg-green-500"
                    : project.status === "Active"
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
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
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

      {showProjectForm && (
        <AddProjectModal
          newProject={newProject}
          onChange={handleProjectChange}
          onClose={() => setShowProjectForm(false)}
          onSave={handleAddProject}
        />
      )}

      {/* Edit Project Modal */}
      {showEditForm && editProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Project
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editProject.status}
                  onChange={(e) =>
                    setEditProject((p) => ({ ...p, status: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editProject.progress}
                  onChange={(e) =>
                    setEditProject((p) => ({
                      ...p,
                      progress: Math.max(
                        0,
                        Math.min(100, Number(e.target.value))
                      ),
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
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
    </div>
  );
}