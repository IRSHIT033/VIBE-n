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
app.use(express.json()); //to accept json data
const port = 5000 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello chat");
  console.log("hello home");
});

app.use("/api/user", router);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use(not_found);
app.use(error_handler);
app.listen(port, () => {
  console.log("server is running on " + port);
});
