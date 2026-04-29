import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { 
    getLeads, 
    deleteLead, 
    createProgram, 
    deleteProgram,
    getPrograms,
    updateProgram
} from "../Controllers/adminController.js";

const router = express.Router();

// Apply protect and isAdmin middlewares to all routes in this file
router.use(protect, isAdmin);

router.route('/leads')
    .get(getLeads);

router.route('/leads/:id')
    .delete(deleteLead);

router.route('/programs')
    .get(getPrograms)
    .post(createProgram);

router.route('/programs/:id')
    .put(updateProgram)
    .delete(deleteProgram);

export default router;
