require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

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

// Middleware with 50mb limit for citizen complaint photo uploads
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request Logger
app.use((req, res, next) => {
  if (!req.path.startsWith("/assets")) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health Check
app.get(["/health", "/api/health"], (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount API Router on both /api and root so it works seamlessly in standalone and Vercel Serverless
const apiRouter = express.Router();
apiRouter.use("/drains", drainRoutes);
apiRouter.use("/sensors", sensorRoutes);
apiRouter.use("/alerts", alertRoutes);
apiRouter.use("/workers", workerRoutes);
apiRouter.use("/rainfall", rainfallRoutes);
apiRouter.use("/roads", roadRoutes);
apiRouter.use("/analytics", analyticsRoutes);
apiRouter.use("/simulation", simulationRoutes);
apiRouter.use("/ai", simulationRoutes);
apiRouter.use("/complaints", complaintRoutes);
apiRouter.use("/auth", authRoutes);

app.use("/api", apiRouter);
app.use(apiRouter);

// Serve frontend static build files (from Vite build in dist/)
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Root info route when client build is not present
app.get("/api", (req, res) => {
  res.json({
    project: "Smart Drainage Management System",
    type: "Smart City Municipal IoT & AI Monitoring Platform",
    version: "1.0.0",
    status: "Operational",
    timestamp: new Date().toISOString()
  });
});

// SPA catch-all fallback for client-side routing
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/socket.io")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next();
  });
});

// 404 Handler for unmatched API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.originalUrl}` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

module.exports = app;
