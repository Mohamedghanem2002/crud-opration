import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AddMemberModal from "../components/AddMember";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const sampleProjects = [
      {
        id: 1,
        name: "Website Redesign",
        description: "Complete overhaul of company website with new design system",
        status: "Active",
        progress: 65,
        members: [],
        invitations: [
          { id: 1, name: "Emily Brown", email: "emily@example.com", role: "Viewer" },
        ],
      },
    ];

    const selected = sampleProjects.find((p) => p.id === parseInt(id));
    setProject(selected);
  }, [id]);

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "Admin",
      projects: 8,
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    projects: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  // Add member as invitation, not directly to team
  const handleAdd = () => {
    const newInvitation = {
      ...newMember,
      id: Date.now(),
      role: newMember.role || "Viewer",
    };

    setProject((prev) => ({
      ...prev,
      invitations: [...(prev?.invitations || []), newInvitation],
    }));

    setNewMember({
      name: "",
      email: "",
      role: "",
      projects: "",
      status: "Active",
    });
    setShowForm(false);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setNewMember(member);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };


  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-gray-600">{project.description}</p>
      <p>Status: {project.status}</p>
      <p>Progress: {project.progress}%</p>

      {/* Members avatars */}
      <div>
        <h2 className="text-lg font-semibold">Members</h2>
        <div className="flex -space-x-2 mt-2">
          {teamMembers.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-white"
            >
              {m.name.charAt(0)}
            </span>
          ))}
        </div>
      </div>

      {/* Team Members table */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            + Add Member
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="p-3">Member</th>
              <th className="p-3">Role</th>
              <th className="p-3">Projects</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                    {member.role}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{member.projects} Projects</td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    {member.status}
                  </span>
                </td>
                <td className="p-3 space-x-3 text-sm">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <AddMemberModal
          newMember={newMember}
          onChange={handleChange}
          onClose={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          onSave={handleAdd}
        />
      )}
    </div>
  );
}
