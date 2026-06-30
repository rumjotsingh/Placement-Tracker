import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { APPLICATION_STATUS } from '../constants/index.js';
import { checkEligibility } from './driveService.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES } from '../constants/index.js';

export const applyToDrive = async (studentId, driveId) => {
  const drive = await PlacementDrive.findById(driveId);
  if (!drive) throw new ApiError(404, 'Drive not found');

  await checkEligibility(studentId, drive);

  const existing = await Application.findOne({ student: studentId, drive: driveId });
  if (existing) {
    if (existing.withdrawn) {
      existing.withdrawn = false;
      existing.withdrawnAt = undefined;
      existing.status = APPLICATION_STATUS.APPLIED;
      existing.statusHistory.push({ status: APPLICATION_STATUS.APPLIED, changedAt: new Date() });
      await existing.save();
      return existing.populate('drive', 'jobRole company');
    }
    throw new ApiError(409, 'Already applied to this drive');
  }

  const application = await Application.create({
    student: studentId,
    drive: driveId,
    statusHistory: [{ status: APPLICATION_STATUS.APPLIED, changedAt: new Date() }],
  });

  return application.populate([
    { path: 'drive', populate: { path: 'company', select: 'name logo' } },
    { path: 'student', select: 'name email rollNumber' },
  ]);
};

export const withdrawApplication = async (studentId, applicationId) => {
  const application = await Application.findOne({ _id: applicationId, student: studentId });
  if (!application) throw new ApiError(404, 'Application not found');
  if (application.withdrawn) throw new ApiError(400, 'Application already withdrawn');

  application.withdrawn = true;
  application.withdrawnAt = new Date();
  await application.save();

  return { message: 'Application withdrawn' };
};

export const updateApplicationStatus = async (applicationId, status, changedBy) => {
  const application = await Application.findById(applicationId).populate('student', '_id name');
  if (!application) throw new ApiError(404, 'Application not found');
  if (application.withdrawn) throw new ApiError(400, 'Cannot update withdrawn application');

  application.status = status;
  application.statusHistory.push({ status, changedAt: new Date(), changedBy });
  await application.save();

  await createNotification({
    userId: application.student._id,
    type: NOTIFICATION_TYPES.APPLICATION_STATUS_UPDATED,
    title: 'Application Status Updated',
    message: `Your application status is now: ${status}`,
    link: `/applications/${application._id}`,
  });

  return application.populate([
    { path: 'drive', populate: { path: 'company', select: 'name' } },
    { path: 'student', select: 'name email rollNumber branch' },
  ]);
};

export const getStudentApplications = async (studentId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { student: studentId, withdrawn: false };
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Application.find(filter)
      .populate({ path: 'drive', populate: { path: 'company', select: 'name logo' } })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 }),
    Application.countDocuments(filter),
  ]);

  return paginateResponse(items, total, page, limit);
};

export const getApplicationById = async (id, user) => {
  const application = await Application.findById(id)
    .populate('student', 'name email rollNumber branch')
    .populate({ path: 'drive', populate: { path: 'company', select: 'name logo' } });

  if (!application) throw new ApiError(404, 'Application not found');

  if (
    user.role === 'STUDENT' &&
    application.student._id.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, 'Access denied');
  }

  return application;
};

export const listApplications = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { withdrawn: false };

  if (query.status) filter.status = query.status;
  if (query.drive) filter.drive = query.drive;
  if (query.student) filter.student = query.student;
  if (query.company) {
    const drives = await PlacementDrive.find({ company: query.company }).select('_id');
    filter.drive = { $in: drives.map((d) => d._id) };
  }

  const [items, total] = await Promise.all([
    Application.find(filter)
      .populate('student', 'name email rollNumber branch')
      .populate({ path: 'drive', populate: { path: 'company', select: 'name' } })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 }),
    Application.countDocuments(filter),
  ]);

  return paginateResponse(items, total, page, limit);
};
