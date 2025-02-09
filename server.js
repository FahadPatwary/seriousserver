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
    try {
      socket.join(roomId);
      console.log(`🔹 User ${socket.id} joined room: ${roomId}`);

      if (roomMediaState[roomId]) {
        console.log(`🔄 Sending latest media state to ${socket.id} in Room ${roomId}`);
        socket.emit("syncMedia", { mediaState: roomMediaState[roomId] });
      }
    } catch (error) {
      console.error(`❌ Error joining room ${roomId}:`, error);
    }
  });

  socket.on("syncMedia", ({ roomId, mediaState }) => {
    try {
      console.log(`🔄 Syncing media in Room ${roomId}:`, mediaState);

      roomMediaState[roomId] = mediaState;

      socket.to(roomId).emit("syncMedia", { mediaState });
    } catch (error) {
      console.error(`❌ Error syncing media in room ${roomId}:`, error);
    }
  });

  socket.on("leaveRoom", (roomId) => {
    try {
      socket.leave(roomId);
      console.log(`🔸 User ${socket.id} left room: ${roomId}`);
    } catch (error) {
      console.error(`❌ Error leaving room ${roomId}:`, error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
