import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Notification from '../models/Notification.js';
import * as dashboardService from '../services/dashboardService.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { user: req.user._id };
  if (req.query.unread === 'true') filter.read = false;

  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, paginateResponse(items, total, page, limit), 'Notifications fetched'));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  res.json(new ApiResponse(200, notification, 'Notification marked as read'));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json(new ApiResponse(200, null, 'All notifications marked as read'));
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ user: req.user._id, read: false });
  res.json(new ApiResponse(200, { count }, 'Unread count fetched'));
});

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getStudentDashboard(req.user._id);
  res.json(new ApiResponse(200, data, 'Student dashboard fetched'));
});

export const getCoordinatorDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getCoordinatorDashboard();
  res.json(new ApiResponse(200, data, 'Coordinator dashboard fetched'));
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAdminDashboard();
  res.json(new ApiResponse(200, data, 'Admin dashboard fetched'));
});
