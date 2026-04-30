import express from 'express';
import { getExercises, createExercise, deleteExercise } from '../Controllers/exerciseController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, isAdmin, getExercises)
    .post(protect, isAdmin, createExercise);

router.route('/:id')
    .delete(protect, isAdmin, deleteExercise);

export default router;
