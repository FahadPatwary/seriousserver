const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("syncMedia", (data) => {
    console.log("Syncing media:", data);
    socket.broadcast.emit("syncMedia", data); // Broadcast sync data
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(8080, () => console.log("WebSocket server running on port 8080"));
