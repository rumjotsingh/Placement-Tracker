import User from '../models/User.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';

export const searchStudents = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { role: 'STUDENT', isActive: true };

  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, 'i') },
      { email: new RegExp(query.search, 'i') },
      { rollNumber: new RegExp(query.search, 'i') },
    ];
  }
  if (query.branch) filter.branch = query.branch;
  if (query.graduationYear) filter.graduationYear = Number(query.graduationYear);

  const [items, total] = await Promise.all([
    User.find(filter).select('-password').skip(skip).limit(limit).sort({ name: 1 }),
    User.countDocuments(filter),
  ]);

  return paginateResponse(items, total, page, limit);
};

export const searchDrives = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.search) filter.$text = { $search: query.search };
  if (query.status) filter.status = query.status;
  if (query.company) filter.company = query.company;
  if (query.branch) {
    filter['eligibilityCriteria.eligibleBranches'] = query.branch;
  }
  if (query.from || query.to) {
    filter.driveDate = {};
    if (query.from) filter.driveDate.$gte = new Date(query.from);
    if (query.to) filter.driveDate.$lte = new Date(query.to);
  }

  const [items, total] = await Promise.all([
    PlacementDrive.find(filter)
      .populate('company', 'name logo')
      .skip(skip)
      .limit(limit)
      .sort({ deadline: 1 }),
    PlacementDrive.countDocuments(filter),
  ]);

  return paginateResponse(items, total, page, limit);
};

export const searchApplications = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { withdrawn: false };

  if (query.status) filter.status = query.status;
  if (query.drive) filter.drive = query.drive;
  if (query.student) filter.student = query.student;

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

export const searchCompanies = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isActive: true };

  if (query.search) filter.$text = { $search: query.search };
  if (query.industry) filter.industry = query.industry;
  if (query.location) filter.location = new RegExp(query.location, 'i');

  const [items, total] = await Promise.all([
    Company.find(filter).skip(skip).limit(limit).sort({ name: 1 }),
    Company.countDocuments(filter),
  ]);

  return paginateResponse(items, total, page, limit);
};
