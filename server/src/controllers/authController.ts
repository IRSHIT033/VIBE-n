import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/user.model.js";

const handleLogin = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const { email, password } = req.body;
  if (!email || !password)
    res
      .status(400)
      .json({ message: "email and password are required." });

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) {
    res.sendStatus(401); //Unauthorized
  } else {
    // evaluate password

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME }
      );
      const newRefreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME }
      );

      // Saving refreshToken with current user
      const newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      }

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

      const loggedInUser = await foundUser.save();

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Send access token to user
      res.json({
        accessToken: accessToken,
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        pic: foundUser.pic,
      });

    } else {
      res.sendStatus(401);
    }
  }
});

export default handleLogin;
