// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);

// MongoDB connection
mongoose
  .connect(process.env.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("DB connection error:", err.message));

// Start server
const port = process.env.port || 8080;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Track online users
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Add user to online users map
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Online users:", onlineUsers);
  });

  // Send message to recipient
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); // 'to' is recipient's userId
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });

  // Remove user from map on disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});
