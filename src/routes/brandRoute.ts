import express from 'express';
import { createBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from '../controllers/brand';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getAllBrands);
router.get('/:id', authMiddleware, getBrandById);

router.post('/create', authMiddleware, isAdmin, createBrand);

router.put('/edit/:id', authMiddleware, isAdmin, updateBrand);

router.delete('/delete/:id', authMiddleware, isAdmin, deleteBrand);

export default router;
