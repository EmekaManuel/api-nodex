import { Document, Schema, model } from 'mongoose';

interface Blog extends Document {
  title: string;
  description: string;
  category: string;
  numViews?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  image?: string;
  author?: string;
  likes?: Array<string | Schema.Types.ObjectId>;
  disLikes?: Array<string | Schema.Types.ObjectId>;
}

const blogSchema = new Schema<Blog>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default:
        'https://www.shutterstock.com/shutterstock/photos/1029506242/display_1500/stock-photo-blogging-blog-concepts-ideas-with-white-worktable-1029506242.jpg',
    },
    author: {
      type: String,
      default: 'Admin',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    disLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  },
);

export default model<Blog>('Blog', blogSchema);
