import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddProjectModal from "../components/AddProject";
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
                : data.createdAt || Date.now(), // fallback لو مش موجود
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

      // عضو جديد بشكل ثابت
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

      // نعمل overwrite بدون تكرار
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
    <div className="p-6 space-y-10">
      {/* Projects Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        <button
          onClick={() => setShowProjectForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          + Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === "Active"
                    ? "bg-yellow-100 text-yellow-700"
                    : project.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {project.status}
              </span>
              <span className="text-gray-400 text-sm">★</span>
            </div>

            <Link to={`/projects/${project.id}`}>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {project.name}
              </h2>
            </Link>
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>

            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    project.status === "Completed"
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

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex -space-x-2">
                {project.members?.map((m, index) => (
                  <span
                    key={m.userId ?? index}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-white"
                    title={m.name || m.email}
                  >
                    {(m.name && m.name.charAt(0)) ||
                      (m.email && m.email.charAt(0)) ||
                      "?"}
                  </span>
                ))}
              </div>
              <span>Updated {formatDate(project.updated)}</span>
            </div>
          </div>
        ))}
      </div>

      {showProjectForm && (
        <AddProjectModal
          newProject={newProject}
          onChange={handleProjectChange}
          onClose={() => setShowProjectForm(false)}
          onSave={handleAddProject}
        />
      )}

      {/* Invitations Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Pending Invitations
        </h2>

        {invitations.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending invitations</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600 text-sm border-b">
                <th className="p-3">Project</th>
                <th className="p-3">Invited By</th>
                <th className="p-3">Invitee</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invitations.map((inv, index) => (
                <tr key={inv.id || index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{inv.projectName}</td>
                  <td className="p-3">{inv.inviterEmail}</td>
                  <td className="p-3">
                    {inv.inviteeName || inv.name || ""} ({inv.inviteeEmail})
                  </td>
                  <td className="p-3">{inv.role}</td>
                  <td className="p-3 space-x-3 text-sm">
                    <button
                      onClick={() => handleAcceptInvitation(inv)}
                      className="text-green-600 hover:underline"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectInvitation(inv.id)}
                      className="text-red-600 hover:underline"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
