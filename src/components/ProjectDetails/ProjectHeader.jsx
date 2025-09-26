import { Users } from "lucide-react";

const ProjectHeader = ({ project, getProgressColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Project Title and Description */}
      <div className="p-3 sm:p-6 lg:p-8 border-b border-gray-100">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {project.name}
        </h1>
        {project.description && (
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      {/* Status and Progress Section */}
      <div className="p-3 sm:p-6 bg-gray-50">
        <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Status
            </label>
            <span className={`inline-flex px-2.5 py-1.5 rounded-md text-sm font-semibold ${project.status === "Completed" || project.status === "completed"
                ? "bg-green-100 text-green-800"
                : project.status === "In Process"
                  ? "bg-blue-100 text-blue-800"
                  : project.status === "Pending" || project.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}>
              {project.status || "Pending"}
            </span>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Progress
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  {project.progress || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.progress || 0)}`}
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Overview Section */}
      <div className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              Team Members ({project.members?.length || 0})
            </span>
          </div>
        </div>

        {/* Team Avatars - Mobile Optimized */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {project.members?.slice(0, 4).map((m, index) => (
              <div
                key={m.userId || index}
                className="relative"
                title={`${m.name || m.email} (${m.role || "Viewer"})`}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold border-2 border-white shadow-md">
                  {m.name?.charAt(0) || m.email?.charAt(0) || "?"}
                </div>
              </div>
            ))}
            {project.members?.length > 4 && (
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 text-sm font-bold border-2 border-white shadow-md">
                +{project.members.length - 4}
              </div>
            )}
          </div>
          {project.members?.length > 0 && (
            <div className="text-xs text-gray-500 ml-1">
              {project.members.length} member{project.members.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
