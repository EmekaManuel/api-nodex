import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';

import { Request, Response } from 'express';
interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

dotenv.config();
// @ts-ignore
export const sendEmail = asyncHandler(async (data: EmailData, req: Request, res: Response) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PW,
    },
  });

  const info = await transporter.sendMail({
    from: '"Hey 👻" <aniB@example.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});
