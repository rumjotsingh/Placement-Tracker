import Company from '../models/Company.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinaryService.js';

export const createCompany = async (data, userId, logoFile) => {
  let logo;
  let logoPublicId;

  if (logoFile) {
    const result = await uploadToCloudinary(logoFile.buffer, 'companies', 'image');
    logo = result.secure_url;
    logoPublicId = result.public_id;
  }

  return Company.create({
    ...data,
    logo,
    logoPublicId,
    createdBy: userId,
  });
};

export const updateCompany = async (id, data, logoFile) => {
  const company = await Company.findById(id);
  if (!company) throw new ApiError(404, 'Company not found');

  Object.assign(company, data);

  if (logoFile) {
    if (company.logoPublicId) await deleteFromCloudinary(company.logoPublicId);
    const result = await uploadToCloudinary(logoFile.buffer, 'companies', 'image');
    company.logo = result.secure_url;
    company.logoPublicId = result.public_id;
  }

  await company.save();
  return company;
};

export const deleteCompany = async (id) => {
  const company = await Company.findById(id);
  if (!company) throw new ApiError(404, 'Company not found');

  company.isActive = false;
  await company.save();
  return { message: 'Company deactivated' };
};

export const getCompanyById = async (id) => {
  const company = await Company.findById(id).populate('createdBy', 'name email');
  if (!company || !company.isActive) throw new ApiError(404, 'Company not found');
  return company;
};

export const searchCompanies = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isActive: true };

  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.industry) filter.industry = query.industry;
  if (query.location) filter.location = new RegExp(query.location, 'i');

  const [items, total] = await Promise.all([
    Company.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Company.countDocuments(filter),
  ]);

  return paginateResponse(items, total, page, limit);
};
