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

/**
 * @swagger
 * /api/v1/chat/:
 *   post:
 *     tags:
 *        - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route("/").post(accessChat);
/**
 * @swagger
 * /api/v1/chat/:
 *   get:
 *     tags:
 *        - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route("/").get(getChats);
/**
 * @swagger
 * /api/v1/chat/group/:
 *   post:
 *     tags:
 *        - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route("/group").post(creatGroupChat);
/**
 * @swagger
 * /api/v1/chat/rename/:
 *   put:
 *     tags:
 *       - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route("/rename").put(renameGroup);
/**
 * @swagger
 * /api/v1/chat/AddTogroup/:
 *   put:
 *     tags:
 *        - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route("/AddTogroup").put(addToGroup);
/**
 * @swagger
 * /api/v1/chat/removeFromgroup/:
 *   put:
 *     tags:
 *       - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route("/removeFromgroup").put(removeFromGroup);

export default chatRouter;
