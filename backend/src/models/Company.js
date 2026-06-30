import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    logo: { type: String },
    logoPublicId: { type: String },
    industry: { type: String, trim: true },
    description: { type: String },
    location: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

companySchema.index({ name: 'text', industry: 'text', location: 'text' });

const Company = mongoose.model('Company', companySchema);
export default Company;
