import axios from 'axios';
import ApiError from '../utils/ApiError.js';

const normalizeHandle = (raw, platform) => {
  let handle = (raw || '').trim().replace(/^@/, '');
  if (!handle) return handle;

  if (platform === 'codechef') {
    const match = handle.match(/codechef\.com\/users\/([^/?#]+)/i);
    if (match) return decodeURIComponent(match[1]);
  }
  if (platform === 'gfg') {
    const match = handle.match(/geeksforgeeks\.org\/user\/([^/?#]+)/i);
    if (match) return decodeURIComponent(match[1]).replace(/\/$/, '');
  }

  return handle.split('/').filter(Boolean).pop() || handle;
};

const categorizeByRating = (rating) => {
  if (!rating || rating < 1200) return 'easy';
  if (rating < 1800) return 'medium';
  return 'hard';
};

export const fetchGitHubStats = async (username) => {
  if (!username) throw new ApiError(400, 'GitHub username is required');

  try {
    const { data: user } = await axios.get(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github+json' },
      timeout: 10000,
    });

    const { data: repos } = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers: { Accept: 'application/vnd.github+json' }, timeout: 10000 }
    );

    const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    let contributions = 0;
    try {
      const { data: events } = await axios.get(
        `https://api.github.com/users/${username}/events/public?per_page=100`,
        { headers: { Accept: 'application/vnd.github+json' }, timeout: 10000 }
      );
      contributions = events.filter((e) => e.type === 'PushEvent').length;
    } catch {
      contributions = 0;
    }

    return {
      publicRepos: user.public_repos || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      stars,
      contributions,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new ApiError(404, 'GitHub user not found');
    }
    throw new ApiError(502, 'Failed to fetch GitHub data');
  }
};

export const fetchLeetCodeStats = async (username) => {
  if (!username) throw new ApiError(400, 'LeetCode username is required');

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        contestBadge {
          name
        }
      }
      userContestRanking(username: $username) {
        rating
      }
    }
  `;

  try {
    const { data } = await axios.post(
      'https://leetcode.com/graphql',
      { query, variables: { username } },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    const matched = data?.data?.matchedUser;
    if (!matched) throw new ApiError(404, 'LeetCode user not found');

    const submissions = matched.submitStatsGlobal?.acSubmissionNum || [];
    const getCount = (diff) => submissions.find((s) => s.difficulty === diff)?.count || 0;
    const easy = getCount('Easy');
    const medium = getCount('Medium');
    const hard = getCount('Hard');
    const total = getCount('All') || easy + medium + hard;

    return {
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      totalSolved: total,
      contestRating: data?.data?.userContestRanking?.rating || 0,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, 'Failed to fetch LeetCode data');
  }
};

export const fetchCodeforcesStats = async (username) => {
  if (!username) throw new ApiError(400, 'Codeforces username is required');

  try {
    const { data } = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`,
      { timeout: 15000 }
    );

    if (data.status !== 'OK' || !data.result?.length) {
      throw new ApiError(404, 'Codeforces user not found');
    }

    const user = data.result[0];

    let contests = 0;
    try {
      const ratingRes = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${username}`,
        { timeout: 15000 }
      );
      if (ratingRes.data.status === 'OK') {
        contests = ratingRes.data.result?.length || 0;
      }
    } catch {
      contests = 0;
    }

    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    try {
      const statusRes = await axios.get(
        `https://codeforces.com/api/user.status?handle=${username}`,
        { timeout: 20000 }
      );

      if (statusRes.data.status === 'OK') {
        const solved = new Map();
        for (const sub of statusRes.data.result || []) {
          if (sub.verdict === 'OK') {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            if (!solved.has(key)) {
              solved.set(key, sub.problem.rating);
            }
          }
        }

        totalSolved = solved.size;
        for (const rating of solved.values()) {
          const bucket = categorizeByRating(rating);
          if (bucket === 'easy') easySolved += 1;
          else if (bucket === 'medium') mediumSolved += 1;
          else hardSolved += 1;
        }
      }
    } catch {
      // problem stats optional if status API is slow
    }

    return {
      rating: user.rating || 0,
      rank: user.rank || '',
      maxRating: user.maxRating || 0,
      maxRank: user.maxRank || '',
      contests,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, 'Failed to fetch Codeforces data');
  }
};

