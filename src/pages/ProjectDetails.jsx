import { useParams } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addInvitationFirebase, upsertProject } from "../Redux/projectsSlice";
import { auth, db } from "../../firebaseconfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

// Import components
import AddMemberModal from "../components/AddMember";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ProjectHeader from "../components/ProjectDetails/ProjectHeader";
import TeamMembersSection from "../components/ProjectDetails/TeamMembersSection";
import LoadingComponent from "../components/ProjectDetails/Loading";

// Import utility functions
import {
  getRoleIcon,
  getRoleColor,
  getStatusColor,
  getProgressColor,
} from "../components/ProjectDetails/HelperFunction";

export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux state
  const projects = useSelector((state) => state.projects.projects);
  const project = projects.find((p) => p.id.toString() === id);

  // Local state
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // User data
  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserEmail = userData?.email || "";

  // New member form state
  const [newMember, setNewMember] = useState({
    inviteeEmail: "",
    inviterEmail: currentUserEmail,
    inviteeName: "",
    role: "",
    projectId: project ? project.id : "",
    projectName: project ? project.name : "",
    inviteStatus: "pending",
  });

  // Event handlers
  const handleChange = (e) =>
    setNewMember({ ...newMember, [e.target.name]: e.target.value });

  const handleAddMember = () => {
    setShowForm(true);
  };

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

    // Reset form
    setNewMember({
      inviteeEmail: "",
      inviterEmail: currentUserEmail,
      inviteeName: "",
      role: "",
      projectId: project.id,
      projectName: project.name,
      inviteStatus: "pending",
    });
  };

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
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

  const handleCloseModals = () => {
    setShowForm(false);
    setShowDeleteModal(false);
    setSelectedMember(null);
  };

  // Loading state
  if (!project) {
    return <LoadingComponent message="Loading project..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 py-4 sm:px-6 lg:px-8 lg:py-8 max-w-7xl mx-auto space-y-3 sm:space-y-6">
        {/* Project Header */}
        <ProjectHeader project={project} getProgressColor={getProgressColor} />

        {/* Team Members Section */}
        <TeamMembersSection
          project={project}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          getRoleIcon={getRoleIcon}
          getRoleColor={getRoleColor}
          getStatusColor={getStatusColor}
        />
      </div>

      {/* Modals */}
      {showForm && (
        <AddMemberModal
          newMember={newMember}
          onChange={handleChange}
          onClose={handleCloseModals}
          onSave={handleAdd}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        member={selectedMember}
      />
    </div>
  );
}
