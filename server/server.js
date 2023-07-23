import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import cors from "cors";
import router from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { not_found, error_handler } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

connectDB();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());

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
  socket.on("setup", async (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("leaveRoom", (room) => {
    console.log("room leaved");
    socket.leave(room);
  });

  socket.on("newMsg", (newMsgReceived) => {
    console.log("new msg send by", newMsgReceived.sender._id);
    var chat = newMsgReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMsgReceived.sender._id) return;
      socket.in(user._id).emit("got the msg", newMsgReceived);
    });
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });
  socket.on("typing stopped", (room) => socket.to(room).emit("typing stopped"));

  socket.off("setup", () => {
    console.log("setup off");
    socket.leave(user._id);
  });
});
