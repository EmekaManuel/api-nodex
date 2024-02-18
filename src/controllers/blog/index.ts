import { Request, Response } from 'express';
import Blog from '../../models/blogModel';
import asyncHandler from 'express-async-handler';
import { validateMongodbId } from '../../utils/validatemongodbId';
import { AuthRequest } from '../../middlewares/authMiddleware';

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newBlog = await Blog.create(req.body);

    res.status(200).json(newBlog);
  } catch (error) {
    throw new Error();
  }
});

export const editBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json(updatedBlog);
  } catch (error) {
    throw new Error();
  }
});

export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const allBlogs = await Blog.find();

    res.status(200).json(allBlogs);
  } catch (error) {
    throw new Error();
  }
});

export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return;
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true },
    );

    res.status(200).json(updatedBlog);
  } catch (error) {
    throw new Error();
  }
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return;
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.status(200).json(deletedBlog);
  } catch (error) {
    throw new Error();
  }
});

export const dislikeBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  const blog = await Blog.findById(blogId);
  const loggedInUserId = req?.user?.id;

  const isDisliked = blog?.isDisliked;

  const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loggedInUserId?.toString());

  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { likes: loggedInUserId }, isLiked: false },
      { new: true },
    );
    res.status(200).json({ message: 'This blog has been unliked successfully', blog });
  }

  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { disLikes: loggedInUserId }, isDisliked: false },
      { new: true },
    );
    res.status(200).json({ message: 'This blog has been un-disliked successfully', blog });
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { disLikes: loggedInUserId }, isDisliked: true },
      { new: true },
    );
    res.status(200).json({ message: 'This blog has been disliked successfully', blog });
  }
});

export const likeBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  const blog = await Blog.findById(blogId);
  const loggedInUserId = req?.user?.id;

  const isLiked = blog?.isLiked;

  const alreadyDisliked = blog?.disLikes?.find((userId) => userId?.toString() === loggedInUserId?.toString());

  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { disLikes: loggedInUserId }, isDisliked: false },
      { new: true },
    );
    res.status(200).json({ message: 'This blog has been liked successfully', blog });
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { likes: loggedInUserId }, isLiked: false },
      { new: true },
    );
    res.status(200).json({ message: 'This blog has been unliked successfully', blog });
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { likes: loggedInUserId }, isLiked: true },
      { new: true },
    );
    res.status(200).json({ message: 'This blog has been liked successfully', blog });
  }
});
