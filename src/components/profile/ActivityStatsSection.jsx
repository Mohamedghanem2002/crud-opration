const ActivityStatsSection = ({ userData }) => (
  <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Activity Stats</h3>
    <div className="grid md:grid-cols-3 gap-4 text-center">
      <div className="bg-gray-50 rounded p-4">
        <p className="text-xl font-bold">{userData.projectsCount || 0}</p>
        <p className="text-gray-500">Projects</p>
      </div>
      <div className="bg-gray-50 rounded p-4">
        <p className="text-xl font-bold">{userData.completedTasks || 0}</p>
        <p className="text-gray-500">Completed Tasks</p>
      </div>
      <div className="bg-gray-50 rounded p-4">
        <p className="text-xl font-bold">{userData.pendingTasks || 0}</p>
        <p className="text-gray-500">Pending Tasks</p>
      </div>
    </div>
  </div>
);

export default ActivityStatsSection;
