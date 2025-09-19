import React, { useState } from 'react'
import TaskCard from '../components/TaskCard';
import { IoMdAdd } from "react-icons/io";
import AddItem from './AddItem';
import Modal from 'react-modal';

export default function Home() {
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

  const [openAddItem,setOpnAddItem]=useState({
    isShown:false,
    type:"add",
    date:null
  })
  return (
    <>
    <div className='container mx-auto my-10'>
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <p className="text-lg font-medium mb-2">No tasks available</p>
          <p className="text-sm mb-6">Start by adding your first task</p>
          <button
            onClick={() => setOpnAddItem({ isShown: true })}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <IoMdAdd className="text-lg" />
            Add Task
          </button>
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
    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 absolute right-10 bottom-10' onClick={()=>{setOpnAddItem({isShown:true})}}>
      <IoMdAdd className='text-[32px] text-white'/>
    </button>

    <Modal 
        isOpen={openAddItem.isShown} 
        onRequestClose={() => {}} 
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px"
          },
        }}
        contentLabel="Add Item Modal"
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl outline-none p-6 relative"
      >
        <button 
          className="absolute top-3 right-3 text-slate-500 hover:text-red-500 text-xl font-bold"
          onClick={() => setOpnAddItem({ isShown: false })}
        >
          ✕
        </button>
        <AddItem onAdd={(newTask) => {
          setTasks([...tasks, newTask]); 
          setOpnAddItem({ isShown: false }); 
        }}/>
      </Modal>
    </>
  )
}
