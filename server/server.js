import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import router from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { not_found, error_handler } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import compression from "compression";

import * as io from "socket.io";
import health_checkup_route from "./healthcheckup/index.js";
import swaggerDocs from "./utils/swagger.js";

dotenv.config();

await connectDB();

const app = express();
const port = 5000 || process.env.PORT;

// Compress all routes
app.use(compression());

//security init
app.use(helmet());

//cors config
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST",
    optionsSuccessStatus: 200,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

// Set up rate limiter: maximum of twenty requests per minute

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
//app.use(limiter);

app.use(express.json());

app.use(cookieParser());

//handle routes for user related api requests
app.use("/api/v1/user", router);
//handle routes for chat related api requests
app.use("/api/v1/chat", chatRouter);
//handle routes for message related api requests
app.use("/api/v1/message", messageRouter);

//health checkup
app.use("/healthcheckup", health_checkup_route);

swaggerDocs(app, port);
//error handling middleware
app.use(not_found);
app.use(error_handler);

const server = app.listen(port, () => {
  console.log("server is running on " + port);
});

//socket io init
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
