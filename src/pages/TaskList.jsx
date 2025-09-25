import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebaseconfig";
import EditItem from "./EditItem";
import { useTranslation } from "react-i18next";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
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
        toast.error(t("tasks.loadError"));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [t]);

  const handleDelete = async (id) => {
    if (!confirm(t("tasks.deleteConfirm"))) return;

    try {
      await deleteDoc(doc(db, "tasks", id));
      toast.success(t("tasks.deleteSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("tasks.deleteError"));
    }
  };

  // 🔹 Complete
  const handleComplete = async (id) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { status: "completed" });
      toast.success(t("tasks.completeSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("tasks.completeError"));
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <div className="mt-6 px-3 sm:px-6 lg:px-10">
      {loading ? (
        <p className="text-center text-slate-500">{t("tasks.loading")}</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-slate-500">{t("tasks.noTasks")}</p>
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
                        ({t("tasks.completed")})
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base">
                    {task.description}
                  </p>
                  <small className="block text-slate-500 mt-1 text-xs sm:text-sm">
                    {t("tasks.due")}:{" "}
                    {task.dueDate?.split("T")[0] || t("tasks.noDeadline")} |{" "}
                    {t("tasks.priority")}: {t(task.priority.toLowerCase())}
                  </small>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-end">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm sm:text-base"
                    >
                      {t("tasks.complete")}
                    </button>
                  )}
                  <button
                    onClick={() => setEditingTaskId(task.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm sm:text-base"
                  >
                    {t("tasks.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm sm:text-base"
                  >
                    {t("tasks.delete")}
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
            <h2 className="font-bold text-lg mb-3 text-slate-700">
              {t("tasks.editTask")}
            </h2>
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
