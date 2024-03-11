import * as express from 'express';
import {
  allUser,
  getCurrentUser,
  handleRegisterUser,
} from '../controllers/userController';
import {Auth} from '../middlewares/authMiddleware';
import handleLogout from '../controllers/logoutController';
import handleRefreshToken from '../controllers/refreshTokenController';
import handleLogin from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
router.post('/create', handleRegisterUser);
router.post('/login', handleLogin);
router.route('/').get(Auth, allUser);
router.route('/currentuser').get(Auth, getCurrentUser);
router.get('/logout', Auth, handleLogout);
router.get('/refresh', handleRefreshToken);

export default router;
