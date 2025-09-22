import LoadingOverlay from "./../loader";
import UserInfoSection from "./UserInfoSection";
import ContactSection from "./ContactSection";
import AboutSection from "./AboutSection";
import AccountInfoSection from "./AccountInfoSection";
import ActivityStatsSection from "./ActivityStatsSection";

export default function ProfileDetails({
  userData,
  editMode = false,
  formData,
  setFormData,
  loading,
  isPublic = false,
}) {
  if (loading) return <LoadingOverlay />;

  if (!userData) {
    return (
      <p className="text-center text-gray-500">No profile data available</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info */}
      <UserInfoSection
        userData={userData}
        formData={isPublic ? null : formData}
        setFormData={isPublic ? null : setFormData}
        editMode={!isPublic && editMode}
        isPublic={isPublic}
      />

      {/* Contact Info */}
      <ContactSection
        userData={userData}
        formData={isPublic ? null : formData}
        setFormData={isPublic ? null : setFormData}
        editMode={!isPublic && editMode}
        isPublic={isPublic}
      />

      {/* About */}
      <AboutSection
        userData={userData}
        formData={isPublic ? null : formData}
        setFormData={isPublic ? null : setFormData}
        editMode={!isPublic && editMode}
        isPublic={isPublic}
      />

      {/* Account Info */}
      {!isPublic && (
        <AccountInfoSection
          userData={userData}
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
        />
      )}

      {/* Stats */}
      <ActivityStatsSection userData={userData} />
    </div>
  );
}
