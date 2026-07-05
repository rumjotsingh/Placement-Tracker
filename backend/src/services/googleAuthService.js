import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import CodingStats from '../models/CodingStats.js';
import DSAProgress from '../models/DSAProgress.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken } from '../utils/tokens.js';
import { ROLES } from '../constants/index.js';
import env from '../config/env.js';

const getOAuthClient = () => {
  if (!env.googleClientId || !env.googleClientSecret || !env.googleCallbackUrl) {
    throw new ApiError(500, 'Google OAuth is not configured');
  }

  return new OAuth2Client(
    env.googleClientId,
    env.googleClientSecret,
    env.googleCallbackUrl
  );
};

export const getGoogleAuthUrl = () => {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: 'online',
    scope: ['email', 'profile', 'openid'],
    prompt: 'select_account',
  });
};

const ensureStudentResources = async (user) => {
  if (user.role !== ROLES.STUDENT) return;

  const [profile, coding, dsa] = await Promise.all([
    StudentProfile.findOne({ user: user._id }),
    CodingStats.findOne({ user: user._id }),
    DSAProgress.findOne({ user: user._id }),
  ]);

  if (!profile) {
    const portfolioSlug = `${user._id}`.toLowerCase();
    await StudentProfile.create({ user: user._id, portfolioSlug });
  }
  if (!coding) await CodingStats.create({ user: user._id });
  if (!dsa) await DSAProgress.create({ user: user._id });
};

export const handleGoogleCallback = async (code) => {
  if (!code) throw new ApiError(400, 'Authorization code is required');

  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.id_token) throw new ApiError(401, 'Failed to verify Google account');

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new ApiError(401, 'Google account email not available');

  const email = payload.email.toLowerCase();
  const googleId = payload.sub;
  const name = payload.name || email.split('@')[0];

  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  }).select('+password');

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      authProvider: 'google',
      password: crypto.randomBytes(32).toString('hex'),
      role: ROLES.STUDENT,
    });
    await ensureStudentResources(user);
  } else {
    if (!user.isActive) throw new ApiError(403, 'Account is deactivated');

    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      await user.save();
    }

    await ensureStudentResources(user);
  }

  const token = generateAccessToken(user._id, user.role);
  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
};
