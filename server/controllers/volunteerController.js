import VolunteerApplication from '../models/VolunteerApplication.js';
import Campaign from '../models/Campaign.js';

export const applyToVolunteer = async (req, res) => {
  try {
    const { campaignId } = req.body;
    
    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if already applied
    const existingApplication = await VolunteerApplication.findOne({
      userId: req.user._id,
      campaignId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to volunteer for this campaign' });
    }

    const application = new VolunteerApplication({
      userId: req.user._id,
      campaignId
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({ userId: req.user._id }).populate('campaignId', 'title description location');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({}).populate('userId', 'name email').populate('campaignId', 'title');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await VolunteerApplication.findById(req.params.id);

    if (application) {
      application.status = status;
      const updatedApplication = await application.save();
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
