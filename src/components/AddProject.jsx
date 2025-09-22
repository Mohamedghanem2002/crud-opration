export default function AddProjectModal({ newProject, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Project</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={newProject.name}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newProject.description}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
          <select
            name="status"
            value={newProject.status}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <input
            type="number"
            name="progress"
            placeholder="Progress %"
            value={newProject.progress}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
