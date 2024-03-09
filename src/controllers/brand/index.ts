import asyncHandler from 'express-async-handler';
import Brand from '../../models/brandModel';
import slugify from 'slugify';
import { Request, Response } from 'express';

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (req.body?.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newBrand = await Brand.create(req.body);
    res.json({ msg: 'new brand created', newBrand });
  } catch (error) {
    throw new Error('error creating brand');
  }
});

export const getBrandById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const findBrand = await Brand.findById(id);
    res.json({ msg: 'brand found', findBrand });
  } catch (error) {
    throw new Error('error finding brand');
  }
});

export const getAllBrands = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.query);
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Brand.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // limiting the fields
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // pagination
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;
    console.log(page, skip, limit);

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const brandCount = await Brand.countDocuments();
      console.log(brandCount);
      if (skip >= brandCount) throw new Error('This page doesn not exist');
    }

    const brand = await query;
    res.status(200).json(brand);
  } catch (error: any) {
    throw new Error(error);
  }
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { title } = req.body;
    if (title) {
      req.body.slug = slugify(title);
    }
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBrand) {
      res.status(404).json({ msg: 'Brand not found' });
    }

    res.json({ msg: ' brands updated', updatedBrand });
  } catch (error: any) {
    throw new Error(error);
    res.status(500).json({ msg: 'Error updating brand' });
  }
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      res.status(404).json({ msg: 'Brand not found' });
    }

    res.json({ msg: ' brands deleted', deletedBrand });
  } catch (error: any) {
    throw new Error(error);
  }
});

export const deleteAllBrands = asyncHandler(async (req: Request, res: Response) => {
  try {
    const deletedAllBrands = await Brand.deleteMany();
    res.json({ msg: 'all brands deleted', deletedAllBrands });
  } catch (error: any) {
    throw new Error(error);
  }
});
