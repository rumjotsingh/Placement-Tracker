import mongoose from 'mongoose';
import { INTERVIEW_MODES, INTERVIEW_RESULTS } from '../constants/index.js';

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    mode: { type: String, enum: INTERVIEW_MODES, required: true },
    meetingLink: { type: String },
    notes: { type: String },
    result: { type: String, enum: INTERVIEW_RESULTS, default: 'Pending' },
    feedback: { type: String },
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

interviewSchema.index({ date: 1 });
interviewSchema.index({ application: 1 });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
