import express from "express";
import {
  registerUser,
  authUser,
  allUser,
} from "../controllers/userController.js";
import { Auth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(registerUser).get(Auth, allUser);
router.post("/login", authUser);

export default router;
