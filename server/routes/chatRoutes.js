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

// cause all chat related apis are protected
chatRouter.use(Auth);

chatRouter.route("/").post(accessChat);
chatRouter.route("/").get(getChats);
chatRouter.route("/group").post(creatGroupChat);
chatRouter.route("/rename").put(renameGroup);
chatRouter.route("/AddTogroup").put(addToGroup);
chatRouter.route("/removeFromgroup").put(removeFromGroup);

export default chatRouter;
