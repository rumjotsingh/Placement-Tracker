import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Resume from '../models/Resume.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { DRIVE_STATUS } from '../constants/index.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES } from '../constants/index.js';

export const createDrive = async (data, userId) => {
  validateDrivePayload(data);
  const drive = await PlacementDrive.create({ ...data, createdBy: userId });

  const students = await User.find({ role: 'STUDENT', isActive: true }).select('_id');
  await Promise.all(
    students.map((s) =>
      createNotification({
        userId: s._id,
        type: NOTIFICATION_TYPES.NEW_DRIVE,
        title: 'New Placement Drive',
        message: `A new drive for ${data.jobRole} has been posted`,
        link: `/student/drives/${drive._id}`,
      })
    )
  );

  return drive.populate('company createdBy', 'name email logo');
};

export const updateDrive = async (id, data) => {
  if (data.deadline || data.driveDate) {
    const current = await PlacementDrive.findById(id);
    if (!current) throw new ApiError(404, 'Drive not found');
    validateDrivePayload(
      {
        deadline: data.deadline || current.deadline,
        driveDate: data.driveDate || current.driveDate,
      },
      { isUpdate: true }
    );
  }

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

export const deleteDrive = async (id) => {
  const drive = await PlacementDrive.findById(id);
  if (!drive) throw new ApiError(404, 'Drive not found');

  const applicationCount = await Application.countDocuments({ drive: id });
  if (applicationCount > 0) {
    throw new ApiError(
      400,
      'Cannot delete a drive with applications. Close the drive instead.'
    );
  }

  await PlacementDrive.findByIdAndDelete(id);
  return { message: 'Drive deleted' };
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
  const result = await evaluateEligibility(studentId, drive);
  if (!result.eligible) {
    throw new ApiError(400, result.reasons[0] || 'You are not eligible for this drive');
  }
};

export const evaluateEligibility = async (studentId, drive) => {
  const user = await User.findById(studentId);
  const profile = await StudentProfile.findOne({ user: studentId });
  const reasons = [];

  if (!user) {
    return { eligible: false, reasons: ['Student account not found'] };
  }

  if (drive.status !== DRIVE_STATUS.OPEN) {
    reasons.push('This drive is closed');
  }

  if (new Date() > new Date(drive.deadline)) {
    reasons.push('Application deadline has passed');
  }

  const { minCgpa = 0, eligibleBranches = [] } = drive.eligibilityCriteria || {};

  if (minCgpa > 0) {
    if (profile?.cgpa == null) {
      reasons.push(`CGPA required (minimum ${minCgpa}). Update your profile.`);
    } else if (profile.cgpa < minCgpa) {
      reasons.push(`Minimum CGPA required is ${minCgpa}. Your CGPA is ${profile.cgpa}.`);
    }
  }

  if (eligibleBranches.length > 0) {
    if (!user.branch) {
      reasons.push('Branch not set on your profile');
    } else if (!eligibleBranches.includes(user.branch)) {
      reasons.push(`Only ${eligibleBranches.join(', ')} branches are eligible`);
    }
  }

  const existing = await Application.findOne({
    student: studentId,
    drive: drive._id,
  });

  if (existing && !existing.withdrawn) {
    reasons.push('You have already applied to this drive');
  }

  const activeResume = await Resume.findOne({ user: studentId, isActive: true });

  if (!activeResume) {
    reasons.push('Upload an active resume before applying');
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    student: {
      cgpa: profile?.cgpa ?? null,
      branch: user.branch ?? null,
      hasResume: !!activeResume,
    },
  };
};

export const validateDrivePayload = (data, { isUpdate = false } = {}) => {
  const deadline = new Date(data.deadline);
  const driveDate = new Date(data.driveDate);

  if (Number.isNaN(deadline.getTime()) || Number.isNaN(driveDate.getTime())) {
    throw new ApiError(400, 'Invalid deadline or drive date');
  }

  if (deadline >= driveDate) {
    throw new ApiError(400, 'Application deadline must be before the drive date');
  }

  if (!isUpdate && deadline <= new Date()) {
    throw new ApiError(400, 'Application deadline must be in the future');
  }
};
