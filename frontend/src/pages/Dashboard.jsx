import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheckSquare,
  FiFileText,
  FiBookmark,
  FiCalendar,
  FiPlus,
} from "react-icons/fi";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import DashboardWidget from "../components/DashboardWidget";
import ActivityFeed from "../components/ActivityFeed";
import { tasksAPI, notesAPI, bookmarksAPI, eventsAPI } from "../api";
import {
  useTaskStore,
  useNoteStore,
  useBookmarkStore,
  useEventStore,
} from "../store/dataStore";

const Dashboard = () => {
  const [widgets, setWidgets] = useState([
    {
      id: "tasks",
      type: "tasks",
      title: "Recent Tasks",
      icon: FiCheckSquare,
      color: "blue",
    },
    {
      id: "notes",
      type: "notes",
      title: "Recent Notes",
      icon: FiFileText,
      color: "purple",
    },
    {
      id: "bookmarks",
      type: "bookmarks",
      title: "Bookmarks",
      icon: FiBookmark,
      color: "green",
    },
    {
      id: "events",
      type: "events",
      title: "Upcoming Events",
      icon: FiCalendar,
      color: "red",
    },
  ]);

  const { tasks, setTasks } = useTaskStore();
  const { notes, setNotes } = useNoteStore();
  const { bookmarks, setBookmarks } = useBookmarkStore();
  const { events, setEvents } = useEventStore();

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
    totalBookmarks: 0,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasksRes, notesRes, bookmarksRes, eventsRes] = await Promise.all([
        tasksAPI.getAll(),
        notesAPI.getAll(),
        bookmarksAPI.getAll(),
        eventsAPI.getAll(),
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.tasks);
        setStats((prev) => ({
          ...prev,
          totalTasks: tasksRes.tasks.length,
          completedTasks: tasksRes.tasks.filter((t) => t.completed).length,
        }));
      }

      if (notesRes.success) {
        setNotes(notesRes.notes);
        setStats((prev) => ({ ...prev, totalNotes: notesRes.notes.length }));
      }

      if (bookmarksRes.success) {
        setBookmarks(bookmarksRes.bookmarks);
        setStats((prev) => ({
          ...prev,
          totalBookmarks: bookmarksRes.bookmarks.length,
        }));
      }

      if (eventsRes.success) {
        setEvents(eventsRes.events);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast.success("Widget position updated");
    }
  };

  const getWidgetData = (type) => {
    switch (type) {
      case "tasks":
        return tasks.slice(0, 5);
      case "notes":
        return notes.slice(0, 5);
      case "bookmarks":
        return bookmarks.slice(0, 5);
      case "events":
        return events.slice(0, 5);
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your productivity overview
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalTasks}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FiCheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 dark:text-green-400">
              {stats.completedTasks} completed
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalNotes}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bookmarks
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalBookmarks}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <FiBookmark className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Events</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {events.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed
        tasks={tasks}
        notes={notes}
        bookmarks={bookmarks}
        events={events}
      />

      {/* Widgets Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {widgets.map((widget, index) => (
              <DashboardWidget
                key={widget.id}
                id={widget.id}
                widget={widget}
                data={getWidgetData(widget.type)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Dashboard;
