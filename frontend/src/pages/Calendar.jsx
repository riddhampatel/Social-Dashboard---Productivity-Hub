import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FiPlus, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { eventsAPI } from "../api";
import { useEventStore } from "../store/dataStore";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { events, setEvents, addEvent, updateEvent, deleteEvent } =
    useEventStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    allDay: false,
    location: "",
    color: "#3B82F6",
    category: "General",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      if (response.success) {
        setEvents(response.events);
      }
    } catch (error) {
      toast.error("Failed to load events");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        const response = await eventsAPI.update(selectedEvent._id, formData);
        if (response.success) {
          updateEvent(selectedEvent._id, response.event);
          toast.success("Event updated successfully");
        }
      } else {
        const response = await eventsAPI.create(formData);
        if (response.success) {
          addEvent(response.event);
          toast.success("Event created successfully");
        }
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setFormData({
      ...formData,
      startDate: moment(start).format("YYYY-MM-DDTHH:mm"),
      endDate: moment(end).format("YYYY-MM-DDTHH:mm"),
    });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      startDate: moment(event.startDate).format("YYYY-MM-DDTHH:mm"),
      endDate: moment(event.endDate).format("YYYY-MM-DDTHH:mm"),
      allDay: event.allDay,
      location: event.location || "",
      color: event.color,
      category: event.category,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (
      selectedEvent &&
      window.confirm("Are you sure you want to delete this event?")
    ) {
      try {
        await eventsAPI.delete(selectedEvent._id);
        deleteEvent(selectedEvent._id);
        toast.success("Event deleted successfully");
        resetForm();
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      allDay: false,
      location: "",
      color: "#3B82F6",
      category: "General",
    });
    setSelectedEvent(null);
    setShowModal(false);
  };

  const calendarEvents = events.map((event) => ({
    ...event,
    start: new Date(event.startDate),
    end: new Date(event.endDate),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your schedule and events
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Event</span>
        </motion.button>
      </div>

      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        style={{ height: "600px" }}
      >
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{ height: "100%" }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
            },
          })}
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedEvent ? "Edit Event" : "New Event"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allDay}
                    onChange={(e) =>
                      setFormData({ ...formData, allDay: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    All Day Event
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  {selectedEvent && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    {selectedEvent ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
