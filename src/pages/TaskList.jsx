import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,   // ✅ Add this
} from "firebase/firestore";
import { db } from "../../firebaseconfig"; // adjust path
import EditItem from "./EditItem";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // 🔹 Fetch tasks from Firestore (real-time listener)
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

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  // 🔹 Handle delete
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

  // 🔹 Handle mark as completed
  const handleComplete = async (id) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { status: "completed" }); // ✅ add status field
      toast.success("Task marked as completed!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task!");
    }
  };

  // 🔹 Update list after editing
  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <div className="mt-6">
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`border rounded p-3 flex justify-between items-center ${
                task.status === "completed" ? "bg-green-100" : ""
              }`}
            >
              <div>
                <h3 className="font-bold">
                  {task.title}{" "}
                  {task.status === "completed" && (
                    <span className="text-green-600 text-sm">(Completed)</span>
                  )}
                </h3>
                <p>{task.description}</p>
                <small>
                  Due: {task.dueDate?.split("T")[0] || "No deadline"} | Priority:{" "}
                  {task.priority}
                </small>
              </div>
              <div className="flex gap-2">
                {task.status !== "completed" && (
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => setEditingTaskId(task.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🔹 Show Edit form when editingTaskId is set */}
      {editingTaskId && (
        <div className="mt-6 border rounded p-4 bg-slate-50">
          <h2 className="font-bold text-lg mb-3">Edit Task</h2>
          <EditItem
            taskId={editingTaskId}
            onClose={() => setEditingTaskId(null)}
            onTaskUpdated={handleTaskUpdated}
          />
        </div>
      )}
    </div>
  );
}
