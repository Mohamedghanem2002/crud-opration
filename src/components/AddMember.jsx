export default function AddMemberModal({ newMember, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Member</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={newMember.name}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newMember.email}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />

          {/* Role Dropdown */}
          <select
            name="role"
            value={newMember.role}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Owner">Owner</option>
            <option value="Editor">Editor</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
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
