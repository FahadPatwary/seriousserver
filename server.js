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

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`🔗 User ${socket.id} joined room ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 User ${socket.id} left room ${roomId}`);
  });

  socket.on("syncMedia", ({ roomId, mediaState }) => {
    console.log(`🔄 Syncing media in room ${roomId}`);
    socket.to(roomId).emit("syncMedia", { mediaState });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Media sync server is running on port ${PORT}`);
});

