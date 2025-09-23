import { useState } from "react";
import toast from "react-hot-toast";

export default function AddProjectModal({ onChange, onClose, onSave }) {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "pending",
    progress: 0,
  });

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!newProject.name.trim()) return toast.error("Project name is required");

    onSave(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Project
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={newProject.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newProject.description}
            onChange={handleChange}
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
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
