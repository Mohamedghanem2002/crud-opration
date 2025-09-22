import React, { useState } from "react";
import { db } from "../../firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddItem() {
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskData.title || !taskData.description) {
      toast.error("Title and Description are required!");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "tasks"), {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        priority: taskData.priority,
        createdAt: serverTimestamp(),
      });

      toast.success("Task created successfully!");

      setTaskData({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
      });
      navigate("/Tasks");
    } catch (error) {
      console.error("Error creating task:", error.response || error);
      toast.error("Failed to create task!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white shadow-md rounded-xl p-6 sm:p-8"
      >
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-500" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter task title"
            className="border border-slate-300 rounded-lg px-3 py-2 text-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
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
            placeholder="Write task description..."
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
            value={taskData.description}
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Due Date */}
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-semibold text-slate-500"
              htmlFor="dueDate"
            >
              Due Date (optional)
            </label>
            <input
              type="date"
              id="dueDate"
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
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
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
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
        </div>

        {/* Add Button */}
        <button
          type="submit"
          className={`w-full font-semibold py-3 rounded-lg transition-colors text-center
            ${
              taskData.title && taskData.description && !loading
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          disabled={!taskData.title || !taskData.description || loading}
        >
          {loading ? "Saving..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}
