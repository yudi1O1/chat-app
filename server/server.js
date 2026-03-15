const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const User = require("./model/userModel");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const onlineUsers = new Map();
const DEFAULT_PORT = 8080;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.disable("x-powered-by");
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled application error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

function getPort() {
  const parsedPort = Number(process.env.port || process.env.PORT || DEFAULT_PORT);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;
}

async function startServer() {
  if (!process.env.mongo_url) {
    throw new Error("Missing required environment variable: mongo_url");
  }

  await mongoose.connect(process.env.mongo_url);
  console.log("DB connection successful");

  const port = getPort();
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (error) => {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  });

  const io = new Server(server, {
    cors: {
      origin: CLIENT_ORIGIN,
      credentials: true,
    },
  });

  const broadcastOnlineUsers = () => {
    io.emit("online-users", Array.from(onlineUsers.keys()));
  };

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("add-user", async (userId) => {
      if (typeof userId !== "string" || !userId.trim()) {
        return;
      }

      onlineUsers.set(userId, socket.id);
      socket.data.userId = userId;
      broadcastOnlineUsers();

      try {
        await User.findByIdAndUpdate(userId, {
          lastSeen: new Date(),
        });
      } catch (error) {
        console.error("Failed to update user presence:", error.message);
      }
    });

    socket.on("send-msg", (data = {}) => {
      const { to, message, from } = data;
      if (typeof to !== "string" || !to.trim()) {
        return;
      }

      if (typeof message !== "string" || !message.trim()) {
        return;
      }

      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        const payload = { from, message };
        socket.to(recipientSocketId).emit("msg-receive", payload);
        socket.to(recipientSocketId).emit("msg-recieve", payload);
      }
    });

    socket.on("disconnect", async () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      if (socket.data.userId) {
        try {
          await User.findByIdAndUpdate(socket.data.userId, {
            lastSeen: new Date(),
          });
        } catch (error) {
          console.error("Failed to update last seen:", error.message);
        }
      }

      broadcastOnlineUsers();

      console.log("User disconnected:", socket.id);
    });
  });
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});
