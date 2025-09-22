import { useState } from "react";
import AddProjectModal from "../components/AddProject";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website with new design system",
      status: "Active",
      progress: 65,
      members: ["JS", "RK", "AM"],
      updated: "2h ago",
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android app development for client project",
      status: "Completed",
      progress: 100,
      members: ["NK", "SH"],
      updated: "1d ago",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      description: "Q1 2025 Marketing Strategy and Implementation",
      status: "Pending",
      progress: 0,
      members: ["RK", "AM", "SH"],
      updated: "2d ago",
    },
  ]);

  const [invitations, setInvitations] = useState([
    { id: 1, projectId: 1, name: "Emily Brown", email: "emily@example.com", role: "Viewer" },
    { id: 2, projectId: 2, name: "David Wilson", email: "david@example.com", role: "Editor" },
  ]);

  const handleAcceptInvitation = (inv) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === inv.projectId
          ? { ...p, members: [...p.members, inv.name] }
          : p
      )
    );
    setInvitations(invitations.filter((i) => i.id !== inv.id));
  };

  const handleRejectInvitation = (id) => {
    setInvitations(invitations.filter((i) => i.id !== id));
  };

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Active",
    progress: 0,
    members: [],
    updated: "Just now",
  });

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleAddProject = () => {
    setProjects([
      ...projects,
      { ...newProject, id: projects.length + 1 }
    ]);
    setNewProject({
      name: "",
      description: "",
      status: "Active",
      progress: 0,
      members: [],
      updated: "Just now",
    });
    setShowProjectForm(false);
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
                className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === "Active"
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
                  className={`h-2.5 rounded-full ${project.status === "Completed"
                    ? "bg-green-500"
                    : project.status === "Active"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                    }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {project.progress}%
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex -space-x-2">
                {project.members.map((m, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-white"
                  >
                    {m}
                  </span>
                ))}
              </div>
              <span>Updated {project.updated}</span>
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

      {/* Pending Invitations Section */}
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
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{inv.name}</td>
                  <td className="p-3">{inv.email}</td>
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
