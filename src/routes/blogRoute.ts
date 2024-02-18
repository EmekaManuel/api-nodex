import express from 'express';
import { createBlog, deleteBlog, dislikeBlog, getAllBlogs, getBlogById, likeBlog } from '../controllers/blog';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create-blog', authMiddleware, isAdmin, createBlog);

router.get('/blog-list', getAllBlogs);
router.get('/:id', getBlogById);

router.put('/edit-blog/:id', authMiddleware, isAdmin, createBlog);

router.put('/like', authMiddleware, likeBlog);
router.put('/dislike', authMiddleware, dislikeBlog);

router.delete('/:id', authMiddleware, isAdmin, deleteBlog);

export default router;
