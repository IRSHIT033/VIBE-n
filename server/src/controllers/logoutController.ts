import * as asyncHandler from 'express-async-handler';
import User from '../models/user.model';

const handleLogout = asyncHandler(async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({refreshToken}).exec();
  if (!foundUser) {
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
    res.sendStatus(204);
  }

  // Delete refreshToken in db
  if (foundUser) {
    foundUser.refreshToken.splice(0, foundUser.refreshToken.length);
    await foundUser.save();
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
    res.sendStatus(204);
  } else {
    res.sendStatus(403);
  }
});

export default handleLogout;
