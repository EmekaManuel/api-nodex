import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../../models/userModel';
import generateToken from '../../config/jwt';
import { generateRefreshToken } from '../../config/refreshToken';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { validateMongodbId } from '../../utils/validatemongodbId';
import { generateResetToken } from '../../utils/helpers';
import crypto from 'crypto';
import { sendEmail } from '../../utils/mailer';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
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
  const refreshToken = await generateRefreshToken(user?.id);

  const updateUser = await User.findByIdAndUpdate(
    user?.id,
    {
      refreshToken: refreshToken,
    },
    { new: true },
  );
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (isPasswordMatch) {
    res.json({ msg: 'Login successful', success: true, token: generateToken(user?._id), user: updateUser });
  } else {
    res.status(401).json({ msg: 'Password do not match', success: false });
  }
});
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: 'Required values are missing', success: false });
  }

  const checkAdmin = await User.findOne({ email });
  if (checkAdmin?.role !== 'admin') {
    res.status(404).json({ msg: 'This User is Not An Admin', success: false });
  }
  if (!checkAdmin) {
    res.status(404).json({ msg: 'User not found', success: false });
    return;
  }
  const refreshToken = await generateRefreshToken(checkAdmin?.id);

  const updateAdmin = await User.findByIdAndUpdate(
    checkAdmin?.id,
    {
      refreshToken: refreshToken,
    },
    { new: true },
  );
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  const isPasswordMatch = await bcrypt.compare(password, checkAdmin.password);
  if (isPasswordMatch) {
    res.json({ msg: 'Login successful', success: true, token: generateToken(checkAdmin?._id), admin: updateAdmin });
  } else {
    res.status(401).json({ msg: 'Password do not match', success: false });
  }
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
  validateMongodbId(id);

  try {
    const getUserById = await User.findById(id);
    res.status(200).json({ msg: 'User found', success: true, getUserById });
  } catch (error) {
    throw new Error("User Doesn't exist");
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const getUserById = await User.findById(id);
    res.status(200).json({ msg: 'User Deleted', success: true, getUserById });
  } catch (error) {
    throw new Error("User Doesn't exist");
  }
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  validateMongodbId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        email: req?.body?.email,
        password: req?.body?.password,
        mobile: req?.body?.mobile,
        role: req?.body?.role,
      },
      { new: true },
    );
    res.status(200).json({ msg: 'User Updated', success: true, updatedUser });
  } catch (error) {
    throw new Error('Error updating user');
  }
});

export const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const blockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true },
    );

    if (blockedUser) {
      res.json({ msg: 'User blocked', user: blockedUser });
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    throw new Error('Unable to block user');
  }
});

export const unBlockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const unBlockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true },
    );
    res.json({ msg: 'User unblocked', unBlockedUser });
  } catch (error) {
    throw new Error('unable to unblock user');
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;

  const refreshToken = cookies.refreshToken;
  if (!refreshToken) throw new Error('No refresh token found in cookie');

  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204);
  }
  await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: '' });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.user;
  validateMongodbId(id);
  const { newPassword } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({ msg: 'user not found', success: false });
    return;
  }

  if (!newPassword) {
    res.status(400).json({ msg: 'New password is required', success: false });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    console.log(`Password update successful for user ID: ${id}`);
    res.json({ msg: 'Password updated successfully', success: true });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ msg: 'Internal server error', success: false });
  }
});

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log('Request received for password reset for email:', email);

  const user = await User.findOne({ email });

  if (!user) {
    console.log('User not found for email:', email);
    res.status(404).json({ msg: 'User not found', success: false });
    return;
  }

  const resetToken = generateResetToken();
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log('Generated reset token:', resetToken);

  user.passwordResetToken = hashedResetToken;
  const expirationTime = new Date(Date.now() + 30 * 60 * 1000);
  user.passwordResetExpires = expirationTime;

  await user.save();
  console.log('Password reset token and expiration time saved to user:', user);

  const resetUrl = `
  <p>Dear User,</p>
  <p>We have received a request to reset your password for your account. To proceed with the password reset, please click on the link below:</p>
  <p><a href='http://localhost:5000/api/user/request-password-reset/${hashedResetToken}' target='_blank'>Reset Password</a></p>
  <p>Please note that this link will expire in 30 minutes for security reasons.</p>
  <p>If you did not request this password reset, you can safely ignore this email. Your account remains secure.</p>
  <p>Thank you,</p>
  <p>Oga Manuel 💯</p>
  `;
  console.log('Reset URL:', resetUrl);

  const data = {
    to: email,
    subject: 'Password Reset Request',
    html: resetUrl,
  };
  // @ts-ignore
  sendEmail(data);
  console.log('Email sent for password reset request.');

  res.status(200).json({ msg: 'Reset token sent to email', success: true, token: hashedResetToken });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;
  const { token } = req.params;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    console.log('User not found or token expired.');
    throw new Error('Token expired, try again later');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    console.log('Password updated successfully.');

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    console.log('User document updated.');
    res.status(200).json({ msg: 'Password Reset Successfully', success: true });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ msg: 'Internal server error', success: false });
  }
});
