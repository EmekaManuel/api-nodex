import express from 'express';
import {
  createProduct,
  deleteAllProducts,
  deleteProduct,
  findProduct,
  getAllProduct,
  updateProduct,
} from '../controllers/product';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', authMiddleware, isAdmin, createProduct);

router.get('/:id', findProduct);
router.get('/', getAllProduct);

router.put('/edit/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteProduct);
router.delete('/delete', authMiddleware, isAdmin, deleteAllProducts);
export default router;
