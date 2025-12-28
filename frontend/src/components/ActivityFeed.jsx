import { motion } from "framer-motion";
import {
  FiActivity,
  FiCheckSquare,
  FiFileText,
  FiBookmark,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed = ({ tasks, notes, bookmarks, events }) => {
  const getActivities = () => {
    const activities = [];

    // Add recent tasks
    tasks.slice(0, 3).forEach((task) => {
      activities.push({
        id: `task-${task._id}`,
        type: "task",
        icon: FiCheckSquare,
        color: "blue",
        title: task.completed ? "Completed task" : "Created task",
        description: task.title,
        timestamp: task.updatedAt || task.createdAt,
      });
    });

    // Add recent notes
    notes.slice(0, 3).forEach((note) => {
      activities.push({
        id: `note-${note._id}`,
        type: "note",
        icon: FiFileText,
        color: "purple",
        title: "Created note",
        description: note.title,
        timestamp: note.createdAt,
      });
    });

    // Add recent bookmarks
    bookmarks.slice(0, 2).forEach((bookmark) => {
      activities.push({
        id: `bookmark-${bookmark._id}`,
        type: "bookmark",
        icon: FiBookmark,
        color: "green",
        title: "Saved bookmark",
        description: bookmark.title,
        timestamp: bookmark.createdAt,
      });
    });

    // Add upcoming events
    events
      .filter((e) => new Date(e.start) > new Date())
      .slice(0, 2)
      .forEach((event) => {
        activities.push({
          id: `event-${event._id}`,
          type: "event",
          icon: FiCalendar,
          color: "red",
          title: "Upcoming event",
          description: event.title,
          timestamp: event.start,
        });
      });

    // Sort by timestamp (most recent first)
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  };

  const activities = getActivities();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FiActivity className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div
                  className={`p-2 rounded-lg bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}
                >
                  <Icon className={`w-5 h-5 text-${activity.color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-500">
                    <FiClock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiActivity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm mt-1">
              Start creating tasks, notes, or bookmarks!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
