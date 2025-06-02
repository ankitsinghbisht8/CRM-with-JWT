import express from 'express';
import {
  verifyGoogleToken,
  getCurrentUser
} from '../controllers/authController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/google', verifyGoogleToken);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

export default router;