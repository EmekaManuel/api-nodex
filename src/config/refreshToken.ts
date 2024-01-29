import JWt from 'jsonwebtoken';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '../models/userModel';
dotenv.config();

export interface TokenPayload {
  id: string;
}

export const generateRefreshToken = (id: string): string => {
  const tokenPayload: TokenPayload = { id };
  return JWt.sign(tokenPayload, process.env.JWT || '', { expiresIn: '3d' });
};

export const handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken) throw new Error('no refresh token in cookie');

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  res.json(user);
  if (!user) throw new Error('No refresh token for this user');
  console.log(refreshToken);

  if (refreshToken && user) {
    JWt.verify(refreshToken, process.env.JWT || '', (err: any, decoded: any) => {
      console.log(decoded);
    });
  }
});
