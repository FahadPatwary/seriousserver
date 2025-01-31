const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS to allow connections from Electron app
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins (use specific domains in production)
    methods: ["GET", "POST"]
  }
});

// Store the latest media state (to sync new users)
let mediaState = {
  filePath: "",
  currentTime: 0,
  isPlaying: false
};

io.on('connection', (socket) => {
  console.log(`🔗 User Connected: ${socket.id}`);

  // Send current media state to newly connected clients
  socket.emit('syncMedia', mediaState);

  // When a client updates media state, broadcast it to all others
  socket.on('syncMedia', (data) => {
    mediaState = data; // Update server's media state
    socket.broadcast.emit('syncMedia', data); // Sync all other clients
    console.log("📡 Media Sync Updated:", data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

// Start the server (use Railway PORT or fallback to 3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});