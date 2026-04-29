import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { 
    getCoachingPackages, 
    createCoachingPackage, 
    updateCoachingPackage, 
    deleteCoachingPackage 
} from "../Controllers/coachingController.js";

const router = express.Router();

// Public Route
router.route('/').get(getCoachingPackages);

// Protected Admin Routes
router.route('/')
    .post(protect, isAdmin, createCoachingPackage);

router.route('/:id')
    .put(protect, isAdmin, updateCoachingPackage)
    .delete(protect, isAdmin, deleteCoachingPackage);

export default router;
