import express from "express";
import { Auth } from "../middleware/authMiddleware.js";
const messageRouter = express.Router();
//messageRouter.route("/").post(Auth, sendMessage);
//router.route('/:chatId').post(Auth,allMessages)
export default messageRouter;
