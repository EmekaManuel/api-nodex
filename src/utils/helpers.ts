import crypto from 'crypto';

export const generateResetToken = () => {
  const buffer = crypto.randomBytes(32);
  const token = buffer.toString('hex');
  return token;
};
