import React, { useState, useEffect } from "react";

export default function EditItem({ task, onAdd }) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  // عبّي البيانات عند التعديل
  useEffect(() => {
    if (task) {
      setTaskData({ ...task });
    }
  }, [task]);

  const handleSubmit = () => {
    if (!taskData.title || !taskData.description) return;

    const finalTask = {
      ...taskData,
      status: taskData.status || "pending",
      dueDate: taskData.dueDate || "No deadline",
    };

    onAdd(finalTask);

    // لما يكون add جديد نفضي الفورم
    if (!task) {
      setTaskData({ title: "", description: "", dueDate: "", priority: "Low" });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-500" htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Enter task title"
          className="border border-slate-300 rounded-lg px-3 py-2 text-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-500" htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          placeholder="Write task description..."
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={taskData.description}
          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-500" htmlFor="dueDate">Due Date (optional)</label>
        <input
          type="date"
          id="dueDate"
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={taskData.dueDate}
          onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-500" htmlFor="priority">Priority</label>
        <select
          id="priority"
          className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={taskData.priority}
          onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <button
        className={`w-full font-semibold py-2.5 rounded-lg transition-colors ${taskData.title && taskData.description
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        onClick={handleSubmit}
        disabled={!taskData.title || !taskData.description}
      >
        {task ? "Save Changes" : "Add Task"}
      </button>
    </div>
  );
}
