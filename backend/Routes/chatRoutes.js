import express from 'express';
import { getChatHistory, sendMessage, clearChatHistory } from '../Controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getChatHistory);
router.post('/', protect, sendMessage);
router.delete('/', protect, clearChatHistory);

export default router;
