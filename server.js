// server.js

const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

// Create an Express application
const app = express();
const server = http.createServer(app);

// Initialize Socket.io on the server
const io = socketIo(server);

// Store the media state (this will be shared among clients)
let mediaState = {
  filePath: null,
  currentTime: 0,
  isPlaying: false,
  playbackRate: 1
};

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Send index.html explicitly for root requests
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen for connections from clients
io.on('connection', (socket) => {
  console.log('A client connected');

  // Send the current media state to the new client
  socket.emit('syncMedia', mediaState);

  // Listen for media state updates from the client
  socket.on('syncMedia', (data) => {
    mediaState = data;  // Update the media state
    socket.broadcast.emit('syncMedia', data); // Broadcast the update to other clients
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Set the server to listen on port 3000
const port = process.env.PORT || 3000; // Use the port from the environment or default to 3000
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});