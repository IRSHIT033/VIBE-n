import express from "express";
import { Auth } from "../middleware/authMiddleware.js";
import { sendMessage, allMessages } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.route("/").post(Auth, sendMessage);
messageRouter.route("/:chatId").get(Auth, allMessages);
export default messageRouter;
