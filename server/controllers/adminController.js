import User from '../models/User.js';
import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import VolunteerApplication from '../models/VolunteerApplication.js';

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalVolunteers = await VolunteerApplication.countDocuments();
    
    // Also get sum of all donations for financial stats
    const donations = await Donation.find({ status: 'success' });
    const totalRevenue = donations.reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      totalUsers,
      totalCampaigns,
      totalDonations,
      totalVolunteers,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Exclude passwords
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
