import asyncHandler from 'express-async-handler';
import BlogCategory from '../../models/blog-categoryModel';
import { Request, Response } from 'express';

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newCategory = await BlogCategory.create(req.body);
    res.status(200).json({ message: 'category created', newCategory });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'category updated', updatedCategory });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  try {
    const allCategories = await BlogCategory.find();
    res.status(200).json({ message: 'all categories', allCategories });
  } catch (error: any) {
    throw new Error(error);
  }
});
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const specificCategory = await BlogCategory.findById(id);
    res.status(200).json({ message: 'specific category', specificCategory });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedCategory = await BlogCategory.findByIdAndDelete(id);
    res.status(200).json({ message: 'category deleted', deletedCategory });
  } catch (error: any) {
    throw new Error(error);
  }
});
