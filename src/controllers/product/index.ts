import asyncHandler from 'express-async-handler';
import Product from '../../models/productModel';
import slugify from 'slugify';
import { Request, Response } from 'express';

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (req.body?.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json({ msg: 'new product created', newProduct });
  } catch (error) {
    throw new Error('error creating product');
  }
});

export const findProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json({ msg: ' product found', findProduct });
  } catch (error) {
    throw new Error('error finding product');
  }
});

export const getAllProduct = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.query);
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log(JSON.parse(queryStr));

    const query = Product.find(JSON.parse(queryStr));
    const product = await query;

    res.json(product);
  } catch (error: any) {
    throw new Error(error);
  }
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { title } = req.body;
    if (title) {
      req.body.slug = slugify(title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: ' products updated', updatedProduct });
  } catch (error: any) {
    throw new Error(error);
    res.status(500).json({ msg: 'Error updating product' });
  }
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: ' products deleted', deletedProduct });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const deleteAllProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const deletedAllProducts = await Product.deleteMany();
    res.json({ msg: 'all products deleted', deletedAllProducts });
  } catch (error: any) {
    throw new Error(error);
  }
});