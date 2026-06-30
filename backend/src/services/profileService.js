import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinaryService.js';

export const getProfileByUserId = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId }).populate(
    'user',
    'name email rollNumber branch graduationYear role'
  );
  if (!profile) throw new ApiError(404, 'Profile not found');
  return profile;
};

export const getPublicProfile = async (slug) => {
  const profile = await StudentProfile.findOne({ portfolioSlug: slug }).populate(
    'user',
    'name email rollNumber branch graduationYear'
  );
  if (!profile) throw new ApiError(404, 'Portfolio not found');
  return profile;
};

export const updateProfile = async (userId, updates) => {
  const allowed = [
    'cgpa',
    'phone',
    'skills',
    'certifications',
    'projects',
    'githubUsername',
    'leetcodeUsername',
    'codeforcesUsername',
  ];

  const data = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) data[key] = updates[key];
  }

  const profile = await StudentProfile.findOneAndUpdate({ user: userId }, data, {
    new: true,
    runValidators: true,
  }).populate('user', 'name email rollNumber branch graduationYear role');

  if (!profile) throw new ApiError(404, 'Profile not found');
  return profile;
};

export const uploadProfileImage = async (userId, file) => {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile) throw new ApiError(404, 'Profile not found');

  if (profile.profileImagePublicId) {
    await deleteFromCloudinary(profile.profileImagePublicId);
  }

  const result = await uploadToCloudinary(file.buffer, 'profiles', 'image');
  profile.profileImage = result.secure_url;
  profile.profileImagePublicId = result.public_id;
  await profile.save();

  return profile;
};

export const updateUserBasicInfo = async (userId, updates) => {
  const allowed = ['name', 'branch', 'graduationYear'];
  const data = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) data[key] = updates[key];
  }

  const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};
