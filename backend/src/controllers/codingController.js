import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as codingSyncService from '../services/codingSyncService.js';

export const syncGitHub = asyncHandler(async (req, res) => {
  const stats = await codingSyncService.syncGitHub(req.user._id);
  res.json(new ApiResponse(200, stats, 'GitHub synced'));
});

export const syncLeetCode = asyncHandler(async (req, res) => {
  const stats = await codingSyncService.syncLeetCode(req.user._id);
  res.json(new ApiResponse(200, stats, 'LeetCode synced'));
});

export const syncCodeforces = asyncHandler(async (req, res) => {
  const stats = await codingSyncService.syncCodeforces(req.user._id);
  res.json(new ApiResponse(200, stats, 'Codeforces synced'));
});

export const syncAll = asyncHandler(async (req, res) => {
  const result = await codingSyncService.syncAllProfiles(req.user._id);
  res.json(new ApiResponse(200, result, 'All profiles synced'));
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await codingSyncService.getCodingStats(req.user._id);
  res.json(new ApiResponse(200, stats, 'Coding stats fetched'));
});

export const getDSAProgress = asyncHandler(async (req, res) => {
  const dsa = await codingSyncService.getDSAProgress(req.user._id);
  res.json(new ApiResponse(200, dsa, 'DSA progress fetched'));
});

export const updateDSAProgress = asyncHandler(async (req, res) => {
  const dsa = await codingSyncService.updateDSAProgress(req.user._id, req.body);
  res.json(new ApiResponse(200, dsa, 'DSA progress updated'));
});
