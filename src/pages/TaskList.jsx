import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseconfig";
import EditItem from "./EditItem";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // 🔹 Fetch tasks (real-time)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tasks"),
      (snapshot) => {
        const taskData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskData);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Failed to load tasks!");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔹 Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteDoc(doc(db, "tasks", id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task!");
    }
  };

  // 🔹 Complete
  const handleComplete = async (id) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { status: "completed" });
      toast.success("Task marked as completed!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task!");
    }
  };

  // 🔹 Update after edit
  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <div className="mt-6 px-3 sm:px-6 lg:px-10">
      {loading ? (
        <p className="text-center text-slate-500">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-slate-500">No tasks found</p>
      ) : (
        <div className="overflow-x-auto">
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-6 transition 
                  ${
                    task.status === "completed"
                      ? "bg-green-100 border-green-300"
                      : "bg-white"
                  }`}
              >
                {/* Task Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-slate-800">
                    {task.title}{" "}
                    {task.status === "completed" && (
                      <span className="text-green-600 text-sm font-normal">
                        (Completed)
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base">
                    {task.description}
                  </p>
                  <small className="block text-slate-500 mt-1 text-xs sm:text-sm">
                    Due: {task.dueDate?.split("T")[0] || "No deadline"} | Priority:{" "}
                    {task.priority}
                  </small>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-end">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm sm:text-base"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => setEditingTaskId(task.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm sm:text-base"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm sm:text-base"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Form */}
      {editingTaskId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-lg p-6 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[40%] shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-3 text-slate-700">Edit Task</h2>
            <EditItem
              taskId={editingTaskId}
              onClose={() => setEditingTaskId(null)}
              onTaskUpdated={handleTaskUpdated}
            />
          </div>
        </div>
      )}
    </div>
  );
}
