import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSun,
  FiMoon,
  FiBell,
  FiSearch,
  FiX,
  FiCheckSquare,
  FiFileText,
  FiBookmark,
  FiCalendar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/themeStore";
import {
  useTaskStore,
  useNoteStore,
  useBookmarkStore,
  useEventStore,
} from "../store/dataStore";

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();
  const { bookmarks } = useBookmarkStore();
  const { events } = useEventStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Generate notifications from recent data
    const recentTasks = tasks.filter((t) => !t.completed).slice(0, 3);
    const upcomingEvents = events
      .filter((e) => new Date(e.start) > new Date())
      .slice(0, 2);

    const newNotifications = [
      ...recentTasks.map((t) => ({
        id: `task-${t._id}`,
        type: "task",
        icon: FiCheckSquare,
        title: "Pending Task",
        message: t.title,
        link: "/tasks",
        color: "blue",
      })),
      ...upcomingEvents.map((e) => ({
        id: `event-${e._id}`,
        type: "event",
        icon: FiCalendar,
        title: "Upcoming Event",
        message: e.title,
        link: "/calendar",
        color: "red",
      })),
    ];

    setNotifications(newNotifications);
  }, [tasks, events]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    // Search tasks
    tasks.forEach((task) => {
      if (
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: task._id,
          type: "task",
          icon: FiCheckSquare,
          title: task.title,
          description: task.description || "No description",
          link: "/tasks",
          color: "blue",
        });
      }
    });

    // Search notes
    notes.forEach((note) => {
      if (
        note.title.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
      ) {
        results.push({
          id: note._id,
          type: "note",
          icon: FiFileText,
          title: note.title,
          description: note.content?.substring(0, 100) || "No content",
          link: "/notes",
          color: "purple",
        });
      }
    });

    // Search bookmarks
    bookmarks.forEach((bookmark) => {
      if (
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
      ) {
        results.push({
          id: bookmark._id,
          type: "bookmark",
          icon: FiBookmark,
          title: bookmark.title,
          description: bookmark.url,
          link: "/bookmarks",
          color: "green",
        });
      }
    });

    // Search events
    events.forEach((event) => {
      if (
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: event._id,
          type: "event",
          icon: FiCalendar,
          title: event.title,
          description:
            event.description || new Date(event.start).toLocaleDateString(),
          link: "/calendar",
          color: "red",
        });
      }
    });

    setSearchResults(results.slice(0, 8));
    setShowResults(true);
  }, [searchQuery, tasks, notes, bookmarks, events]);

  const handleResultClick = (link) => {
    navigate(link);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleNotificationClick = (link) => {
    navigate(link);
    setShowNotifications(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, notes, bookmarks, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
              >
                {searchResults.map((result) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.link)}
                      className="w-full px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <Icon
                        className={`w-5 h-5 mt-0.5 text-${result.color}-600`}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {result.description}
                        </div>
                        <div className="text-xs text-gray-400 capitalize mt-1">
                          {result.type}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
            {showResults && searchResults.length === 0 && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-50"
              >
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No results found
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {theme === "light" ? (
              <FiMoon className="w-5 h-5" />
            ) : (
              <FiSun className="w-5 h-5" />
            )}
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition relative"
            >
              <FiBell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <button
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(notification.link)
                          }
                          className="w-full px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 last:border-0"
                        >
                          <Icon
                            className={`w-5 h-5 mt-0.5 text-${notification.color}-600`}
                          />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {notification.title}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {notification.message}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
