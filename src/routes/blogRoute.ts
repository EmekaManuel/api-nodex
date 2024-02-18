import express from 'express';
import { createBlog, deleteBlog, dislikeBlog, editBlog, getAllBlogs, getBlogById, likeBlog } from '../controllers/blog';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/blog-list', getAllBlogs);
router.get('/:id', getBlogById);

router.post('/create-blog', authMiddleware, isAdmin, createBlog);

router.put('/like', authMiddleware, likeBlog);
router.put('/dislike', authMiddleware, dislikeBlog);
router.put('/edit-blog/:id', authMiddleware, isAdmin, editBlog);

router.delete('/:id', authMiddleware, isAdmin, deleteBlog);

export default router;
