import express from 'express';
import { registerUser, loginUser } from '../controller/authController.js';
import validateUser from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateUser, registerUser);
router.post('/login', loginUser);

export default router;