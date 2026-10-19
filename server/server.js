require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const { connectDB } = require("./config/db");
const { initSocket } = require("./socket");
const app = require("./app");

const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
initSocket(io);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Smart Drainage Unified Server running on port ${PORT}`);
    console.log(`📡 WebSocket / Socket.IO enabled`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log(`💻 Serving Frontend from: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
};

startServer();

module.exports = server;
