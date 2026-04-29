import express from 'express';
import { 
    createFeedback, getFeaturedFeedback,
    getAdminFeedback, moderateFeedback 
} from "../Controllers/feedbackController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public / Protected User
router.get('/featured', getFeaturedFeedback);
router.post('/', protect, createFeedback);

// Secure Admin Logic
router.get('/admin', protect, getAdminFeedback);
router.put('/:id/moderate', protect, moderateFeedback);

export default router;
