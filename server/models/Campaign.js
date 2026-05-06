import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  image: { type: String },
  campaignType: { type: String, enum: ['donation', 'volunteer', 'combined'], default: 'combined' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
