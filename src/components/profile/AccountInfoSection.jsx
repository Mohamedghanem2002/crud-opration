import formatDate from "../../services/formatDate";

const AccountInfoSection = ({ userData }) => (
  <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <h3 className="text-lg font-semibold mb-4">Account Information</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      {userData.memberSince && (
        <div className="flex flex-col">
          <label className="text-gray-500 mb-1">Member Since</label>
          <p className="p-2 rounded bg-gray-50 w-auto">
            {formatDate(userData.memberSince)}
          </p>
        </div>
      )}
      {userData.lastLogin && (
        <div className="flex flex-col">
          <label className="text-gray-500 mb-1">Last Login</label>
          <p className="p-2 rounded bg-gray-50 w-auto">
            {formatDate(userData.lastLogin)}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default AccountInfoSection;
