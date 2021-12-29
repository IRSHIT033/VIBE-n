import express from "express";
import {
  accessChat,
  getChats,
  creatGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from "../controllers/chatController.js";
import { Auth } from "../middleware/authMiddleware.js";
const chatRouter = express.Router();
chatRouter.route("/").post(Auth, accessChat);
chatRouter.route("/").get(Auth, getChats);
chatRouter.route("/group").post(Auth, creatGroupChat);
chatRouter.route("/rename").put(Auth, renameGroup);
chatRouter.route("/AddTogroup").put(Auth, addToGroup);
chatRouter.route("/removeFromgroup").put(Auth, removeFromGroup);
export default chatRouter;
