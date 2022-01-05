import express from "express";
import {
  registerUser,
  authUser,
  allUser,
} from "../controllers/userController.js";
import { Auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(Auth, allUser);
router.route("/").post(registerUser);
router.post("/login", authUser);

export default router;
