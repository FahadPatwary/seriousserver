const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serve a basic welcome page
app.get("/", (req, res) => {
  res.send("✅ WebSocket Room-Based Sync Server is Running!");
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Join a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`🔹 User ${socket.id} joined room: ${roomId}`);
  });

  // Sync media within a room
  socket.on("syncMedia", ({ roomId, mediaState }) => {
    console.log(`🔄 Syncing media in Room ${roomId}:`, mediaState);
    socket.to(roomId).emit("syncMedia", mediaState); // Broadcast within room
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// Start server on Railway's assigned PORT (default 8080)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));