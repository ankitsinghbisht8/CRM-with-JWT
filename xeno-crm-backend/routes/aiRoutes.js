import express from 'express';
import { generateMessageSuggestions } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Routes
router.post('/', generateMessageSuggestions);

export default router;