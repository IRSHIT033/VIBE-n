"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var chatController_js_1 = require("../controllers/chatController.js");
var authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
var chatRouter = express.Router();
// cause all chat related apis are protected
chatRouter.use(authMiddleware_js_1.Auth);
/**
 * @swagger
 * /api/v1/chat/:
 *   post:
 *     tags:
 *        - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route('/').post(chatController_js_1.accessChat);
/**
 * @swagger
 * /api/v1/chat/:
 *   get:
 *     tags:
 *        - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route('/').get(chatController_js_1.getChats);
/**
 * @swagger
 * /api/v1/chat/group/:
 *   post:
 *     tags:
 *        - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route('/group').post(chatController_js_1.creatGroupChat);
/**
 * @swagger
 * /api/v1/chat/rename/:
 *   put:
 *     tags:
 *       - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route('/rename').put(chatController_js_1.renameGroup);
/**
 * @swagger
 * /api/v1/chat/AddTogroup/:
 *   put:
 *     tags:
 *        - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route('/AddTogroup').put(chatController_js_1.addToGroup);
/**
 * @swagger
 * /api/v1/chat/removeFromgroup/:
 *   put:
 *     tags:
 *       - Chat
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
chatRouter.route('/removeFromgroup').put(chatController_js_1.removeFromGroup);
exports.default = chatRouter;
//# sourceMappingURL=chat.route.js.map