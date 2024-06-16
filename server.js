const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
    allowedHeaders: ["Access-Control-Allow-Origin"], // Allow these custom headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});

app.get("/", (req, res) => {
  res.send("Chat Server is running");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
