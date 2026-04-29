import express from 'express';
import { registerUser, loginUser, claimProgram, getLocker, getUserProfile, updateProfile, deleteAccount, changePassword } from "../Controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/claim', claimProgram);
router.get('/locker', protect, getLocker);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteAccount);
router.put('/change-password', protect, changePassword);

export default router;