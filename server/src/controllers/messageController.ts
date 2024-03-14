import * as asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import Message from '../models/msg.model';
import Chat from '../models/chat.model';
import {CustomRequest} from '../middlewares/authMiddleware';

export const sendMessage = asyncHandler(async (req, res) => {
  const {content, chatId, replyingTo} = req.body;

  if (!content || !chatId) {
    console.log('INVALID DATA PASSSED INTO REQUEST');
    res.sendStatus(400);
  }
  const newMessage = {
    sender: (req as CustomRequest).user._id,
    content: content,
    chat: chatId,
    replyingTo: replyingTo,
  };
  console.log(chatId);

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic')


    message = await message.populate('chat');


    if (replyingTo) {
      message = await message.populate('replyingTo');
      message = await message.populate('replyingTo.sender', 'name pic')
    }

    const messageWithReply = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(messageWithReply ? messageWithReply : message);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
});

export const allMessages = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({
      chat: (req as CustomRequest).params.chatId,
    })
      .populate('sender', 'name pic email')
      .populate('chat')
      .populate('replyingTo');

    const messageWithReply = await User.populate(message, {
      path: 'replyingTo.sender',
      select: 'name pic email',
    });

    res.json(messageWithReply ? messageWithReply : message);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
});
