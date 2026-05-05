import express from 'express';
import { applyToVolunteer, getMyApplications, getAllApplications, updateApplicationStatus } from '../controllers/volunteerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, applyToVolunteer)
  .get(protect, admin, getAllApplications);

router.get('/me', protect, getMyApplications);

router.route('/:id')
  .put(protect, admin, updateApplicationStatus);

export default router;
