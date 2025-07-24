import express from 'express';
import {
  previewSegment,
  getSegmentCustomers
} from '../controllers/segmentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Routes
router.post('/preview', previewSegment);
router.post('/customers', getSegmentCustomers);

export default router;