require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { connectDB } = require("./config/db");
const { initSocket } = require("./socket");

// Import Routes
const drainRoutes = require("./routes/drainRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const alertRoutes = require("./routes/alertRoutes");
const workerRoutes = require("./routes/workerRoutes");
const rainfallRoutes = require("./routes/rainfallRoutes");
const roadRoutes = require("./routes/roadRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const simulationRoutes = require("./routes/simulationRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
initSocket(io);

// Middleware with 50mb limit for citizen complaint photo uploads
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root & Health Check
app.get("/", (req, res) => {
  res.json({
    project: "Smart Drainage Management System",
    type: "Smart City Municipal IoT & AI Monitoring Platform",
    version: "1.0.0",
    status: "Operational",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use("/api/drains", drainRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/rainfall", rainfallRoutes);
app.use("/api/roads", roadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/ai", simulationRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Smart Drainage Backend running on port ${PORT}`);
    console.log(`📡 WebSocket / Socket.IO enabled`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
};

startServer();
