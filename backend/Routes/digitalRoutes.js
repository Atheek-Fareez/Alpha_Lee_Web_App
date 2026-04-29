import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { 
    getDigitalPrograms, 
    getDigitalProgramById,
    createDigitalProgram, 
    updateDigitalProgram, 
    deleteDigitalProgram 
} from "../Controllers/digitalController.js";

const router = express.Router();

// Public Routes
router.route('/').get(getDigitalPrograms);
router.route('/:id').get(getDigitalProgramById);

// Protected Admin Routes
router.route('/')
    .post(protect, isAdmin, createDigitalProgram);

router.route('/:id')
    .put(protect, isAdmin, updateDigitalProgram)
    .delete(protect, isAdmin, deleteDigitalProgram);

export default router;
