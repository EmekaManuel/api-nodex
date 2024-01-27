import JWt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  id: string;
}

const generateToken = (id: string): string => {
  const tokenPayload: TokenPayload = { id };
  return JWt.sign(tokenPayload, process.env.JWT || '', { expiresIn: '3d' });
};

export default generateToken;
