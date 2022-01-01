import asyncHandler from "express-async-handler";
import User from "../models/user_model.js";
import Message from "../models/msg_model.js";
import Chat from "../models/chat_model.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("INVALID DATA PASSSED INTO REQUEST ");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
    console.log(message);
  } catch (err) {
    res.status(400);
    console.log(err);
    throw new Error(err.message);
  }
});

export const allMessages = async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(message);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};
