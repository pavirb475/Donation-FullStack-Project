import mongoose from 'mongoose';

const volunteerApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  status: { type: String, enum: ['applied', 'approved', 'rejected'], default: 'applied' }
}, { timestamps: true });

export default mongoose.model('VolunteerApplication', volunteerApplicationSchema);
