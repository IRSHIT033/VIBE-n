import * as asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import {CustomRequest} from '../middlewares/authMiddleware';

export const handleRegisterUser = asyncHandler(async (req, res) => {
  const {name, email, password, pic} = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please Enter All Fields');
  }
  const userExists = await User.findOne({email});

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      message: ' User created successFully ',
    });
  } else {
    res.status(400);
    throw new Error('Failed to create the user');
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json((req as CustomRequest).user);
});

export const allUser = asyncHandler(async (req, res) => {
  const key = req.query.search
    ? {
      $or: [
        {name: {$regex: req.query.search, $options: 'i'}},
        {email: {$regex: req.query.search, $options: 'i'}},
      ],
    }
    : {};

  if (!(req as CustomRequest).user?._id) {
    res.status(400);
    throw new Error('Failed to fetch the current user');
  }
  //return all users except the current one
  const users = await User.find(key).find({
    _id: {$ne: (req as CustomRequest).user._id},
  });

  res.status(200).send(users);
});
