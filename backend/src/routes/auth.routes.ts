import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new customer
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Log in a customer
router.post('/login', login);

export default router;