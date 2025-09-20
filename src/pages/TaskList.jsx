import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import EditItem from "./EditItem"; // import the edit component

export default function TaskList() {
    const BASE_URL = "https://localhost:7048/api/TaskModels";
    // const BASE_URL = "http://crudapi.runasp.net/api/taskmodels";
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTaskId, setEditingTaskId] = useState(null);

    // 🔹 Fetch all tasks on load
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(BASE_URL);
                setTasks(response.data);
            } catch (error) {
                console.error(error);
                toast.error(" Failed to load tasks!");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // 🔹 Handle delete
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setTasks((prev) => prev.filter((t) => t.id !== id));
            toast.success(" Task deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error(" Failed to delete task!");
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
                            className="border rounded p-3 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold">{task.title}</h3>
                                <p>{task.description}</p>
                                <small>
                                    Due: {task.dueDate?.split("T")[0] || "No deadline"} | Priority:{" "}
                                    {task.priority}
                                </small>
                            </div>
                            <div className="flex gap-2">
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
