const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
app.use(cors({
  origin: 'https://connectwithme101.netlify.app/'
  }));
  
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://connectwithme101.netlify.app/", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
    allowedHeaders: ["Access-Control-Allow-Origin"], // Allow these custom headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});
dotenv.config({ path: './config.env' });

  
  const DB = process.env.MONGODB_URL.replace(
  '<PASSWORD>',
  process.env.PASSWORD
).replace(
  '<USERNAME>',
  process.env.USER_NAME
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection is successful'))
  .catch(err => console.error('MongoDB connection error:', err));


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
