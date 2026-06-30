import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { DRIVE_STATUS } from '../constants/index.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES } from '../constants/index.js';

export const createDrive = async (data, userId) => {
  const drive = await PlacementDrive.create({ ...data, createdBy: userId });

  const students = await User.find({ role: 'STUDENT', isActive: true }).select('_id');
  await Promise.all(
    students.map((s) =>
      createNotification({
        userId: s._id,
        type: NOTIFICATION_TYPES.NEW_DRIVE,
        title: 'New Placement Drive',
        message: `A new drive for ${data.jobRole} has been posted`,
        link: `/drives/${drive._id}`,
      })
    )
  );

  return drive.populate('company createdBy', 'name email logo');
};

export const updateDrive = async (id, data) => {
  const drive = await PlacementDrive.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('company createdBy', 'name email logo');

  if (!drive) throw new ApiError(404, 'Drive not found');
  return drive;
};

export const closeDrive = async (id) => {
  const drive = await PlacementDrive.findById(id);
  if (!drive) throw new ApiError(404, 'Drive not found');

  drive.status = DRIVE_STATUS.CLOSED;
  await drive.save();
  return drive;
};

export const getDriveById = async (id) => {
  const drive = await PlacementDrive.findById(id).populate('company createdBy', 'name email logo');
  if (!drive) throw new ApiError(404, 'Drive not found');
  return drive;
};

export const listDrives = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.company) filter.company = query.company;
  if (query.search) filter.$text = { $search: query.search };
  if (query.minPackage) filter.package = { $regex: query.minPackage, $options: 'i' };

  const [items, total] = await Promise.all([
    PlacementDrive.find(filter)
      .populate('company', 'name logo industry')
      .skip(skip)
      .limit(limit)
      .sort({ deadline: 1 }),
    PlacementDrive.countDocuments(filter),
  ]);

  return paginateResponse(items, total, page, limit);
};

export const getDriveApplicants = async (driveId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { drive: driveId, withdrawn: false };

  if (query.status) filter.status = query.status;
  if (query.branch) {
    const students = await User.find({ branch: query.branch, role: 'STUDENT' }).select('_id');
    filter.student = { $in: students.map((s) => s._id) };
  }

  const [items, total] = await Promise.all([
    Application.find(filter)
      .populate('student', 'name email rollNumber branch graduationYear')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Application.countDocuments(filter),
  ]);

  return paginateResponse(items, total, page, limit);
};

export const checkEligibility = async (studentId, drive) => {
  const user = await User.findById(studentId);
  const profile = await StudentProfile.findOne({ user: studentId });

  const { minCgpa = 0, eligibleBranches = [] } = drive.eligibilityCriteria || {};

  if (profile?.cgpa != null && profile.cgpa < minCgpa) {
    throw new ApiError(400, `Minimum CGPA required is ${minCgpa}`);
  }

  if (eligibleBranches.length > 0 && user?.branch && !eligibleBranches.includes(user.branch)) {
    throw new ApiError(400, 'Your branch is not eligible for this drive');
  }

  if (drive.status !== DRIVE_STATUS.OPEN) {
    throw new ApiError(400, 'This drive is closed');
  }

  if (new Date() > new Date(drive.deadline)) {
    throw new ApiError(400, 'Application deadline has passed');
  }
};
