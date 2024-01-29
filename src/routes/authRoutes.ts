import express from 'express';
import { loginUser, createUser, getAllUsers, getUserById, deleteUser, updateUser, blockUser, unBlockUser } from '../controllers/user';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';
import { handleRefreshToken } from '../config/refreshToken';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

router.get('/refresh', handleRefreshToken);
router.get('/all-users', getAllUsers);
router.get('/:id', authMiddleware, isAdmin, getUserById);

router.delete('/:id', deleteUser);

router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);

export default router;
