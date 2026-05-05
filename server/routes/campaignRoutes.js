import express from 'express';
import { getCampaigns, getCampaignById, createCampaign, updateCampaign, deleteCampaign } from '../controllers/campaignController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCampaigns)
  .post(protect, admin, createCampaign);

router.route('/:id')
  .get(getCampaignById)
  .put(protect, admin, updateCampaign)
  .delete(protect, admin, deleteCampaign);

export default router;
