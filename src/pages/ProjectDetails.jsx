import { useParams } from "react-router-dom";
import { useState } from "react";
import AddMemberModal from "../components/AddMember";
import { useSelector, useDispatch } from "react-redux";
import { addInvitationFirebase, upsertProject } from "../redux/projectsSlice";
import { auth, db } from "../../firebaseconfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import toast from "react-hot-toast";

export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects.projects);
  const project = projects.find((p) => p.id.toString() === id);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserEmail = userData?.email || "";

  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({
    inviteeEmail: "",
    inviterEmail: currentUserEmail,
    inviteeName: "",
    role: "",
    projectId: project ? project.id : "",
    projectName: project ? project.name : "",
    inviteStatus: "pending",
  });

  const handleChange = (e) =>
    setNewMember({ ...newMember, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!project || !auth.currentUser) return;

    const invitationData = {
      inviteeEmail: newMember.inviteeEmail,
      inviterEmail: currentUserEmail,
      inviteeName: newMember.inviteeName,
      role: newMember.role,
      projectId: project.id,
      projectName: project.name,
      inviteStatus: "pending",
    };

    addInvitationFirebase(invitationData, dispatch);

    toast.success("Invitation Sent Successfully!");
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    try {
      const projectRef = doc(db, "projects", project.id);

      const updatedMembers = project.members.filter(
        (m) => m.userId !== selectedMember.userId
      );

      await updateDoc(projectRef, { members: updatedMembers });

      const updatedSnap = await getDoc(projectRef);
      if (updatedSnap.exists()) {
        dispatch(upsertProject({ id: project.id, ...updatedSnap.data() }));
      }

      toast.success("Member removed successfully!");
    } catch (err) {
      console.error("Error removing member:", err);
      toast.error("Failed to remove member");
    } finally {
      setSelectedMember(null);
      setShowDeleteModal(false);
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-gray-600">{project.description}</p>
      <p>Status: {project.status}</p>
      <p>Progress: {project.progress}%</p>

      {/* Team Members Avatars */}
      <div>
        <h2 className="text-lg font-semibold">Members</h2>
        <div className="flex -space-x-2 mt-2">
          {project.members?.map((m, index) => (
            <span
              key={m.userId || index}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-white"
              title={m.name || m.email}
            >
              {m.name?.charAt(0) || m.email?.charAt(0) || "?"}
            </span>
          ))}
        </div>
      </div>

      {/* Team Members Table */}
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
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {project.members?.map((member, index) => (
              <tr
                key={member.userId || index}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{member.name || member.email}</td>
                <td className="p-3">{member.role || "Viewer"}</td>
                <td className="p-3">{member.status}</td>
                <td className="p-3 space-x-3 text-sm">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowDeleteModal(true);
                    }}
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
          onClose={() => setShowForm(false)}
          onSave={handleAdd}
        />
      )}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        member={selectedMember}
      />
    </div>
  );
}
