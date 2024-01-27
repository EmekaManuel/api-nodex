import express from 'express';
import { loginUser, createUser, getAllUsers, getUserById, deleteUser, updateUser } from '../controllers/user';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

router.get('/all-users', getAllUsers);
router.get('/:id', getUserById);

router.delete('/:id', deleteUser);
router.delete('/:id', updateUser);

export default router;
