import express from 'express';
import { createTicket, getUserTickets, getAllTickets, updateTicketStatus, deleteTicket, adminUpdateTicket } from '../Controllers/ticketController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/', protect, getUserTickets);
router.get('/admin', protect, isAdmin, getAllTickets);
router.put('/:id/status', protect, updateTicketStatus);
router.put('/:id/admin-edit', protect, isAdmin, adminUpdateTicket);
router.delete('/:id', protect, isAdmin, deleteTicket);

export default router;
