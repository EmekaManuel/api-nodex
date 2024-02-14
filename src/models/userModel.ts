import mongoose, { Document, Schema, Types } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  cart: string[];
  address: Types.ObjectId[];
  wishlist: Types.ObjectId[];
  isBlocked: boolean;
  refreshToken: string;
  passwordChangedAt: Date;
  passwordResetExpires: Date;
  passwordResetToken: string;
}

const userSchema: Schema<User> = new mongoose.Schema(
  {
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
    role: {
      type: String,
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    cart: {
      type: [String], // Use StringConstructor to define an array of strings
      default: [],
    },
    address: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    passwordChangedAt: {
      type: Date,
    },
    passwordResetExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Export the model
const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
