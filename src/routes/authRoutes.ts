import express from 'express';
import { loginUser, createUser, getAllUsers } from '../controllers/user';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

router.get('/all-users', getAllUsers);

export default router;
