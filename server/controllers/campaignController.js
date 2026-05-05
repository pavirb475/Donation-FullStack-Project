import Campaign from '../models/Campaign.js';

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).populate('createdBy', 'name email');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('createdBy', 'name email');
    if (campaign) {
      res.json(campaign);
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const { title, description, category, location, goalAmount, image } = req.body;
    const campaign = new Campaign({
      title,
      description,
      category,
      location,
      goalAmount,
      image,
      createdBy: req.user._id
    });
    const createdCampaign = await campaign.save();
    res.status(201).json(createdCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { title, description, category, location, goalAmount, image, status } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (campaign) {
      campaign.title = title || campaign.title;
      campaign.description = description || campaign.description;
      campaign.category = category || campaign.category;
      campaign.location = location || campaign.location;
      campaign.goalAmount = goalAmount || campaign.goalAmount;
      campaign.image = image || campaign.image;
      campaign.status = status || campaign.status;

      const updatedCampaign = await campaign.save();
      res.json(updatedCampaign);
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (campaign) {
      await campaign.deleteOne();
      res.json({ message: 'Campaign removed' });
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
