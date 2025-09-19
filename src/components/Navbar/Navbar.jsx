import { useState } from "react";
import {
  Menu,
  X,
  CheckSquare,
  LayoutDashboard,
  Folder,
  Settings,
  User,
  Search,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";

export default function TaskManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 1, name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "dashboard" },
    { id: 2, name: "Tasks", icon: <CheckSquare size={20} />, path: "tasks" },
    { id: 3, name: "Projects", icon: <Folder size={20} />, path: "projects" },
    { id: 4, name: "Settings", icon: <Settings size={20} />, path: "settings" },
    { id: 5, name: "Profile", icon: <User size={20} />, path: "profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-white shadow-lg fixed h-full z-40 md:hidden"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <CheckSquare className="text-blue-500" size={24} />
            <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </motion.div>

      <div className="hidden md:flex md:flex-col w-64 bg-white shadow-lg h-full">
        <div className="flex items-center gap-2 p-4 border-b">
          <CheckSquare className="text-blue-500" size={24} />
          <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between bg-white shadow-md px-4 py-3 gap-4">
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
              <PlusCircle size={18} />
              <span>Add Task</span>
            </button>
            <span className="font-medium text-gray-700">Rahma</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
