import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid or inactive user');
    }

    req.user = user;
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId);
    if (user?.isActive) req.user = user;
  } catch {
    // ignore invalid token for optional auth
  }

  next();
});
