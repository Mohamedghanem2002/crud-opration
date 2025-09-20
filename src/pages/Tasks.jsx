import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';
import { IoMdAdd } from "react-icons/io";
import { Link } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState([
    {
      title: "Finish React Project",
      description: "Complete the Task Manager app UI",
      dueDate: "2025-09-20",
      priority: "High",
      status: "pending",
    },
    {
      title: "Meeting with Team",
      description: "Discuss progress and assign tasks",
      dueDate: "2025-09-22",
      priority: "Medium",
      status: "done",
    },
  ]);

  return (
    <>
      <div className='container mx-auto my-10'>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <p className="text-lg font-medium mb-2">No tasks available</p>
            <p className="text-sm mb-6">Start by adding your first task</p>
            <Link
              to="/add"
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              <IoMdAdd className="text-lg" />
              Add Task
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-6'>
            {tasks.map((task, index) => (
              <TaskCard
                key={index}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                priority={task.priority}
                status={task.status}
                onEdit={() => {}}
                onDelete={() => {
                  const updated = tasks.filter((_, i) => i !== index);
                  setTasks(updated);
                }}
                onStatusChange={(newStatus) => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].status = newStatus;
                  setTasks(updatedTasks);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Link
        to="/add"
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 absolute right-10 bottom-10'
      >
        <IoMdAdd className='text-[32px] text-white' />
      </Link>
    </>
  );
}
