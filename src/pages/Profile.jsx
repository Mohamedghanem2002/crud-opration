import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "../components/loader";
import ProfileDetails from "./../components/profile/ProfileDetails";
import { auth } from "../../firebaseconfig";
import { useState } from "react";
import { useProfileData } from "../hooks/useUserProfile";
import ShareModel from "../components/profile/ShareModel";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  if (loading || saving) return <LoadingOverlay />;

  const profileLink = `${window.location.origin}/profile/${auth.currentUser?.uid}`;

return (
  <div className="p-4 sm:p-6 max-w-4xl mx-auto">
    <div className="bg-gray-50 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8">
      <ProfileDetails
        userData={userData}
        formData={formData}
        setFormData={setFormData}
        editMode={editMode}
        setEditMode={setEditMode}
        loading={loading}
      />

<div className="flex flex-col md:flex-row flex-wrap gap-4 mt-4 justify-center md:justify-end">
  {editMode ? (
    <>
      <button
        onClick={handleSave}
        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        {t("save")}
      </button>
      <button
        onClick={() => setEditMode(false)}
        className="w-full md:w-auto px-6 py-3 border border-gray-300 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200"
      >
        {t("cancel")}
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => {
          setFormData(userData);
          setEditMode(true);
        }}
        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        {t("editProfile")}
      </button>
      <button
        onClick={() => setShowShare(true)}
        className="w-full md:w-auto px-6 py-3 bg-green-500 text-white font-semibold rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
      >
        {t("shareProfile")}
      </button>
    </>
  )}
</div>

    {/* Share Modal */}
    <AnimatePresence>
      {showShare && (
        <ShareModel profileLink={profileLink} setShowShare={setShowShare} />
      )}
    </AnimatePresence>
  </div>
  </div>
);

}
