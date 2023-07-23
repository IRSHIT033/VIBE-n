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

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.user = await User.findOne({ email: decoded.UserInfo.email }).select(
        "-password"
      );
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not Authorized ");
    }
  }
});
