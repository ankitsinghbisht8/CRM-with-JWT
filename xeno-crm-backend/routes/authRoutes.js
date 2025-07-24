import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// Legacy route for compatibility
router.get('/me', verifyToken, getProfile);

export default router; 