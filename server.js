// server.js

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

const roomMediaState = {};

app.get("/", (req, res) => {
  res.send("✅ WebSocket Room-Based Sync Server is Running!");
});

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`🔹 User ${socket.id} joined room: ${roomId}`);

    if (roomMediaState[roomId]) {
      console.log(`🔄 Sending latest media state to ${socket.id} in Room ${roomId}`);
      socket.emit("syncMedia", { mediaState: roomMediaState[roomId] });
    }
  });

  socket.on("syncMedia", ({ roomId, mediaState }) => {
    console.log(`🔄 Syncing media in Room ${roomId}:`, mediaState);

    roomMediaState[roomId] = mediaState;

    socket.to(roomId).emit("syncMedia", { mediaState });
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`🔸 User ${socket.id} left room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
