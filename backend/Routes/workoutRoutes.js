import express from 'express';
import { logSets, getLastLifts, getWorkoutAnalytics } from "../Controllers/workoutController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, logSets);
router.get('/:programId', protect, getLastLifts);
router.get('/analytics/:exerciseId', protect, getWorkoutAnalytics);

export default router;
