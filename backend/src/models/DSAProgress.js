import mongoose from 'mongoose';

const dsaProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    weeklyGrowth: [
      {
        week: { type: String },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
        recordedAt: { type: Date, default: Date.now },
      },
    ],
    monthlyGrowth: [
      {
        month: { type: String },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
        recordedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const DSAProgress = mongoose.model('DSAProgress', dsaProgressSchema);
export default DSAProgress;
