import mongoose, { Document, Schema, Types } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  isAdmin: string;
  cart: string[];
  address: Types.ObjectId[];
  wishlist: Types.ObjectId[];
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
    isAdmin: {
      type: String,
      default: 'user',
    },
    cart: {
      type: [String], // Use StringConstructor to define an array of strings
      default: [],
    },
    address: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  },
);

// Export the model
const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
