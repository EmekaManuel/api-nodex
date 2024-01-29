import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

import User from '../models/userModel';
import { TokenPayload } from '../config/jwt';
import { authMiddlewareLogger, IsAdminMiddlewareLogger } from '../utils/loggers';
dotenv.config();

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if (token) {
        const decode: TokenPayload = jwt.verify(token, process.env.JWT || '') as TokenPayload;
        console.log(decode);
        const user = await User.findById(decode?.id);
        req.user = user;
        authMiddlewareLogger.info('Completed the auth middleware check');
        next();
      }
    } catch (error) {
      authMiddlewareLogger.error('Auth Token Expired, Login');
      throw new Error('Auth Token Expired, Login');
    }
  } else {
    authMiddlewareLogger.error('There is no token attached to the header');
    throw new Error('There is no token attached to the header');
  }
});

export const isAdmin = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email });

  if (adminUser?.role !== 'admin') {
    IsAdminMiddlewareLogger.error('You are not an Admin');
    throw new Error('You are not an Admin');
  } else {
    IsAdminMiddlewareLogger.info('Completed the isAdmin middleware check');
    next();
  }
});
