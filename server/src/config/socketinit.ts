import { Server } from "http";
import * as io from "socket.io";

//socket io init
const socketInit = (server: Server) => {

  const socketio = new io.Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      optionsSuccessStatus: 200,
      credentials: true,
      methods: ["GET", "POST", "PUT"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Origin",
        "Accept",
      ],
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
      chat.users.forEach((user: any) => {
        if (user._id == newMsgReceived.sender._id) return;
        socket.in(user._id).emit("got the msg", newMsgReceived);
      });
    });

    socket.on("typing", (room) => {
      socket.to(room).emit("typing");
    });
    socket.on("typing stopped", (room) => socket.to(room).emit("typing stopped"));


  });
}

export default socketInit