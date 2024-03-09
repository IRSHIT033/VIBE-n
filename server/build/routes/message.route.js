"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
var messageController_js_1 = require("../controllers/messageController.js");
var messageRouter = express.Router();
messageRouter.route('/').post(authMiddleware_js_1.Auth, messageController_js_1.sendMessage);
messageRouter.route('/:chatId').get(authMiddleware_js_1.Auth, messageController_js_1.allMessages);
exports.default = messageRouter;
//# sourceMappingURL=message.route.js.map