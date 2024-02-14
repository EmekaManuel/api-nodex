import express from 'express';
import {
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  resetPassword,
  requestPasswordRequest,
  blockUser,
  unBlockUser,
  logout,
} from '../controllers/user';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';
import { handleRefreshToken } from '../config/refreshToken';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordRequest);
router.put('/password-reset', authMiddleware, resetPassword);

router.get('/all-users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);

router.get('/:id', authMiddleware, isAdmin, getUserById);
router.delete('/:id', deleteUser);

router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);

export default router;
