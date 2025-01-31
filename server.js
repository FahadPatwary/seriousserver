const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for WebSocket connections
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store the latest media state (to sync new users)
let mediaState = {
  filePath: "",
  currentTime: 0,
  isPlaying: false,
  isMuted: false
};

io.on('connection', (socket) => {
  console.log(`🔗 User Connected: ${socket.id}`);

  // Send current media state to newly connected clients
  socket.emit('syncMedia', mediaState);

  // When a client updates media state, broadcast it to all others
  socket.on('syncMedia', (data) => {
    mediaState = { ...mediaState, ...data }; // Update state
    socket.broadcast.emit('syncMedia', mediaState); // Sync all clients
    console.log("📡 Media Sync Updated:", mediaState);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket Server running on port ${PORT}`);
});
