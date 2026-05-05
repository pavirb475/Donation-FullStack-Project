import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donation-platform')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
