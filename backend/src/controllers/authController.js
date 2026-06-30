import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as authService from '../services/authService.js';
import User from '../models/User.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerStudent(req.body);
  res.status(201).json(new ApiResponse(201, result, 'Registration successful'));
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password);
  res.json(new ApiResponse(200, result, 'Login successful'));
});

export const logout = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res.json(new ApiResponse(200, result, result.message));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  res.json(new ApiResponse(200, result, result.message));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(new ApiResponse(200, user, 'User fetched'));
});

export const createCoordinator = asyncHandler(async (req, res) => {
  const user = await authService.createUserByAdmin(req.body, 'COORDINATOR');
  res.status(201).json(new ApiResponse(201, user, 'Coordinator created'));
});

export const createAdmin = asyncHandler(async (req, res) => {
  const user = await authService.createUserByAdmin(req.body, 'ADMIN');
  res.status(201).json(new ApiResponse(201, user, 'Admin created'));
});

export const listUsers = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.json(new ApiResponse(200, users, 'Users fetched'));
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  res.json(new ApiResponse(200, user, 'User deactivated'));
});
