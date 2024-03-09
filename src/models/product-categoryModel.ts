import mongoose, { Schema, Document } from 'mongoose';

interface Category extends Document {
  title: string;
}

// Define schema for Category model
const categorySchema: Schema<Category> = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Export the model
export default mongoose.model<Category>('Category', categorySchema);
