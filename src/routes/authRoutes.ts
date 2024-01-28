import express from 'express';
import { loginUser, createUser, getAllUsers, getUserById, deleteUser, updateUser } from '../controllers/user';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

router.get('/all-users', getAllUsers);
router.get('/:id', authMiddleware, getUserById);

router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;
