import * as asyncHandler from "express-async-handler";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import { CustomRequest } from "../middlewares/authMiddleware";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.sendStatus(400);
  }
  var chat_exist = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: (req as CustomRequest).user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chat_exist = await User.populate(chat_exist, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (chat_exist.length > 0) {
    res.send(chat_exist[0]);
  } else {
    var chat_data = {
      chatName: "sender",
      isGroupChat: false,
      users: [(req as CustomRequest).user._id, userId],
    };
    try {
      const createChat = await Chat.create(chat_data);
      const Allchat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(Allchat);
    } catch (err: any) {
      res.status(400);
      throw new Error(err.message);
    }
  }
});

export const getChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: (req as CustomRequest).user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
});

export const creatGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).send({ message: "Please Fill all the fields" });
  }
  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push((req as CustomRequest).user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: (req as CustomRequest).user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updateChat) {
    res.send(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updateChat);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const add = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!add) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(add);
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const rem = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!rem) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(rem);
  }
});
