const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST"],
  },
});

// Update the CSP header
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' https://seriousserver-production.up.railway.app wss://seriousserver-production.up.railway.app; media-src 'self' mediastream:; worker-src 'self'"
  );
  next();
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("🎬 Media Sync Server is Running!");
});

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`🔗 User ${socket.id} joined room ${roomId}`);
    // Notify other users in the room about the new user
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 User ${socket.id} left room ${roomId}`);
    // Notify others that user has left
    socket.to(roomId).emit('user-left', socket.id);
  });

  socket.on("syncMedia", ({ roomId, mediaState }) => {
    console.log(`🔄 Syncing media in room ${roomId}`);
    socket.to(roomId).emit("syncMedia", { mediaState });
  });

  // WebRTC Signaling
  socket.on("webrtc-offer", ({ target, offer }) => {
    console.log(`📤 Relaying WebRTC offer to ${target}`);
    socket.to(target).emit("webrtc-offer", {
      source: socket.id,
      offer: offer
    });
  });

  socket.on("webrtc-answer", ({ target, answer }) => {
    console.log(`📥 Relaying WebRTC answer to ${target}`);
    socket.to(target).emit("webrtc-answer", {
      source: socket.id,
      answer: answer
    });
  });

  socket.on("webrtc-ice-candidate", ({ target, candidate }) => {
    console.log(`❄️ Relaying ICE candidate to ${target}`);
    socket.to(target).emit("webrtc-ice-candidate", {
      source: socket.id,
      candidate: candidate
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User ${socket.id} disconnected`);
    // Notify all rooms this user was in
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('user-left', socket.id);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Media sync server is running on port ${PORT}`);
}); 