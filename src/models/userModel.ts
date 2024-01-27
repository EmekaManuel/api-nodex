import mongoose, { Document, Schema } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  isAdmin: string;
}

const userSchema: Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: String,
    default: 'user',
  },
});

// Export the model
const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
