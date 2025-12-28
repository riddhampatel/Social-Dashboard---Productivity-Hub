import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Bookmarks from "./pages/Bookmarks";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts.jsx";

function App() {
  const { isAuthenticated, hydrated, setHydrated } = useAuthStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Safety: ensure hydration flag is set even if persist callback misses
    if (!hydrated) setHydrated();
  }, [hydrated, setHydrated]);

  // Wait for persisted auth state before routing to avoid redirect flicker
  if (!hydrated) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
      />

      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="notes" element={<Notes />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
