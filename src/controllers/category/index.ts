import asyncHandler from 'express-async-handler';
import Category from '../../models/categoryModel';
import { Request, Response } from 'express';

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json({ message: 'category created', newCategory });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'category updated', updatedCategory });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json({ message: 'all categories', allCategories });
  } catch (error: any) {
    throw new Error(error);
  }
});
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const specificCategory = await Category.findById(id);
    res.status(200).json({ message: 'specific category', specificCategory });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const deletedCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'category deleted', deletedCategory });
  } catch (error: any) {
    throw new Error(error);
  }
});
