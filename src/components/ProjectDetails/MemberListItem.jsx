import { UserMinus } from "lucide-react";

const MemberListItem = ({
  member,
  index,
  onRemove,
  getRoleIcon,
  getRoleColor,
  getStatusColor
}) => {
  return (
    <div className="p-3 sm:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-md">
            {member.name?.charAt(0) || member.email?.charAt(0) || "?"}
          </div>
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {member.name || "Anonymous User"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">
                {member.email}
              </p>

              {/* Mobile: Role and Status in a column */}
              <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 font-medium">Role:</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getRoleColor(member.role)}`}>
                    {getRoleIcon(member.role)}
                    {member.role || "Viewer"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status || "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <div className="mt-2 sm:mt-0">
              <button
                onClick={() => onRemove(member)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded text-xs sm:text-sm font-medium transition-all duration-200 w-full sm:w-auto justify-center"
              >
                <UserMinus size={14} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberListItem;
