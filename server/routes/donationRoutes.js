import express from 'express';
import { createOrder, verifyDonation, getMyDonations, getAllDonations } from '../controllers/donationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyDonation);
router.get('/me', protect, getMyDonations);
router.get('/', protect, admin, getAllDonations);

export default router;
