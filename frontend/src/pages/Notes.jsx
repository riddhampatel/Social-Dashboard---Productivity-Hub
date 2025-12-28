import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { notesAPI } from "../api";
import { useNoteStore } from "../store/dataStore";

const Notes = () => {
  const { notes, setNotes, addNote, updateNote, deleteNote } = useNoteStore();
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: "#ffffff",
    tags: [],
    isPinned: false,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content: editor.getHTML() });
    },
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      if (response.success) {
        setNotes(response.notes);
      }
    } catch (error) {
      toast.error("Failed to load notes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        const response = await notesAPI.update(editingNote._id, formData);
        if (response.success) {
          updateNote(editingNote._id, response.note);
          toast.success("Note updated successfully");
        }
      } else {
        const response = await notesAPI.create(formData);
        if (response.success) {
          addNote(response.note);
          toast.success("Note created successfully");
        }
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await notesAPI.delete(id);
        deleteNote(id);
        toast.success("Note deleted successfully");
      } catch (error) {
        toast.error("Failed to delete note");
      }
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const response = await notesAPI.update(note._id, {
        isPinned: !note.isPinned,
      });
      if (response.success) {
        updateNote(note._id, response.note);
        toast.success(response.note.isPinned ? "Note pinned" : "Note unpinned");
      }
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      color: "#ffffff",
      tags: [],
      isPinned: false,
    });
    editor?.commands.setContent("");
    setEditingNote(null);
    setShowModal(false);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      color: note.color || "#ffffff",
      tags: note.tags || [],
      isPinned: note.isPinned,
    });
    editor?.commands.setContent(note.content);
    setShowModal(true);
  };

  const colors = [
    "#ffffff",
    "#fef3c7",
    "#fecaca",
    "#bfdbfe",
    "#d9f99d",
    "#fde68a",
    "#ddd6fe",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Capture your thoughts and ideas
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Note</span>
        </motion.button>
      </div>

      {/* Notes Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {notes.map((note) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ backgroundColor: note.color }}
            className="break-inside-avoid rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">
                {note.title}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTogglePin(note)}
                  className={`p-2 rounded-lg transition ${
                    note.isPinned
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-blue-600"
                  }`}
                >
                  <FiMapPin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(note)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {note.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No notes yet. Create your first note!
          </p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingNote ? "Edit Note" : "New Note"}
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden dark:bg-gray-700">
                    <EditorContent
                      editor={editor}
                      className="min-h-[200px] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
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
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    {editingNote ? "Update" : "Create"}
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

export default Notes;
