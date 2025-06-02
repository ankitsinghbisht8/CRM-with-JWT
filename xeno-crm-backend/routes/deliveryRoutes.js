import express from 'express';
import { handleDeliveryReceipt } from '../controllers/deliveryController.js';

const router = express.Router();

// This route is called by the dummy vendor API, so no auth middleware
router.post('/', handleDeliveryReceipt);

export default router;