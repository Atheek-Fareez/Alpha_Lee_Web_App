import express from 'express';
import { applyForTeam, getApplications, deleteApplication } from '../Controllers/recruitmentController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for candidates submitting logic
router.post('/apply', applyForTeam);

// Secured routes for Admin isolation
router.get('/applications', protect, isAdmin, getApplications);
router.delete('/applications/:id', protect, isAdmin, deleteApplication);

export default router;
