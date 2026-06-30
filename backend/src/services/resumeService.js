import Resume from '../models/Resume.js';
import ApiError from '../utils/ApiError.js';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinaryService.js';

export const uploadResume = async (userId, file) => {
  const latest = await Resume.findOne({ user: userId }).sort({ version: -1 });
  const version = latest ? latest.version + 1 : 1;

  await Resume.updateMany({ user: userId }, { isActive: false });

  const result = await uploadToCloudinary(file.buffer, 'resumes', 'raw');

  const resume = await Resume.create({
    user: userId,
    url: result.secure_url,
    publicId: result.public_id,
    version,
    fileName: file.originalname,
    isActive: true,
  });

  return resume;
};

export const getResumes = async (userId) =>
  Resume.find({ user: userId }).sort({ version: -1 });

export const getActiveResume = async (userId) => {
  const resume = await Resume.findOne({ user: userId, isActive: true });
  if (!resume) throw new ApiError(404, 'No active resume found');
  return resume;
};

export const deleteResumeVersion = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) throw new ApiError(404, 'Resume not found');

  await deleteFromCloudinary(resume.publicId, 'raw');
  await resume.deleteOne();

  if (resume.isActive) {
    const latest = await Resume.findOne({ user: userId }).sort({ version: -1 });
    if (latest) {
      latest.isActive = true;
      await latest.save();
    }
  }

  return { message: 'Resume deleted' };
};
