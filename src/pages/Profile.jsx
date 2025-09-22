import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "../components/loader";
import ProfileDetails from "./../components/profile/ProfileDetails";
import { auth } from "../../firebaseconfig";
import { useState } from "react";
import { useProfileData } from "../hooks/useUserProfile";
import ShareModel from "../components/profile/ShareModel";

export default function Profile() {
  const {
    userData,
    formData,
    setFormData,
    editMode,
    setEditMode,
    loading,
    saving,
    handleSave,
  } = useProfileData();

  const [showShare, setShowShare] = useState(false);

  if (loading || saving) return <LoadingOverlay />;

  const profileLink = `${window.location.origin}/profile/${auth.currentUser?.uid}`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-2xl p-6 space-y-6">
        <ProfileDetails
          userData={userData}
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
          setEditMode={setEditMode}
          loading={loading}
        />

        <div className="flex gap-4 mt-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setFormData(userData);
                  setEditMode(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Share My Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <ShareModel profileLink={profileLink} setShowShare={setShowShare} />
        )}
      </AnimatePresence>
    </div>
  );
}
