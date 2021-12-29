import jwt from "jsonwebtoken";
import User from "../models/user_model.js";
import asyncHandler from "express-async-handler";

export const Auth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      req.statusCode(401);
      throw new Error("Not Authorized ");
    }
  }
});
