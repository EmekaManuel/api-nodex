import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { TokenPayload } from '../config/jwt';
dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if (token) {
        const decode: TokenPayload = jwt.verify(token, process.env.JWT || '') as TokenPayload;
        const user = await User.findById(decode?.id);

        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Auth Token Expired, Login');
    }
  } else {
    throw new Error('There is no token attached to the header');
  }
});

export const isAdmin = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log(req.user);
});
