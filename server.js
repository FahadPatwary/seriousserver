const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

// Handle connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("syncMedia", (data) => {
    console.log("Syncing media:", data);
    socket.broadcast.emit("syncMedia", data); // Broadcast sync data
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Listen on Railway's PORT (default to 8080 if not set)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
