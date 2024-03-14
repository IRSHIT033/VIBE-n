import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as asyncHandler from 'express-async-handler';
import {Request, Response} from 'express';
import User from '../models/user.model';

const handleLogin = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const {email, password} = req.body;
  if (!email || !password)
    res.status(400).json({message: 'email and password are required.'});

  const foundUser = await User.findOne({email: email});


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
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME}
      );
      const newRefreshToken = jwt.sign(
        {email: foundUser.email},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME}
      );

      // Saving refreshToken with current user

      let newRefreshTokenArray =
        !cookies?.jwt
          ? foundUser.refreshToken
          : foundUser.refreshToken?.filter(rt => rt !== cookies.jwt);


      if (cookies?.jwt) {
        /* 
           Scenario added here: 
               1) User logs in but never uses RT and does not logout 
               2) RT is stolen
               3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
           */
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({refreshToken}).exec();


        // Detected refresh token reuse!
        if (!foundToken) {
          console.log('attempted refresh token reuse at login!')
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
      }


      // Saving refreshToken with current user

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();


      // Creates Secure Cookie with refresh token
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
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
