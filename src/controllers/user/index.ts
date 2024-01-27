import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../../models/userModel';
import generateToken from '../../config/jwt';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (!userExist) {
    try {
      if (!password) {
        res.status(500).json({ msg: 'Password is required', success: false });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ ...req.body, password: hashedPassword });
      res.json({ msg: 'new user created', newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ msg: 'Internal Server Error', success: false });
    }
  } else {
    throw new Error('User already exists');
  }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: 'Required values are missing', success: false });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ msg: 'User not found', success: false });
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (isPasswordMatch) {
    res.json({ msg: 'Login successful', success: true, user, token: generateToken(user?._id) });
  } else [res.status(401).json({ msg: 'Password do not match', success: false })];
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ msg: 'All Users found', success: true, allUsers });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const getUserById = await User.findById(id);
    res.status(200).json({ msg: 'User found', success: true, getUserById });
  } catch (error) {
    throw new Error("User Doesn't exist");
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const getUserById = await User.findById(id);
    res.status(200).json({ msg: 'User Deleted', success: true, getUserById });
  } catch (error) {
    throw new Error("User Doesn't exist");
  }
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        email: req?.body?.email,
        password: req?.body?.password,
        mobile: req?.body?.mobile,
      },
      { new: true },
    );
    res.status(200).json({ msg: 'User Updated', success: true, updatedUser });
  } catch (error) {
    throw new Error('Error updating user');
  }
});
