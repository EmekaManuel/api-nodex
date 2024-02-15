import express from 'express';
import {
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  logout,
  updatePassword,
  resetPassword,
  requestPasswordReset,
} from '../controllers/user';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';
import { handleRefreshToken } from '../config/refreshToken';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.put('/update-password', authMiddleware, updatePassword);

router.get('/all-users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);

router.get('/:id', authMiddleware, isAdmin, getUserById);
router.delete('/:id', deleteUser);

router.put('/reset-password/:token', resetPassword);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);

export default router;
