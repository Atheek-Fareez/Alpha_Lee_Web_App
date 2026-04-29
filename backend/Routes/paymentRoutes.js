import express from 'express';
import { submitPayment, getPendingPayments, approvePayment, rejectPayment, getUserApprovedPayments } from '../Controllers/paymentController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / User routes
router.post('/', protect, submitPayment);
router.get('/my-payments', protect, getUserApprovedPayments);

// Admin routes
router.get('/pending', protect, isAdmin, getPendingPayments);
router.put('/:id/approve', protect, isAdmin, approvePayment);
router.patch('/:id/reject', protect, isAdmin, rejectPayment);

export default router;
