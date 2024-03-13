import asyncHandler from 'express-async-handler';
import Product from '../../models/productModel';
import slugify from 'slugify';
import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { validateMongodbId } from '../../utils/validatemongodbId';
import UserModel from '../../models/userModel';
import { cloudinaryUploadImage } from '../../utils/cloudinary';
// import { cloudinaryUploadImage } from '../../utils/cloudinary';

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
    let query = Product.find(JSON.parse(queryStr));

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
      const productCount = await Product.countDocuments();
      console.log(productCount);
      if (skip >= productCount) throw new Error('This page doesn not exist');
    }

    const product = await query;
    res.status(200).json(product);
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

export const addToWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  validateMongodbId(id);
  const { productId } = req.body;
  validateMongodbId(productId);

  try {
    const user = await UserModel.findById(id);
    const isProductinWishlist = user?.wishlist.find((id) => id.toString() === productId);
    if (isProductinWishlist) {
      let user = await UserModel.findByIdAndUpdate(id, { $pull: { wishlist: productId } }, { new: true });
      res.json(user);
    } else {
      let user = await UserModel.findByIdAndUpdate(id, { $push: { wishlist: productId } }, { new: true });
      res.json(user);
    }
  } catch (error) {
    throw new Error('error adding brand');
  }
});

export const rating = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  validateMongodbId(id);
  const { star, productId, comment } = req.body;

  const product = await Product.findById(productId);
  const isProductAreadyRated = product?.ratings.find((userId) => userId.postedBy.toString() === id.toString());
  try {
    if (isProductAreadyRated) {
      // @ts-ignore
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: isProductAreadyRated },
        },
        { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment } },
        // @ts-ignore
        { new: true },
      );
    } else {
      // @ts-ignore
      const rateProduct = await Product.findByIdAndUpdate(
        productId,
        { $push: { ratings: { star: star, postedBy: id, comment: comment } } },
        { new: true },
      );
    }

    const getAllRatings = await Product.findById(productId);
    let totalRating = getAllRatings?.ratings.length || 0;
    let ratingSum = getAllRatings?.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0) || 0;
    let actualRating = totalRating > 0 ? Math.round(ratingSum / totalRating) : 0;

    let ratedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      { new: true },
    );
    res.json(ratedProduct);
  } catch (error) {
    throw new Error('error rating product');
  }
});

export const imageUpload = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    // @ts-ignore
    const uploader = (path: any) => cloudinaryUploadImage(path, 'images');
    const urls = [];
    const files = req.files;

    // @ts-ignore
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
    }

    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      },
    );

    res.status(200).json({ message: 'found product', findProduct });
  } catch (error) {
    console.error('Error uploading image', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
