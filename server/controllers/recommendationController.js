import Campaign from '../models/Campaign.js';

export const getRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const campaigns = await Campaign.find({ status: 'active' });

    // AI Recommendation Logic (Rule-based)
    // Inputs: user.skills, user.interests, user.location
    // Campaign: campaign.category, campaign.location

    const scoredCampaigns = campaigns.map(campaign => {
      let score = 0;

      // +2 if interest matches campaign category
      if (user.interests && user.interests.includes(campaign.category)) {
        score += 2;
      }

      // +1 if location matches
      if (user.location && campaign.location && user.location.toLowerCase() === campaign.location.toLowerCase()) {
        score += 1;
      }

      // Note: Volunteering skills match could be added here if campaigns had specific required skills
      // For this implementation, we'll keep it simple with category and location.

      return { ...campaign.toObject(), matchScore: score };
    });

    // Sort by score descending and take top 5
    const recommended = scoredCampaigns
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
