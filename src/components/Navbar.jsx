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
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseconfig";
import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const handleLogout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
    window.location.reload();
  } catch (error) {
    toast.error("Logout failed:");
    console.error("Logout failed:", error);
  }
};

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    { id: 1, name: t("dashboard"), icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { id: 2, name: t("tasks.title"), icon: <CheckSquare size={20} />, path: "/tasks" },
    { id: 3, name: t("projects"), icon: <Folder size={20} />, path: "/projects" },
    { id: 4, name: t("settings"), icon: <Settings size={20} />, path: "/settings" },
    { id: 5, name: t("profile"), icon: <User size={20} />, path: "/profile" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-white shadow-lg fixed h-full z-40 md:hidden"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <CheckSquare className="text-blue-500" size={24} />
            <h1 className="text-xl font-bold text-gray-800">{t("appName")}</h1>
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

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-white shadow-lg h-full">
        <div className="flex items-center gap-2 p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <CheckSquare className="text-blue-500" size={24} />
            <h1 className="text-xl font-bold text-gray-800">{t("appName")}</h1>
          </Link>
        </div>

        <nav className="mt-6 mb-6">
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

      {/* Desktop Header */}
      <header className="fixed top-0 right-0 left-64 bg-white shadow-md px-4 py-3 z-10 md:flex hidden items-center justify-end mb-6">

        <div className="flex items-center gap-4 ">
          <Link
            to="/add"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            <PlusCircle size={18} />
            <span>{t("addTask")}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            <span>{t("logout")}</span>
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-50 flex items-center justify-between mb-6 ">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className="text-lg font-bold">
          {t("appName")}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
          title={t("logout")}
        >
          <LogOut size={18} />
        </button>
        <Link to="/add" className="bg-blue-500 text-white p-2 rounded">
          <PlusCircle size={18} />
        </Link>
      </header>
    </>
  );
}
