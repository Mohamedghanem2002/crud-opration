import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";
import {
  upsertProject,
  removeInvitationFirebase,
} from "../Redux/projectsSlice";
import toast from "react-hot-toast";

export const acceptInvitation = async (inv, dispatch) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return toast.error("User not logged in");

    const projectRef = doc(db, "projects", inv.projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) return toast.error("Project not found");

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

    const updatedSnap = await getDoc(projectRef);
    const updatedProject = { id: updatedSnap.id, ...updatedSnap.data() };

    dispatch(upsertProject(updatedProject));
    await removeInvitationFirebase(inv.id, dispatch);

    toast.success("Invitation accepted! 🎉");
  } catch (err) {
    console.error("Error in acceptInvitation:", err);
    toast.error("Failed to accept invitation");
  }
};

export const rejectInvitation = async (invId, dispatch) => {
  try {
    await removeInvitationFirebase(invId, dispatch);
    toast.success("Invitation rejected");
  } catch (err) {
    console.error(err);
    toast.error("Failed to reject invitation");
  }
};
