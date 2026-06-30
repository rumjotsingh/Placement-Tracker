import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES } from '../constants/index.js';

export const scheduleInterview = async (data, scheduledBy) => {
  const application = await Application.findById(data.application).populate('student', '_id name');
  if (!application) throw new ApiError(404, 'Application not found');

  const interview = await Interview.create({ ...data, scheduledBy });

  await createNotification({
    userId: application.student._id,
    type: NOTIFICATION_TYPES.INTERVIEW_SCHEDULED,
    title: 'Interview Scheduled',
    message: `Your interview is scheduled on ${new Date(data.date).toDateString()} at ${data.time}`,
    link: `/interviews/${interview._id}`,
  });

  return interview.populate([
    { path: 'application', populate: [{ path: 'student', select: 'name email' }, { path: 'drive', select: 'jobRole' }] },
    { path: 'scheduledBy', select: 'name email' },
  ]);
};

export const updateInterview = async (id, data) => {
  const interview = await Interview.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate([
    { path: 'application', populate: [{ path: 'student', select: 'name email' }, { path: 'drive', select: 'jobRole' }] },
    { path: 'scheduledBy', select: 'name email' },
  ]);

  if (!interview) throw new ApiError(404, 'Interview not found');
  return interview;
};

export const cancelInterview = async (id) => {
  const interview = await Interview.findById(id);
  if (!interview) throw new ApiError(404, 'Interview not found');

  interview.cancelled = true;
  interview.cancelledAt = new Date();
  interview.result = 'Cancelled';
  await interview.save();

  return interview;
};

export const addFeedback = async (id, feedback, result) => {
  const interview = await Interview.findById(id);
  if (!interview) throw new ApiError(404, 'Interview not found');

  interview.feedback = feedback;
  if (result) interview.result = result;
  await interview.save();

  return interview.populate([
    { path: 'application', populate: [{ path: 'student', select: 'name email' }] },
    { path: 'scheduledBy', select: 'name email' },
  ]);
};

export const getInterviewById = async (id) => {
  const interview = await Interview.findById(id).populate([
    {
      path: 'application',
      populate: [
        { path: 'student', select: 'name email rollNumber' },
        { path: 'drive', populate: { path: 'company', select: 'name' } },
      ],
    },
    { path: 'scheduledBy', select: 'name email' },
  ]);

  if (!interview) throw new ApiError(404, 'Interview not found');
  return interview;
};

export const listInterviews = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { cancelled: false };

  if (query.mode) filter.mode = query.mode;
  if (query.result) filter.result = query.result;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }

  let applicationFilter = {};
  if (user.role === 'STUDENT') {
    const apps = await Application.find({ student: user._id }).select('_id');
    applicationFilter = { application: { $in: apps.map((a) => a._id) } };
  } else if (query.student) {
    const apps = await Application.find({ student: query.student }).select('_id');
    applicationFilter = { application: { $in: apps.map((a) => a._id) } };
  }

  const finalFilter = { ...filter, ...applicationFilter };

  const [items, total] = await Promise.all([
    Interview.find(finalFilter)
      .populate({
        path: 'application',
        populate: [
          { path: 'student', select: 'name email rollNumber' },
          { path: 'drive', populate: { path: 'company', select: 'name' } },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 }),
    Interview.countDocuments(finalFilter),
  ]);

  return paginateResponse(items, total, page, limit);
};

export const getUpcomingInterviews = async (userId, limit = 5) => {
  const apps = await Application.find({ student: userId }).select('_id');
  return Interview.find({
    application: { $in: apps.map((a) => a._id) },
    cancelled: false,
    date: { $gte: new Date() },
  })
    .populate({ path: 'application', populate: { path: 'drive', select: 'jobRole' } })
    .sort({ date: 1 })
    .limit(limit);
};
