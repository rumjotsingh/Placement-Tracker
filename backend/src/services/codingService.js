import axios from 'axios';
import ApiError from '../utils/ApiError.js';

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
      { timeout: 10000 }
    );

    if (data.status !== 'OK' || !data.result?.length) {
      throw new ApiError(404, 'Codeforces user not found');
    }

    const user = data.result[0];

    let contests = 0;
    try {
      const ratingRes = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${username}`,
        { timeout: 10000 }
      );
      if (ratingRes.data.status === 'OK') {
        contests = ratingRes.data.result?.length || 0;
      }
    } catch {
      contests = 0;
    }

    return {
      rating: user.rating || 0,
      rank: user.rank || '',
      maxRating: user.maxRating || 0,
      contests,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, 'Failed to fetch Codeforces data');
  }
};
