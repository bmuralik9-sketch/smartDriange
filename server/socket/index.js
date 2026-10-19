let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ [Socket.IO] Client disconnected: ${socket.id}`);
    });

    socket.on("client_ping", (data) => {
      socket.emit("server_pong", { timestamp: new Date().toISOString() });
    });
  });
}

function getIO() {
  return ioInstance;
}

function emitEvent(event, data) {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
}

module.exports = {
  initSocket,
  getIO,
  emitEvent
};
