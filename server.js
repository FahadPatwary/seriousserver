const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://media-player-web.netlify.app", "https://*.netlify.app"]
      : "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Add the CSP header
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' https://seriousserver.onrender.com wss://seriousserver.onrender.com"
  );
  next();
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("🎬 Media Sync Server is Running!");
});

// Rate limiting map to prevent abuse
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

// Helper function to check rate limit
function checkRateLimit(socketId) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(socketId) || { count: 0, windowStart: now };
  
  if (now - userRequests.windowStart > RATE_LIMIT_WINDOW) {
    userRequests.count = 1;
    userRequests.windowStart = now;
  } else {
    userRequests.count++;
  }
  
  rateLimitMap.set(socketId, userRequests);
  return userRequests.count <= MAX_REQUESTS_PER_WINDOW;
}

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);
  
  // Clean up rate limit data on disconnect
  socket.on('disconnect', () => {
    rateLimitMap.delete(socket.id);
  });

  socket.on("createRoom", () => {
    try {
      // Check rate limit
      if (!checkRateLimit(socket.id)) {
        socket.emit("roomError", { message: "Rate limit exceeded. Please try again later." });
        return;
      }
      
      // Generate a random 6-character room code
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      socket.join(roomCode);
      console.log(`🏠 User ${socket.id} created room ${roomCode}`);
      socket.emit("roomCreated", { roomCode });
    } catch (error) {
      console.error(`❌ Error creating room for ${socket.id}:`, error);
      socket.emit("roomError", { message: "Failed to create room" });
    }
  });

  socket.on("joinRoom", (data) => {
    try {
      // Check rate limit
      if (!checkRateLimit(socket.id)) {
        socket.emit("roomError", { message: "Rate limit exceeded. Please try again later." });
        return;
      }
      
      const roomCode = data.roomCode || data;
      if (!roomCode || typeof roomCode !== 'string' || roomCode.trim().length === 0) {
        socket.emit("roomError", { message: "Invalid room code" });
        return;
      }
      
      // Validate room code format (6 alphanumeric characters)
      const cleanRoomCode = roomCode.trim().toUpperCase();
      if (!/^[A-Z0-9]{6}$/.test(cleanRoomCode)) {
        socket.emit("roomError", { message: "Room code must be 6 characters long" });
        return;
      }
      
      socket.join(cleanRoomCode);
      console.log(`🔗 User ${socket.id} joined room ${cleanRoomCode}`);
      socket.emit("roomJoined", { roomCode: cleanRoomCode });
      
      // Notify other users in the room
      socket.to(cleanRoomCode).emit("userJoined", { userId: socket.id });
    } catch (error) {
      console.error(`❌ Error joining room for ${socket.id}:`, error);
      socket.emit("roomError", { message: "Failed to join room" });
    }
  });

  socket.on("leaveRoom", (data) => {
     try {
       const roomCode = data.roomCode || data;
       if (roomCode) {
         socket.leave(roomCode);
         console.log(`🚪 User ${socket.id} left room ${roomCode}`);
         socket.emit("roomLeft", { roomCode });
         
         // Notify other users in the room
         socket.to(roomCode).emit("userLeft", { userId: socket.id });
       }
     } catch (error) {
       console.error(`❌ Error leaving room for ${socket.id}:`, error);
     }
   });

  socket.on("syncMedia", ({ roomId, mediaState }) => {
    try {
      if (!roomId || !mediaState) {
        console.error(`❌ Invalid sync data from ${socket.id}:`, { roomId, mediaState });
        socket.emit("roomError", { message: "Invalid sync data" });
        return;
      }
      
      // Validate mediaState structure
      if (typeof mediaState.currentTime !== 'number' || typeof mediaState.isPlaying !== 'boolean') {
        console.error(`❌ Invalid media state from ${socket.id}:`, mediaState);
        socket.emit("roomError", { message: "Invalid media state format" });
        return;
      }
      
      console.log(`🔄 Syncing media in room ${roomId}:`, mediaState);
      socket.to(roomId).emit("syncMedia", { mediaState });
    } catch (error) {
      console.error(`❌ Error syncing media for ${socket.id}:`, error);
      socket.emit("roomError", { message: "Failed to sync media" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User ${socket.id} disconnected`);
    // Socket.IO automatically handles leaving rooms on disconnect
    // But we could add additional cleanup logic here if needed
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🚀 Media sync server is running on port ${PORT}`);
});

