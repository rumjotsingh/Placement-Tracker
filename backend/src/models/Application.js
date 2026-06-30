import mongoose from 'mongoose';
import { APPLICATION_STATUS } from '../constants/index.js';

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    drive: { type: mongoose.Schema.Types.ObjectId, ref: 'PlacementDrive', required: true },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
    },
    withdrawn: { type: Boolean, default: false },
    withdrawnAt: { type: Date },
    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, drive: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ drive: 1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
