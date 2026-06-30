import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as profileService from '../services/profileService.js';

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfileByUserId(req.user._id);
  res.json(new ApiResponse(200, profile, 'Profile fetched'));
});

export const getPublicPortfolio = asyncHandler(async (req, res) => {
  const profile = await profileService.getPublicProfile(req.params.slug);
  res.json(new ApiResponse(200, profile, 'Portfolio fetched'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateProfile(req.user._id, req.body);
  res.json(new ApiResponse(200, profile, 'Profile updated'));
});

export const updateBasicInfo = asyncHandler(async (req, res) => {
  const user = await profileService.updateUserBasicInfo(req.user._id, req.body);
  res.json(new ApiResponse(200, user, 'User info updated'));
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, 'Profile image is required'));
  }
  const profile = await profileService.uploadProfileImage(req.user._id, req.file);
  res.json(new ApiResponse(200, profile, 'Profile image uploaded'));
});
