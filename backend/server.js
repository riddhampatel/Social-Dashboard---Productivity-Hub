const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration - allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const io = socketIO(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches Vercel pattern
      if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches Vercel pattern
      if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use("/uploads", express.static("uploads"));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Socket.io connection
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/bookmarks", require("./routes/bookmarks"));
app.use("/api/events", require("./routes/events"));
app.use("/api/widgets", require("./routes/widgets"));

// Root route
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Social Dashboard API Server",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      tasks: "/api/tasks",
      notes: "/api/notes",
      bookmarks: "/api/bookmarks",
      events: "/api/events",
      widgets: "/api/widgets",
      health: "/api/health"
    }
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});
