import mongoose, { Schema, Document } from 'mongoose';

interface Brand extends Document {
  title: string;
}

// Define schema for Brand model
const BrandSchema: Schema<Brand> = new Schema(
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
export default mongoose.model<Brand>('Brand', BrandSchema);
