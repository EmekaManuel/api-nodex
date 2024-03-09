import express from 'express';
import { createCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getAllCategories);
router.get('/:id', authMiddleware, getCategoryById);

router.post('/create', authMiddleware, isAdmin, createCategory);

router.put('/edit/:id', authMiddleware, isAdmin, updateCategory);

router.delete('/delete', authMiddleware, isAdmin, createCategory);

export default router;
