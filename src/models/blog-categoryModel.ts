import mongoose, { Schema, Document } from 'mongoose';

interface BlogCategory extends Document {
  title: string;
}

// Define schema for BlogCategory model
const blogCategorySchema: Schema<BlogCategory> = new Schema(
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
export default mongoose.model<BlogCategory>('BlogCategory', blogCategorySchema);
