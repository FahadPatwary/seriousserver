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

// Store the last media state per room
const roomMediaState = {};

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

    // If there's an existing media state for this room, send it to the new user
    if (roomMediaState[roomId]) {
      console.log(`🔄 Sending latest media state to ${socket.id} in Room ${roomId}`);
      socket.emit("syncMedia", roomMediaState[roomId]);
    }
  });

  // Sync media within a room and store its state
  socket.on("syncMedia", ({ roomId, mediaState }) => {
    console.log(`🔄 Syncing media in Room ${roomId}:`, mediaState);

    // Save the media state for future users
    roomMediaState[roomId] = mediaState;

    // Broadcast update to everyone except sender
    socket.to(roomId).emit("syncMedia", mediaState);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// Start server on Railway's assigned PORT (default 8080)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));