export const fetchCodeChefStats = async (username) => {
  if (!username) throw new ApiError(400, 'CodeChef username is required');

  const handle = normalizeHandle(username, 'codechef');
  const result = {
    rating: 0,
    maxRating: 0,
    globalRank: 0,
    countryRank: 0,
    stars: '',
    name: handle,
    countryName: '',
    problemsSolved: 0,
    contests: 0,
  };

  let profileFound = false;

  try {
    const { data } = await axios.get(
      `https://codechef-stats-api-two.vercel.app/profile/${encodeURIComponent(handle)}`,
      { timeout: 15000 }
    );
    const profile = data?.profile || data?.data || data;
    const meta = data?.data;

    if (
      profile?.name ||
      meta?.displayName ||
      profile?.currentRating != null ||
      profile?.totalSolved != null ||
      profile?.stars
    ) {
      result.rating = profile.currentRating || profile.rating || 0;
      result.maxRating = profile.highestRating || profile.maxRating || 0;
      result.globalRank = profile.globalRank || profile.global_rank || 0;
      result.countryRank = profile.countryRank || profile.country_rank || 0;
      result.stars = profile.stars || profile.star || '';
      result.name = profile.name || meta?.displayName || handle;
      result.countryName = profile.countryName || profile.country || '';
      result.problemsSolved =
        profile.totalSolved ||
        profile.fullySolved ||
        profile.problemsSolved ||
        profile.totalProblemsSolved ||
        0;
      profileFound = true;
    }
  } catch {
    // try HTML scrape
  }

  if (!profileFound) {
    try {
      const { data: html } = await axios.get(
        `https://www.codechef.com/users/${encodeURIComponent(handle)}`,
        {
          timeout: 15000,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PlaceTrack/1.0)' },
        }
      );

      const ratingMatch = html.match(/"rating":\s*(\d+)/);
      const maxRatingMatch = html.match(/"highestRating":\s*(\d+)/);
      const nameMatch = html.match(/"name":\s*"([^"]+)"/);
      const starsMatch = html.match(/"stars":\s*"([^"]+)"/);
      const solvedMatch =
        html.match(/"fullySolved":\s*(\d+)/) || html.match(/"totalSolved":\s*(\d+)/);

      if (ratingMatch || nameMatch || solvedMatch) {
        result.rating = ratingMatch ? Number(ratingMatch[1]) : 0;
        result.maxRating = maxRatingMatch ? Number(maxRatingMatch[1]) : 0;
        result.name = nameMatch ? nameMatch[1] : handle;
        result.stars = starsMatch ? starsMatch[1] : '';
        result.problemsSolved = solvedMatch ? Number(solvedMatch[1]) : 0;
        profileFound = true;
      }
    } catch {
      // scrape failed
    }
  }

  try {
    const { data } = await axios.get(
      `https://codechef-stats-api-two.vercel.app/rating/${encodeURIComponent(handle)}`,
      { timeout: 15000 }
    );
    const ratings = data?.ratingData || data?.ratings || [];
    result.contests = Array.isArray(ratings) ? ratings.length : 0;
  } catch {
    // optional
  }

  if (!result.problemsSolved) {
    try {
      const { data } = await axios.get(
        `https://codechef-stats-api-two.vercel.app/heatmap/${encodeURIComponent(handle)}?view=last_365`,
        { timeout: 15000 }
      );
      const heatMap = data?.heatMap || [];
      if (Array.isArray(heatMap)) {
        result.problemsSolved = heatMap.reduce((sum, d) => sum + (d.value || 0), 0);
      }
    } catch {
      // optional
    }
  }

  if (!profileFound && !result.problemsSolved) {
    throw new ApiError(
      404,
      `CodeChef user "${handle}" not found. Use your handle from codechef.com/users/{handle}`
    );
  }

  return result;
};

