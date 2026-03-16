const User = require("./model/userModel");
const { Server } = require("socket.io");
const connectToDatabase = require("./db");
const { app, createCorsOptions, getAllowedOrigins } = require("./app");
require("dotenv").config();

const onlineUsers = new Map();
const DEFAULT_PORT = 8080;

function getPort() {
  const parsedPort = Number(process.env.port || process.env.PORT || DEFAULT_PORT);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;
}

async function startServer() {
  await connectToDatabase();

  const port = getPort();
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (error) => {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  });

  const io = new Server(server, {
    cors: createCorsOptions(),
  });

  const allowedOrigins = getAllowedOrigins();
  console.log(
    `Socket.IO enabled for origins: ${
      Array.isArray(allowedOrigins) ? allowedOrigins.join(", ") : allowedOrigins
    }`
  );

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
