import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import env from '../config/env.js';

export const generateAccessToken = (userId, role) =>
  jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashed };
};
