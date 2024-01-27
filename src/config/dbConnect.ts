import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.Mongo_Uri;

export const dbConnect = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MongoDB connection string is undefined');
    }
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('Database error:', error.message);
  }
};
