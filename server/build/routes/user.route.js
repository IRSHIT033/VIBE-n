"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var userController_js_1 = require("../controllers/userController.js");
var authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
var logoutController_js_1 = require("../controllers/logoutController.js");
var refreshTokenController_js_1 = require("../controllers/refreshTokenController.js");
var authController_js_1 = require("../controllers/authController.js");
var router = express.Router();
/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
router.route('/').get(authMiddleware_js_1.Auth, userController_js_1.allUser);
router.route('/currentuser').get(authMiddleware_js_1.Auth, userController_js_1.getCurrentUser);
router.post('/create', userController_js_1.handleRegisterUser);
router.post('/login', authController_js_1.default);
router.get('/logout', logoutController_js_1.default);
router.get('/refresh', refreshTokenController_js_1.default);
exports.default = router;
//# sourceMappingURL=user.route.js.map