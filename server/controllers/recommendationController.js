import Campaign from '../models/Campaign.js';

export const getRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const campaigns = await Campaign.find({ status: 'active' });

    const scoredCampaigns = campaigns.map(campaign => {
      let score = 0;
      let reason = '';

      // 1. Check Interests (+3)
      if (user.interests && user.interests.some(interest => 
        campaign.category.toLowerCase().includes(interest.toLowerCase()) || 
        interest.toLowerCase().includes(campaign.category.toLowerCase())
      )) {
        score += 3;
        reason = `Matches your interest in ${campaign.category}`;
      }

      // 2. Check Skills (+5 - higher weight as it's more specific)
      if (user.skills && user.skills.length > 0) {
        const matchedSkill = user.skills.find(skill => 
          campaign.title.toLowerCase().includes(skill.toLowerCase()) || 
          campaign.description.toLowerCase().includes(skill.toLowerCase())
        );
        if (matchedSkill) {
          score += 5;
          reason = `u have ${matchedSkill.toLowerCase()} skills as give`; // Using user's requested phrasing
        }
      }

      // 3. Check Location (+1)
      if (user.location && campaign.location && user.location.toLowerCase() === campaign.location.toLowerCase()) {
        score += 1;
        if (!reason) reason = `Based in ${campaign.location}`;
      }

      // Default reason if score is low but we show it
      if (!reason) {
        reason = `Explore ${campaign.category} causes`;
      }

      return { ...campaign.toObject(), matchScore: score, matchReason: reason };
    });

    // Sort by score descending
    // Filter: only show if score > 0 OR if we have very few campaigns
    let recommended = scoredCampaigns
      .sort((a, b) => b.matchScore - a.matchScore);

    // If we have strong matches, only show those (score >= 3)
    const strongMatches = recommended.filter(c => c.matchScore >= 3);
    if (strongMatches.length >= 2) {
      recommended = strongMatches;
    }

    res.json(recommended.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
