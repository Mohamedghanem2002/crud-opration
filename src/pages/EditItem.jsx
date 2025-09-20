import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';

export default function EditItem({ taskId, onClose, onTaskUpdated }) {
  const BASE_URL = "https://localhost:7048/api/TaskModels";
  // const BASE_URL = "http://crudapi.runasp.net/api/taskmodels";

  const [taskData, setTaskData] = useState({
    id: 0,
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing task when component mounts
  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        const task = (await axios.get(`${BASE_URL}/${taskId}`)).data;

        setTaskData({
          id: task.id,
          title: task.title,
          description: task.description || "",
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          priority: task.priority,
        });
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load task for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // 🔹 Handle form submit (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskData.title || !taskData.description) {
      toast.error("⚠️ Title and Description are required!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        priority: taskData.priority,
      };

      await axios.put(`${BASE_URL}/${taskData.id}`, payload);

      toast.success("✅ Task updated successfully!");

      if (onTaskUpdated) onTaskUpdated(payload); // update parent state
      if (onClose) onClose(); // close modal or form
    } catch (error) {
      console.error("❌ Error updating task:", error.response || error);
      toast.error("❌ Failed to update task!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-500" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="border border-slate-300 rounded-lg px-3 py-2 text-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-semibold text-slate-500"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={taskData.description}
          onChange={(e) =>
            setTaskData({ ...taskData, description: e.target.value })
          }
        />
      </div>

      {/* Due Date */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-semibold text-slate-500"
          htmlFor="dueDate"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={taskData.dueDate}
          onChange={(e) =>
            setTaskData({ ...taskData, dueDate: e.target.value })
          }
        />
      </div>

      {/* Priority */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-semibold text-slate-500"
          htmlFor="priority"
        >
          Priority
        </label>
        <select
          id="priority"
          className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={taskData.priority}
          onChange={(e) =>
            setTaskData({ ...taskData, priority: e.target.value })
          }
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-2.5 rounded-lg transition-colors ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Saving..." : "Update Task"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full font-semibold py-2.5 rounded-lg bg-gray-400 text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
