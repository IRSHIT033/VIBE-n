import express from "express";
import {
  allUser,
  getCurrentUser,
  handleRegisterUser,
} from "../controllers/userController.js";
import { Auth } from "../middleware/authMiddleware.js";
import handleLogout from "../controllers/logoutController.js";
import handleRefreshToken from "../controllers/refreshTokenController.js";
import handleLogin from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
router.route("/").get(Auth, allUser);

router.route("/currentuser").get(Auth, getCurrentUser);
router.post("/create", handleRegisterUser);
router.post("/login", handleLogin);
router.get("/logout", handleLogout);
router.get("/refresh", handleRefreshToken);

export default router;
