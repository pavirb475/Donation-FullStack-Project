import express from 'express';
import { getStats, getAllUsers } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only admin role can access these
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);

export default router;
