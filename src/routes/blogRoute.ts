import express from 'express';
// import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';
import { createBlog } from '../controllers/blog';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create-blog', authMiddleware, isAdmin, createBlog);
router.put('/edit-blog/:id', authMiddleware, isAdmin, createBlog);

export default router;
