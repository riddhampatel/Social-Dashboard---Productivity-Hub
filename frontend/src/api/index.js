import api from "./axios";

export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  },

  uploadAvatar: async (formData) => {
    const response = await api.put("/auth/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const tasksAPI = {
  getAll: async (params) => {
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export const notesAPI = {
  getAll: async (params) => {
    const response = await api.get("/notes", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  create: async (noteData) => {
    const response = await api.post("/notes", noteData);
    return response.data;
  },

  update: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

export const bookmarksAPI = {
  getAll: async (params) => {
    const response = await api.get("/bookmarks", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookmarks/${id}`);
    return response.data;
  },

  create: async (bookmarkData) => {
    const response = await api.post("/bookmarks", bookmarkData);
    return response.data;
  },

  update: async (id, bookmarkData) => {
    const response = await api.put(`/bookmarks/${id}`, bookmarkData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/bookmarks/${id}`);
    return response.data;
  },
};

export const eventsAPI = {
  getAll: async (params) => {
    const response = await api.get("/events", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export const widgetsAPI = {
  getAll: async () => {
    const response = await api.get("/widgets");
    return response.data;
  },

  create: async (widgetData) => {
    const response = await api.post("/widgets", widgetData);
    return response.data;
  },

  update: async (id, widgetData) => {
    const response = await api.put(`/widgets/${id}`, widgetData);
    return response.data;
  },

  batchUpdate: async (widgets) => {
    const response = await api.put("/widgets/batch/update", { widgets });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/widgets/${id}`);
    return response.data;
  },
};
