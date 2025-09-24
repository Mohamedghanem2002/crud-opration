const ActivityStatsSection = ({ userData }) => (
  <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <h3 className="text-lg font-semibold mb-4">Activity Stats</h3>
    <div className="grid sm:grid-cols-3 gap-4 text-center">
      <div className="p-3 bg-gray-50 rounded">
        <p className="text-xl font-bold">{userData.projectsCount || 0}</p>
        <p className="text-gray-400 text-sm">Projects</p>
      </div>
      <div className="p-3 bg-gray-50 rounded">
        <p className="text-xl font-bold">{userData.completedTasks || 0}</p>
        <p className="text-gray-400 text-sm">Completed Tasks</p>
      </div>
      <div className="p-3 bg-gray-50 rounded">
        <p className="text-xl font-bold">{userData.pendingTasks || 0}</p>
        <p className="text-gray-400 text-sm">Pending Tasks</p>
      </div>
    </div>
  </div>
);

export default ActivityStatsSection;
