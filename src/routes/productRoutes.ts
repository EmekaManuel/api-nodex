import express from 'express';
import {
  addToWishlist,
  createProduct,
  deleteAllProducts,
  deleteProduct,
  findProduct,
  getAllProduct,
  rating,
  imageUpload,
  updateProduct,
} from '../controllers/product';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';
import { productImgResize, uploadImage } from '../middlewares/imageUpload';
import { userCart } from '../controllers/user';

const router = express.Router();

router.post('/create', authMiddleware, isAdmin, createProduct);
router.post('/cart', authMiddleware, userCart);

router.get('/:id', findProduct);
router.get('/', getAllProduct);

router.put('/upload/:id', authMiddleware, isAdmin, uploadImage.array('images', 10), productImgResize, imageUpload);
router.put('/rating', authMiddleware, rating);
router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/edit/:id', authMiddleware, isAdmin, updateProduct);

router.delete('/delete/:id', authMiddleware, isAdmin, deleteProduct);
router.delete('/delete', authMiddleware, isAdmin, deleteAllProducts);
export default router;
