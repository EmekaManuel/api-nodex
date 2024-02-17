import express from 'express';
// import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';
import { createBlog, deleteBlog, getAllBlogs, getBlogById } from '../controllers/blog';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create-blog', authMiddleware, isAdmin, createBlog);

router.get('/blog-list', getAllBlogs);
router.get('/:id', getBlogById);

router.put('/edit-blog/:id', authMiddleware, isAdmin, createBlog);

router.delete('/:id', authMiddleware, isAdmin, deleteBlog);

export default router;
