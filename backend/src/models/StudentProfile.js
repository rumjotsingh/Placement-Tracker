import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    technologies: [{ type: String }],
    link: { type: String },
  },
  { _id: true }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    cgpa: { type: Number, min: 0, max: 10 },
    phone: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
    projects: [projectSchema],
    githubUsername: { type: String, trim: true },
    leetcodeUsername: { type: String, trim: true },
    codeforcesUsername: { type: String, trim: true },
    codechefUsername: { type: String, trim: true },
    geeksforgeeksUsername: { type: String, trim: true },
    profileImage: { type: String },
    profileImagePublicId: { type: String },
    portfolioSlug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

studentProfileSchema.index({ skills: 1 });

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;
