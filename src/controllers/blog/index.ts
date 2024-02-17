import { Request, Response } from 'express';
import Blog from '../../models/blogModel';
import asyncHandler from 'express-async-handler';

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
