import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export const createOrder = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;
    
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Mock Stripe if no real key provided
    if (process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder' || !process.env.STRIPE_SECRET_KEY) {
      return res.json({
        clientSecret: 'mock_client_secret_for_testing',
        orderId: 'mock_order_' + Date.now()
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        campaignId: campaignId,
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyDonation = async (req, res) => {
  try {
    const { paymentIntentId, campaignId, amount } = req.body;

    // In a real app, you would verify the payment intent status with Stripe here
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    // if (paymentIntent.status !== 'succeeded') throw new Error('Payment not successful');

    const donation = new Donation({
      userId: req.user._id,
      campaignId,
      amount,
      orderId: paymentIntentId,
      status: 'success'
    });

    await donation.save();

    // Update campaign raised amount
    const campaign = await Campaign.findById(campaignId);
    if (campaign) {
      campaign.raisedAmount += amount;
      await campaign.save();
    }

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id }).populate('campaignId', 'title');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({}).populate('userId', 'name email').populate('campaignId', 'title');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
