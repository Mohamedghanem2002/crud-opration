import { useEffect, useState } from "react";
import { auth, db } from "/firebaseconfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { isValidPhoneNumber } from "libphonenumber-js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export function useProfileData() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const projects = useSelector((state) => state.projects.projects);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          await setDoc(docRef, {
            name: user.displayName || "",
            email: user.email,
            phones: user.phoneNumber ? [user.phoneNumber] : [],
            bio: "",
            role: "",
            dob: "",
            location: "",
            links: [],
            memberSince: user.memberSince,
            lastLogin: user.lastLogin,
            completedTasks: 0,
            pendingTasks: 0,
            projectsCount: projects.length,
          });
          const newSnap = await getDoc(docRef);
          setUserData(newSnap.data());
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    const userRef = doc(db, "users", auth.currentUser.uid);

    let cleanedPhones = (formData.phones || []).filter(
      (p) => p.trim() !== "" && isValidPhoneNumber(p)
    );

    if (cleanedPhones.length === 0) {
      toast.error(
        "Please enter a valid phone number including your country code (e.g. +20XXXXXXXXXX)."
      );
      setSaving(false);
      return;
    }

    let rawLinks = formData.links || [];
    for (let link of rawLinks) {
      if ((link.title && !link.url) || (!link.title && link.url)) {
        toast.error("Both title and URL are required for links.");
        setSaving(false);
        return;
      }
    }

    let cleanedLinks = (formData.links || []).filter(
      (link) =>
        link &&
        link.title?.trim() !== "" &&
        link.url?.trim() !== "" &&
        /^https?:\/\/.+/.test(link.url)
    );

    if (!cleanedPhones.every(isValidPhoneNumber)) {
      toast.error("Invalid phone number format.");
      setSaving(false);
      return;
    }

    try {
      await updateDoc(userRef, {
        ...formData,
        phones: cleanedPhones,
        links: cleanedLinks,
        projectsCount: projects.length,
      });

      setUserData({
        ...userData,
        ...formData,
        phones: cleanedPhones,
        links: cleanedLinks,
        projectsCount: projects.length,
      });

      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return {
    userData,
    formData,
    setFormData,
    editMode,
    setEditMode,
    loading,
    saving,
    handleSave,
  };
}
