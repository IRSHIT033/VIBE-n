import * as asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import * as jwt from 'jsonwebtoken';

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(401);
  const refreshToken = cookies.jwt;

  res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});

  const foundUser = await User.findOne({refreshToken}).exec();

  //Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: any, decoded: any) => {
        if (err) res.sendStatus(403); //Forbidden

        const hackedUser = await User.findOne({
          email: decoded.email,
        }).exec();

        //clearing all the refresh token
        if (hackedUser) {
          hackedUser.refreshToken = [];
          await hackedUser.save();
        }
      }
    );

    res.sendStatus(403); //Forbidden
  } else {
    //Delete refreshToken in db
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: any, decoded: any) => {
        if (err) {

          foundUser.refreshToken = [...newRefreshTokenArray];
          const result = await foundUser.save();
        }
        if (err || foundUser.email !== decoded.email) res.sendStatus(403);

        // Refresh token was still valid

        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: decoded.email,
            },
          },
          process.env.ACCESS_TOKEN_SECRET!,
          {expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME!}
        );

        const newRefreshToken = jwt.sign(
          {email: foundUser.email},
          process.env.REFRESH_TOKEN_SECRET!,
          {expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME!}
        );

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

        res.json({accessToken});
      }
    );
  }
});
export default handleRefreshToken;
