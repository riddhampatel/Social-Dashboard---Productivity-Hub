import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiExternalLink,
  FiStar,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { bookmarksAPI } from "../api";
import { useBookmarkStore } from "../store/dataStore";

const Bookmarks = () => {
  const {
    bookmarks,
    setBookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  } = useBookmarkStore();
  const [showModal, setShowModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: [],
    category: "Uncategorized",
    isFavorite: false,
  });

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const response = await bookmarksAPI.getAll();
      if (response.success) {
        setBookmarks(response.bookmarks);
      }
    } catch (error) {
      toast.error("Failed to load bookmarks");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBookmark) {
        const response = await bookmarksAPI.update(
          editingBookmark._id,
          formData
        );
        if (response.success) {
          updateBookmark(editingBookmark._id, response.bookmark);
          toast.success("Bookmark updated successfully");
        }
      } else {
        const response = await bookmarksAPI.create(formData);
        if (response.success) {
          addBookmark(response.bookmark);
          toast.success("Bookmark created successfully");
        }
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      try {
        await bookmarksAPI.delete(id);
        deleteBookmark(id);
        toast.success("Bookmark deleted successfully");
      } catch (error) {
        toast.error("Failed to delete bookmark");
      }
    }
  };

  const handleToggleFavorite = async (bookmark) => {
    try {
      const response = await bookmarksAPI.update(bookmark._id, {
        isFavorite: !bookmark.isFavorite,
      });
      if (response.success) {
        updateBookmark(bookmark._id, response.bookmark);
        toast.success(
          response.bookmark.isFavorite
            ? "Added to favorites"
            : "Removed from favorites"
        );
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      description: "",
      tags: [],
      category: "Uncategorized",
      isFavorite: false,
    });
    setEditingBookmark(null);
    setShowModal(false);
  };

  const openEditModal = (bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description || "",
      tags: bookmark.tags || [],
      category: bookmark.category,
      isFavorite: bookmark.isFavorite,
    });
    setShowModal(true);
  };

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    if (filter === "all") return true;
    if (filter === "favorites") return bookmark.isFavorite;
    return bookmark.category === filter;
  });

  const categories = [...new Set(bookmarks.map((b) => b.category))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bookmarks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Save and organize your favorite links
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Bookmark</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "all"
              ? "bg-green-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("favorites")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "favorites"
              ? "bg-green-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Favorites
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === cat
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredBookmarks.map((bookmark, index) => (
            <motion.div
              key={bookmark._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                {bookmark.favicon && (
                  <img
                    src={bookmark.favicon}
                    alt=""
                    className="w-8 h-8 rounded"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={() => handleToggleFavorite(bookmark)}
                    className={`p-2 rounded-lg transition ${
                      bookmark.isFavorite
                        ? "text-yellow-500"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                  >
                    <FiStar
                      className="w-4 h-4"
                      fill={bookmark.isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => openEditModal(bookmark)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {bookmark.title}
              </h3>

              {bookmark.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {bookmark.description}
                </p>
              )}

              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-4"
              >
                Visit <FiExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                  {bookmark.category}
                </span>
              </div>

              {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {bookmark.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredBookmarks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No bookmarks found</p>
        </div>
      )}

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
                  {editingBookmark ? "Edit Bookmark" : "New Bookmark"}
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    {editingBookmark ? "Update" : "Create"}
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

export default Bookmarks;
