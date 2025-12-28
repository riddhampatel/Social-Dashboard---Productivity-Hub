import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiCheckSquare,
  FiFileText,
  FiBookmark,
  FiCalendar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const QuickAddButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: FiCheckSquare, label: "Task", color: "blue", path: "/tasks" },
    { icon: FiFileText, label: "Note", color: "purple", path: "/notes" },
    { icon: FiBookmark, label: "Bookmark", color: "green", path: "/bookmarks" },
    { icon: FiCalendar, label: "Event", color: "red", path: "/calendar" },
  ];

  const handleActionClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleActionClick(action.path)}
                  className={`flex items-center space-x-3 bg-${action.color}-600 hover:bg-${action.color}-700 text-white px-4 py-3 rounded-full shadow-lg transition group`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium pr-2">{action.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all ${
          isOpen
            ? "bg-red-600 hover:bg-red-700 rotate-45"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiPlus className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default QuickAddButton;
