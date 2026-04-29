import express from 'express';
import { 
    getPackages, createPackage, updatePackage, deletePackage,
    createBooking, getBookings, markContacted 
} from "../Controllers/consultationController.js";

const router = express.Router();

// Packager Endpoints
router.get('/packages', getPackages);
router.post('/packages', createPackage);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

// Booking Endpoints
router.post('/bookings', createBooking);
router.get('/bookings', getBookings);
router.put('/bookings/:id/contacted', markContacted);

export default router;
