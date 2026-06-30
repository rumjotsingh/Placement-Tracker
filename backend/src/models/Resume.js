import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    version: { type: Number, required: true },
    fileName: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

resumeSchema.index({ user: 1, version: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
