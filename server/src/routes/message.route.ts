import * as express from 'express';
import {Auth} from '../middlewares/authMiddleware';
import {sendMessage, allMessages} from '../controllers/messageController';

const messageRouter = express.Router();

messageRouter.route('/').post(Auth, sendMessage);
messageRouter.route('/:chatId').get(Auth, allMessages);
export default messageRouter;
