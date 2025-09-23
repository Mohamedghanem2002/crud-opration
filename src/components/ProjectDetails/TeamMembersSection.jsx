import { Users, Plus } from "lucide-react";
import MemberListItem from "./MemberListItem";

const TeamMembersSection = ({
  project,
  onAddMember,
  onRemoveMember,
  getRoleIcon,
  getRoleColor,
  getStatusColor
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with Add Button */}
      <div className="flex flex-col gap-3 p-3 sm:p-6 border-b border-gray-100 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Users size={16} className="text-blue-600" />
          </div>
          Team Members
        </h2>
        <button
          onClick={onAddMember}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium shadow-sm text-sm"
        >
          <Plus size={16} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Member List or Empty State */}
      {project.members?.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {project.members.map((member, index) => (
            <MemberListItem
              key={member.userId || index}
              member={member}
              index={index}
              onRemove={onRemoveMember}
              getRoleIcon={getRoleIcon}
              getRoleColor={getRoleColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      ) : (
        /* Empty State - Mobile Optimized */
        <div className="text-center py-8 px-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
            <Users size={24} className="text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            No team members yet
          </h3>
          <p className="text-gray-500 mb-4 text-sm max-w-xs mx-auto">
            Invite team members to collaborate on this project.
          </p>
          <button
            onClick={onAddMember}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-sm text-sm"
          >
            <Plus size={16} />
            Invite First Member
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamMembersSection;