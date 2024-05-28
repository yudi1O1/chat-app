const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes")
const messageRoute = require("./routes/messagesRoute")
const socket = require("socket.io")

const app = express();
require("dotenv").config();

app.use(cors())
app.use(express.json());
app.use("/api/auth", userRoute)
app.use("/api/messages", messageRoute)




mongoose.connect(process.env.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(() => {
    console.log('db connection successful');
}).catch((error) => {
    console.log(error.message);
});




const server = app.listen(8080, () => {
    console.log("server running");
  });

// const io = socket(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         Credential:true,
//     },
// })

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//     global.chatSocket = socket;
//     socket.on("add-user", (userId) => {
//         onlineUsers.set(userId, socket.id);
//     });

//     socket.on("send-msg", (data) => {
//         const sendUserSocket = onlineUsers.get(data.io);
//         if (sendUserSocket) {
//             socket.to(sendUserSocket).emit("msg-recieve",data,msg)
//         }
//     })
// })

