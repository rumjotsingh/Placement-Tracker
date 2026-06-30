import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import CodingStats from '../models/CodingStats.js';
import DSAProgress from '../models/DSAProgress.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateResetToken } from '../utils/tokens.js';
import { ROLES } from '../constants/index.js';

export const registerStudent = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new ApiError(409, 'Email already registered');

  if (data.rollNumber) {
    const rollExists = await User.findOne({ rollNumber: data.rollNumber });
    if (rollExists) throw new ApiError(409, 'Roll number already registered');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: ROLES.STUDENT,
    rollNumber: data.rollNumber,
    branch: data.branch,
    graduationYear: data.graduationYear,
  });

  const portfolioSlug = `${data.rollNumber || user._id}`.toLowerCase().replace(/\s+/g, '-');

  await StudentProfile.create({
    user: user._id,
    portfolioSlug,
  });

  await CodingStats.create({ user: user._id });
  await DSAProgress.create({ user: user._id });

  const token = generateAccessToken(user._id, user.role);
  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (!user.isActive) throw new ApiError(403, 'Account is deactivated');

  const valid = await user.comparePassword(password);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const token = generateAccessToken(user._id, user.role);
  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires');
  if (!user) {
    return { message: 'If that email exists, a reset link has been sent' };
  }

  const { token, hashed } = generateResetToken();
  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  return {
    message: 'If that email exists, a reset link has been sent',
    resetToken: token,
  };
};

export const resetPassword = async (token, newPassword) => {
  const crypto = await import('crypto');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password +resetPasswordToken +resetPasswordExpires');

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: 'Password reset successful' };
};

export const createUserByAdmin = async (data, role) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role,
    rollNumber: data.rollNumber,
    branch: data.branch,
    graduationYear: data.graduationYear,
  });

  if (role === ROLES.STUDENT) {
    await StudentProfile.create({ user: user._id });
    await CodingStats.create({ user: user._id });
    await DSAProgress.create({ user: user._id });
  }

  const safeUser = user.toObject();
  delete safeUser.password;
  return safeUser;
};
