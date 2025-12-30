import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiCheckSquare,
  FiFileText,
  FiBookmark,
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";
import { useState } from "react";

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  const navItems = [
    { path: "/dashboard", icon: FiGrid, label: "Dashboard" },
    { path: "/tasks", icon: FiCheckSquare, label: "Tasks" },
    { path: "/notes", icon: FiFileText, label: "Notes" },
    { path: "/bookmarks", icon: FiBookmark, label: "Bookmarks" },
    { path: "/calendar", icon: FiCalendar, label: "Calendar" },
    { path: "/profile", icon: FiSettings, label: "Settings" },
  ];

  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileSidebar}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isMobileOpen ? 0 : 0 }}
        className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed lg:relative h-full z-40 transition-transform lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            ProductivityHub
          </motion.h1>
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            {user?.avatar ? (
              <img
                src={`http://localhost:5001${user.avatar}`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
