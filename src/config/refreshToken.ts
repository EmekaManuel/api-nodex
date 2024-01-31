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
  const cookies = req.cookies;

  if (!cookies?.refreshToken) throw new Error('no refresh token in cookie');

  const refreshToken = cookies.refreshToken;

  const user = await User.findOne({ refreshToken });

  if (!user) {
    throw new Error('No refresh token for this user');
  }

  if (refreshToken && user) {
    JWt.verify(refreshToken, process.env.JWT || '', (err: any, decoded: any) => {
      if (err || user.id !== decoded.id) {
        throw new Error('There is something wrong with this refresh token');
      }
      const accessToken = generateRefreshToken(user?.id);
      res.json({ accessToken });
      console.log(decoded);
    });
  }
});
