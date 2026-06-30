import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as companyService from '../services/companyService.js';

export const createCompany = asyncHandler(async (req, res) => {
  const company = await companyService.createCompany(req.body, req.user._id, req.file);
  res.status(201).json(new ApiResponse(201, company, 'Company created'));
});

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await companyService.updateCompany(req.params.id, req.body, req.file);
  res.json(new ApiResponse(200, company, 'Company updated'));
});

export const deleteCompany = asyncHandler(async (req, res) => {
  const result = await companyService.deleteCompany(req.params.id);
  res.json(new ApiResponse(200, result, result.message));
});

export const getCompany = asyncHandler(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  res.json(new ApiResponse(200, company, 'Company fetched'));
});

export const listCompanies = asyncHandler(async (req, res) => {
  const result = await companyService.searchCompanies(req.query);
  res.json(new ApiResponse(200, result, 'Companies fetched'));
});
