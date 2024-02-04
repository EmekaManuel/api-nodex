import mongoose, { Document, Schema, Types } from 'mongoose';

interface Product extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  quantity?: number;
  images?: string[];
  brand: 'Apple' | 'Nokia' | 'Samsung';
  color: 'Black' | 'Brown' | 'Red';
  sold: number;
  ratings: Array<{
    star: number;
    postedBy: Types.ObjectId | string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<Product> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
    },
    brand: {
      type: String,
      enum: ['Apple', 'Nokia', 'Samsung', 'Louis', 'Gucci'],
    },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Red'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const ProductModel = mongoose.model<Product>('Product', productSchema);
export default ProductModel;
