import React from 'react'
import { MdDelete, MdEdit, MdCheckCircle } from "react-icons/md";

export default function TaskCard({ title, description, dueDate, priority, status, onEdit, onDelete, onStatusChange }) {
    return (
        <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all flex flex-col">
            {/* Title + Due Date */}
            <div className="flex items-start justify-between">
                <div>
                    <h6 className="text-base font-semibold text-slate-800">{title}</h6>
                    <span className="text-xs text-slate-500">Due: {dueDate}</span>
                </div>
                <span
                    className={`text-xs px-2 py-1 rounded-md ${
                        priority === "High" ? "bg-red-100 text-red-600" :
                        priority === "Medium" ? "bg-yellow-100 text-yellow-600" :
                        "bg-green-100 text-green-600"
                    }`}
                >
                    {priority}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 mt-2">
                {description}
            </p>

            {/* status */}
            <div className="flex items-center justify-between mt-auto pt-3">
                <span
                    className={`text-xs px-2 py-1 rounded-full ${
                        status === "done"
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                >
                    {status === "done" ? "Done" : "Pending"}
                </span>

                <div className="flex items-center gap-2">
                    {status !== "done" && (
                        <button
                            onClick={() => onStatusChange("done")}
                            className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-200"
                        >
                            <MdCheckCircle className="text-lg" />
                        </button>
                    )}
                    <button
                        onClick={onEdit}
                        className="p-1.5 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-200"
                    >
                        <MdEdit className="text-lg" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-200"
                    >
                        <MdDelete className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
}
