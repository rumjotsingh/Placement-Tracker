import CodingStats from '../models/CodingStats.js';
import DSAProgress from '../models/DSAProgress.js';
import StudentProfile from '../models/StudentProfile.js';
import ApiError from '../utils/ApiError.js';
import {
  fetchGitHubStats,
  fetchLeetCodeStats,
  fetchCodeforcesStats,
} from './codingService.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES } from '../constants/index.js';

const getOrCreateStats = async (userId) => {
  let stats = await CodingStats.findOne({ user: userId });
  if (!stats) stats = await CodingStats.create({ user: userId });
  return stats;
};

const syncDSAFromLeetCode = async (userId, leetcode) => {
  let dsa = await DSAProgress.findOne({ user: userId });
  if (!dsa) dsa = await DSAProgress.create({ user: userId });

  const prevEasy = dsa.easy;
  const prevMedium = dsa.medium;
  const prevHard = dsa.hard;

  dsa.easy = leetcode.easySolved;
  dsa.medium = leetcode.mediumSolved;
  dsa.hard = leetcode.hardSolved;

  const now = new Date();
  const weekKey = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;
  const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;

  dsa.weeklyGrowth.push({
    week: weekKey,
    easy: leetcode.easySolved - prevEasy,
    medium: leetcode.mediumSolved - prevMedium,
    hard: leetcode.hardSolved - prevHard,
    recordedAt: now,
  });

  dsa.monthlyGrowth.push({
    month: monthKey,
    easy: leetcode.easySolved,
    medium: leetcode.mediumSolved,
    hard: leetcode.hardSolved,
    recordedAt: now,
  });

  if (dsa.weeklyGrowth.length > 52) dsa.weeklyGrowth = dsa.weeklyGrowth.slice(-52);
  if (dsa.monthlyGrowth.length > 24) dsa.monthlyGrowth = dsa.monthlyGrowth.slice(-24);

  await dsa.save();
  return dsa;
};

export const syncGitHub = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile?.githubUsername) throw new ApiError(400, 'GitHub username not set in profile');

  const github = await fetchGitHubStats(profile.githubUsername);
  const stats = await getOrCreateStats(userId);
  stats.github = github;
  stats.lastSyncedAt = new Date();
  await stats.save();

  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.PROFILE_SYNC_COMPLETED,
    title: 'GitHub Sync Complete',
    message: 'Your GitHub profile has been synced',
  });

  return stats;
};

export const syncLeetCode = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile?.leetcodeUsername) throw new ApiError(400, 'LeetCode username not set in profile');

  const leetcode = await fetchLeetCodeStats(profile.leetcodeUsername);
  const stats = await getOrCreateStats(userId);
  stats.leetcode = leetcode;
  stats.lastSyncedAt = new Date();
  await stats.save();

  await syncDSAFromLeetCode(userId, leetcode);

  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.PROFILE_SYNC_COMPLETED,
    title: 'LeetCode Sync Complete',
    message: 'Your LeetCode profile has been synced',
  });

  return stats;
};

export const syncCodeforces = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile?.codeforcesUsername) {
    throw new ApiError(400, 'Codeforces username not set in profile');
  }

  const codeforces = await fetchCodeforcesStats(profile.codeforcesUsername);
  const stats = await getOrCreateStats(userId);
  stats.codeforces = codeforces;
  stats.lastSyncedAt = new Date();
  await stats.save();

  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.PROFILE_SYNC_COMPLETED,
    title: 'Codeforces Sync Complete',
    message: 'Your Codeforces profile has been synced',
  });

  return stats;
};

export const syncAllProfiles = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile) throw new ApiError(404, 'Profile not found');

  const stats = await getOrCreateStats(userId);
  const errors = [];

  if (profile.githubUsername) {
    try {
      stats.github = await fetchGitHubStats(profile.githubUsername);
    } catch (e) {
      errors.push({ platform: 'github', message: e.message });
    }
  }

  if (profile.leetcodeUsername) {
    try {
      const leetcode = await fetchLeetCodeStats(profile.leetcodeUsername);
      stats.leetcode = leetcode;
      await syncDSAFromLeetCode(userId, leetcode);
    } catch (e) {
      errors.push({ platform: 'leetcode', message: e.message });
    }
  }

  if (profile.codeforcesUsername) {
    try {
      stats.codeforces = await fetchCodeforcesStats(profile.codeforcesUsername);
    } catch (e) {
      errors.push({ platform: 'codeforces', message: e.message });
    }
  }

  stats.lastSyncedAt = new Date();
  await stats.save();

  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.PROFILE_SYNC_COMPLETED,
    title: 'Profile Sync Complete',
    message: 'All coding profiles have been synced',
  });

  return { stats, errors };
};

export const getCodingStats = async (userId) => {
  const stats = await CodingStats.findOne({ user: userId });
  if (!stats) return getOrCreateStats(userId);
  return stats;
};

export const getDSAProgress = async (userId) => {
  let dsa = await DSAProgress.findOne({ user: userId });
  if (!dsa) dsa = await DSAProgress.create({ user: userId });
  return dsa;
};

export const updateDSAProgress = async (userId, data) => {
  let dsa = await DSAProgress.findOne({ user: userId });
  if (!dsa) dsa = await DSAProgress.create({ user: userId });

  if (data.easy !== undefined) dsa.easy = data.easy;
  if (data.medium !== undefined) dsa.medium = data.medium;
  if (data.hard !== undefined) dsa.hard = data.hard;

  await dsa.save();
  return dsa;
};
