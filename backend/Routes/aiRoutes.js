// backend/routes/aiRoutes.js
import express from 'express';
import { getFitnessPrediction, chatWithCoach } from '../Controllers/aiController.js';

const router = express.Router();

// Prediction Endpoint
router.post('/predict-fitness', getFitnessPrediction);

// Conversational Endpoint
router.post('/chat', chatWithCoach);

export default router;