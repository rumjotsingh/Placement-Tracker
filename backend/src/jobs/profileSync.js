import cron from 'node-cron';
import StudentProfile from '../models/StudentProfile.js';
import { syncAllProfiles } from '../services/codingSyncService.js';

const syncAllStudentProfiles = async () => {
  console.log('[CRON] Starting weekly coding profile sync...');

  const profiles = await StudentProfile.find({
    $or: [
      { githubUsername: { $exists: true, $ne: '' } },
      { leetcodeUsername: { $exists: true, $ne: '' } },
      { codeforcesUsername: { $exists: true, $ne: '' } },
    ],
  }).select('user');

  for (const profile of profiles) {
    try {
      await syncAllProfiles(profile.user);
    } catch (error) {
      console.error(`[CRON] Sync failed for user ${profile.user}:`, error.message);
    }
  }

  console.log('[CRON] Weekly coding profile sync completed');
};

export const startCronJobs = () => {
  cron.schedule('0 2 * * 0', syncAllStudentProfiles);
  console.log('Cron jobs scheduled');
};
