import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as searchService from '../services/searchService.js';

export const searchStudents = asyncHandler(async (req, res) => {
  const result = await searchService.searchStudents(req.query);
  res.json(new ApiResponse(200, result, 'Students fetched'));
});

export const searchCompanies = asyncHandler(async (req, res) => {
  const result = await searchService.searchCompanies(req.query);
  res.json(new ApiResponse(200, result, 'Companies fetched'));
});

export const searchDrives = asyncHandler(async (req, res) => {
  const result = await searchService.searchDrives(req.query);
  res.json(new ApiResponse(200, result, 'Drives fetched'));
});

export const searchApplications = asyncHandler(async (req, res) => {
  const result = await searchService.searchApplications(req.query);
  res.json(new ApiResponse(200, result, 'Applications fetched'));
});
