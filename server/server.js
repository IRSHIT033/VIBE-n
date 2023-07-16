import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import router from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { not_found, error_handler } from "./middleware/errorMiddleware.js";
dotenv.config();

connectDB();
const app = express();
app.use(express.json());
const port = 5000 || process.env.PORT;

app.use("/api/user", router);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(not_found);
app.use(error_handler);

const server = app.listen(port, () => {
  console.log("server is running on " + port);
});

import * as io from "socket.io";

const socketio = new io.Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

socketio.on("connection", (socket) => {
  const socketId = socket.id;
  socket.on("setup", async (user) => {
    socket.join(user._id);
    console.log(`user ${user.name} joined  `);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("newMsg", (newMsgReceived) => {
    var chat = newMsgReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMsgReceived.sender._id) return;
      socket.in(user._id).emit("got the msg", newMsgReceived);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("typing stopped", (room) => socket.in(room).emit("typing stopped"));

  socket.off("setup", (user) => {
    console.log(`${user} DISCONNECTED`);
    socket.leave(user._id);
  });

  socket.on("disconnect", async () => {
    console.log("user disconnected");
  });
});
