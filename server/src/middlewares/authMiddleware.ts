import * as jwt from "jsonwebtoken";
import User from "../src/models/user_model.js";
import * as asyncHandler from "express-async-handler";
import { Request, Response, NextFunction, Express } from "express"


export interface CustomRequest extends Request {
  user: any;
}

export const Auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;

      (req as CustomRequest).user = await User.findOne({ email: decoded.UserInfo.email }).select(
        "-password"
      );
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not Authorized ");
    }
  }
});
