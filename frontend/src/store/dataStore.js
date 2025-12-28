import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [task, ...state.tasks] 
  })),
  
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task._id === id ? { ...task, ...updatedTask } : task
    ),
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task._id !== id),
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));

export const useNoteStore = create((set) => ({
  notes: [],
  loading: false,
  error: null,

  setNotes: (notes) => set({ notes }),
  
  addNote: (note) => set((state) => ({ 
    notes: [note, ...state.notes] 
  })),
  
  updateNote: (id, updatedNote) => set((state) => ({
    notes: state.notes.map((note) => 
      note._id === id ? { ...note, ...updatedNote } : note
    ),
  })),
  
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter((note) => note._id !== id),
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));

export const useBookmarkStore = create((set) => ({
  bookmarks: [],
  loading: false,
  error: null,

  setBookmarks: (bookmarks) => set({ bookmarks }),
  
  addBookmark: (bookmark) => set((state) => ({ 
    bookmarks: [bookmark, ...state.bookmarks] 
  })),
  
  updateBookmark: (id, updatedBookmark) => set((state) => ({
    bookmarks: state.bookmarks.map((bookmark) => 
      bookmark._id === id ? { ...bookmark, ...updatedBookmark } : bookmark
    ),
  })),
  
  deleteBookmark: (id) => set((state) => ({
    bookmarks: state.bookmarks.filter((bookmark) => bookmark._id !== id),
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));

export const useEventStore = create((set) => ({
  events: [],
  loading: false,
  error: null,

  setEvents: (events) => set({ events }),
  
  addEvent: (event) => set((state) => ({ 
    events: [event, ...state.events] 
  })),
  
  updateEvent: (id, updatedEvent) => set((state) => ({
    events: state.events.map((event) => 
      event._id === id ? { ...event, ...updatedEvent } : event
    ),
  })),
  
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((event) => event._id !== id),
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));
