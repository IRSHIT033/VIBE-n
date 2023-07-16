import express from "express";
import { allUser, handleRegisterUser } from "../controllers/userController.js";
import { Auth } from "../middleware/authMiddleware.js";
import handleLogout from "../controllers/logoutController.js";
import handleRefreshToken from "../controllers/refreshTokenController.js";
import handleLogin from "../controllers/authController.js";

const router = express.Router();

router.route("/").get(Auth, allUser);
router.post("/create", handleRegisterUser);
router.post("/login", handleLogin);
router.get("/logout", handleLogout);
router.get("/refresh", handleRefreshToken);

export default router;