export const fetchGeeksforGeeksStats = async (username) => {
  if (!username) throw new ApiError(400, 'GeeksforGeeks username is required');

  const handle = normalizeHandle(username, 'gfg');
  const base = {
    totalSolved: 0,
    codingScore: 0,
    monthlyScore: 0,
    instituteRank: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    schoolSolved: 0,
    basicSolved: 0,
    currentStreak: 0,
    maxStreak: 0,
  };

  const applyDifficulty = (diff = {}) => {
    base.schoolSolved = diff.school ?? diff.School ?? base.schoolSolved;
    base.basicSolved = diff.basic ?? diff.Basic ?? base.basicSolved;
    base.easySolved = diff.easy ?? diff.Easy ?? base.easySolved;
    base.mediumSolved = diff.medium ?? diff.Medium ?? base.mediumSolved;
    base.hardSolved = diff.hard ?? diff.Hard ?? base.hardSolved;
  };

  try {
    const { data } = await axios.get(
      `https://gfgstatscard.vercel.app/${encodeURIComponent(handle)}?raw=true`,
      { timeout: 15000 }
    );

    base.totalSolved = data.total_problems_solved || data.totalProblemsSolved || 0;
    base.codingScore = data.total_score || data.codingScore || 0;
    base.monthlyScore = data.monthly_score || data.monthlyScore || 0;
    base.currentStreak = data.pod_solved_current_streak || data.currentStreak || 0;
    base.maxStreak = data.pod_solved_global_longest_streak || data.maxStreak || 0;
    applyDifficulty({
      school: data.School,
      basic: data.Basic,
      easy: data.Easy,
      medium: data.Medium,
      hard: data.Hard,
    });
  } catch {
    // continue
  }

  try {
    const { data } = await axios.get(
      `https://gfg-stats.tashif.codes/${encodeURIComponent(handle)}`,
      { timeout: 15000 }
    );
    base.totalSolved =
      base.totalSolved || data.totalProblemsSolved || data.data?.totalSolved || 0;
    base.codingScore = base.codingScore || data.codingScore || data.data?.codingScore || 0;
  } catch {
    // optional
  }

  try {
    const { data } = await axios.get(
      `https://gfg-stats.tashif.codes/${encodeURIComponent(handle)}/solved-problems`,
      { timeout: 15000 }
    );
    if (data.totalProblemsSolved) base.totalSolved = data.totalProblemsSolved;
    applyDifficulty(data.problemsByDifficulty || {});
  } catch {
    // optional
  }

  try {
    const { data } = await axios.get(
      `https://gfg-stats.tashif.codes/${encodeURIComponent(handle)}/profile`,
      { timeout: 15000 }
    );
    const profile = data?.data || data;
    base.totalSolved = base.totalSolved || profile.totalProblemsSolved || 0;
    base.codingScore = base.codingScore || profile.codingScore || 0;
    base.monthlyScore = base.monthlyScore || profile.monthlyScore || 0;
    base.instituteRank = profile.instituteRank || profile.institute_rank || base.instituteRank;
    base.currentStreak = base.currentStreak || profile.currentStreak || profile.streak || 0;
    base.maxStreak = base.maxStreak || profile.maxStreak || profile.longestStreak || 0;
  } catch {
    // optional
  }

  const breakdownTotal =
    base.easySolved + base.mediumSolved + base.hardSolved + base.schoolSolved + base.basicSolved;
  if (!base.totalSolved && breakdownTotal) base.totalSolved = breakdownTotal;

  if (!base.totalSolved && !base.codingScore && !breakdownTotal) {
    throw new ApiError(
      404,
      `GeeksforGeeks user "${handle}" not found. Use username from geeksforgeeks.org/user/{username}`
    );
  }

  return base;
};
