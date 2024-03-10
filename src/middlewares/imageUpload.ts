import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';

export const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

export const multerFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('unsupported files are not allowed.'), false);
  }
};

export const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

export const productImgResize = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) return next();

  await Promise.all(
    (req.files as Express.Multer.File[]).map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
    }),
  );
  next();
};

export const blogImgResize = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) return next();

  await Promise.all(
    (req.files as Express.Multer.File[]).map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
    }),
  );
  next();
};
