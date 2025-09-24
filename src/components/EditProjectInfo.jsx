import React from "react";

const EditProjectInfo = ({ editProject, setEditProject, handleSaveEdit, setShowEditForm }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Edit Project
          </h2>

          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={editProject.name}
                onChange={(e) =>
                  setEditProject((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter project name"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editProject.description}
                onChange={(e) =>
                  setEditProject((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter project description"
                rows={3}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={editProject.status}
                onChange={(e) =>
                  setEditProject((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Pending">Pending</option>
                <option value="In Process">In Process</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editProject.progress}
                onChange={(e) =>
                  setEditProject((p) => ({
                    ...p,
                    progress: Math.max(
                      0,
                      Math.min(100, Number(e.target.value))
                    ),
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowEditForm(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProjectInfo;
