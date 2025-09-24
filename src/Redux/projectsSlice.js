import { createSlice } from "@reduxjs/toolkit";
import { db } from "./../../firebaseconfig";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import toast from "react-hot-toast";

const initialState = {
  projects: [],
  invitations: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      const { projectsList, currentUserId } = action.payload || {};
      if (!Array.isArray(projectsList) || !currentUserId) {
        state.projects = [];
        return;
      }
      state.projects = projectsList.filter(
        (project) =>
          Array.isArray(project.members) &&
          project.members.some((member) => member.userId === currentUserId)
      );
    },

    upsertProject: (state, action) => {
      const project = action.payload;
      const existingIndex = state.projects.findIndex(
        (p) => p.id === project.id
      );
      if (existingIndex >= 0) {
        state.projects[existingIndex] = project;
      } else {
        state.projects.push(project);
      }
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },

    addInvitation: (state, action) => {
      state.invitations.push(action.payload);
    },
    removeInvitation: (state, action) => {
      state.invitations = state.invitations.filter(
        (i) => i.id !== action.payload
      );
    },
    setInvitations: (state, action) => {
      state.invitations = action.payload || [];
    },
  },
});

export const {
  setProjects,
  upsertProject,
  removeProject,
  addInvitation,
  removeInvitation,
  setInvitations,
} = projectsSlice.actions;

// Firebase helpers
export const addProjectFirebase = async (project, currentUser, dispatch) => {
  try {
    const userMember = {
      userId: currentUser.uid,
      name: currentUser.displayName,
      email: currentUser.email,
      status: "accepted",
    };

    const projectWithMember = {
      ...project,
      members: [userMember],
      createdAt: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "projects"), projectWithMember);
    dispatch(upsertProject({ ...projectWithMember, id: docRef.id }));

    toast.success("Project added successfully 🎉");
    return true;
  } catch (error) {
    console.error(error);
    toast.error("Error adding project"); 
    return false; 
  }
};

export const selectFilteredProjects = (searchTerm) =>
  createSelector(
    (state) => state.projects.projects,
    (projects) =>
      projects.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

export const addInvitationFirebase = async (invitation, dispatch) => {
  try {
    const docRef = await addDoc(collection(db, "invitations"), invitation);
    dispatch(addInvitation({ ...invitation, id: docRef.id }));
  } catch (error) {
    toast.error("Error adding invitation:", error);
  }
};

export const removeInvitationFirebase = async (invitationId, dispatch) => {
  try {
    await deleteDoc(doc(db, "invitations", invitationId));
    dispatch(removeInvitation(invitationId));
  } catch (error) {
    toast.error("Error removing invitation:", error);
  }
};

export const acceptInvitationFirebase = async (
  invitation,
  currentUser,
  dispatch
) => {
  try {
    if (!invitation?.projectId || !currentUser?.uid) {
      toast.error("Invalid invitation data");
      return;
    }

    const projectRef = doc(db, "projects", invitation.projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      toast.error("Project not found");
      return;
    }

    const projectData = projectSnap.data();

    const newMember = {
      userId: currentUser.uid,
      name: currentUser.displayName,
      email: currentUser.email,
      status: "accepted",
    };

    const alreadyMember = projectData.members?.some(
      (m) => m.userId === currentUser.uid
    );

    if (!alreadyMember) {
      await updateDoc(projectRef, {
        members: arrayUnion(newMember),
        updated: new Date().toISOString(),
      });
    }

    const updatedData = {
      ...projectData,
      members: alreadyMember
        ? projectData.members
        : [...projectData.members, newMember],
      id: invitation.projectId,
    };

    dispatch(upsertProject(updatedData));

    if (invitation.id) {
      await deleteDoc(doc(db, "invitations", invitation.id));
      dispatch(removeInvitation(invitation.id));
    }

    toast.success("Invitation accepted!");
  } catch (error) {
    console.error("Error in acceptInvitationFirebase:", error);
    toast.error("Failed to accept invitation");
  }
};

export default projectsSlice.reducer;
