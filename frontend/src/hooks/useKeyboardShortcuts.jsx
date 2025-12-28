import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if Ctrl/Cmd + key is pressed
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      if (!modifierKey) return;

      switch (e.key.toLowerCase()) {
        case "k":
          // Ctrl/Cmd + K: Focus search
          e.preventDefault();
          const searchInput = document.querySelector(
            'input[placeholder*="Search"]'
          );
          if (searchInput) {
            searchInput.focus();
            toast.info("Search activated", { autoClose: 1000 });
          }
          break;

        case "d":
          // Ctrl/Cmd + D: Go to Dashboard
          e.preventDefault();
          navigate("/dashboard");
          toast.info("Dashboard", { autoClose: 1000 });
          break;

        case "t":
          // Ctrl/Cmd + T: Go to Tasks
          e.preventDefault();
          navigate("/tasks");
          toast.info("Tasks", { autoClose: 1000 });
          break;

        case "n":
          // Ctrl/Cmd + N: Go to Notes
          e.preventDefault();
          navigate("/notes");
          toast.info("Notes", { autoClose: 1000 });
          break;

        case "b":
          // Ctrl/Cmd + B: Go to Bookmarks
          e.preventDefault();
          navigate("/bookmarks");
          toast.info("Bookmarks", { autoClose: 1000 });
          break;

        case "c":
          // Ctrl/Cmd + C: Go to Calendar
          if (e.shiftKey) {
            e.preventDefault();
            navigate("/calendar");
            toast.info("Calendar", { autoClose: 1000 });
          }
          break;

        case "s":
          // Ctrl/Cmd + S: Go to Settings
          if (e.shiftKey) {
            e.preventDefault();
            navigate("/profile");
            toast.info("Settings", { autoClose: 1000 });
          }
          break;

        case "/":
          // Ctrl/Cmd + /: Show keyboard shortcuts
          e.preventDefault();
          toast.info(
            <div className="text-sm">
              <p className="font-bold mb-2">Keyboard Shortcuts:</p>
              <p>Ctrl/⌘ + K: Search</p>
              <p>Ctrl/⌘ + D: Dashboard</p>
              <p>Ctrl/⌘ + T: Tasks</p>
              <p>Ctrl/⌘ + N: Notes</p>
              <p>Ctrl/⌘ + B: Bookmarks</p>
              <p>Ctrl/⌘ + Shift + C: Calendar</p>
              <p>Ctrl/⌘ + Shift + S: Settings</p>
            </div>,
            { autoClose: 5000 }
          );
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);
};

export default useKeyboardShortcuts;
