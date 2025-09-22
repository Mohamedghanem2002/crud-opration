
const formatDate = (dateString) => {
  if (!dateString) return "Not set";
  try {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};


const AccountInfoSection = ({ userData }) => (
  <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Account Information</h3>
    <div className="grid md:grid-cols-2 gap-4">
      {userData.memberSince && (
        <div className="flex items-center">
          <label className="block text-gray-600">Member Since: </label>
          <p className="p-2 rounded">{formatDate(userData.memberSince)}</p>
        </div>
      )}
      {userData.lastLogin && (
        <div className="flex items-center">
          <label className="block text-gray-600">Last Login: </label>
          <p className="p-2 rounded">{formatDate(userData.lastLogin)}</p>
        </div>
      )}
    </div>
  </div>
);

export default AccountInfoSection;
