import mongoose from 'mongoose';

const codingStatsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    github: {
      publicRepos: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
      contributions: { type: Number, default: 0 },
    },
    leetcode: {
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      totalSolved: { type: Number, default: 0 },
      contestRating: { type: Number, default: 0 },
    },
    codeforces: {
      rating: { type: Number, default: 0 },
      rank: { type: String, default: '' },
      maxRating: { type: Number, default: 0 },
      maxRank: { type: String, default: '' },
      contests: { type: Number, default: 0 },
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
    },
    codechef: {
      rating: { type: Number, default: 0 },
      maxRating: { type: Number, default: 0 },
      globalRank: { type: Number, default: 0 },
      countryRank: { type: Number, default: 0 },
      stars: { type: String, default: '' },
      name: { type: String, default: '' },
      countryName: { type: String, default: '' },
      problemsSolved: { type: Number, default: 0 },
      contests: { type: Number, default: 0 },
    },
    geeksforgeeks: {
      totalSolved: { type: Number, default: 0 },
      codingScore: { type: Number, default: 0 },
      monthlyScore: { type: Number, default: 0 },
      instituteRank: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      schoolSolved: { type: Number, default: 0 },
      basicSolved: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      maxStreak: { type: Number, default: 0 },
    },
    lastSyncedAt: { type: Date },
  },
  { timestamps: true }
);

const CodingStats = mongoose.model('CodingStats', codingStatsSchema);
export default CodingStats;
