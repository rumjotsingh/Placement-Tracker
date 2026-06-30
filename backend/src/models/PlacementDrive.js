import mongoose from 'mongoose';
import { DRIVE_STATUS, JOB_TYPES } from '../constants/index.js';

const placementDriveSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobRole: { type: String, required: true, trim: true },
    package: { type: String, required: true, trim: true },
    jobType: { type: String, enum: JOB_TYPES, default: 'Full-Time' },
    location: { type: String, trim: true },
    eligibilityCriteria: {
      minCgpa: { type: Number, default: 0 },
      eligibleBranches: [{ type: String, trim: true }],
    },
    description: { type: String },
    deadline: { type: Date, required: true },
    driveDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(DRIVE_STATUS), default: DRIVE_STATUS.OPEN },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

placementDriveSchema.index({ status: 1, deadline: 1 });
placementDriveSchema.index({ jobRole: 'text', location: 'text' });

const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);
export default PlacementDrive;
