import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as driveService from '../services/driveService.js';

export const createDrive = asyncHandler(async (req, res) => {
  const drive = await driveService.createDrive(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, drive, 'Drive created'));
});

export const updateDrive = asyncHandler(async (req, res) => {
  const drive = await driveService.updateDrive(req.params.id, req.body);
  res.json(new ApiResponse(200, drive, 'Drive updated'));
});

export const closeDrive = asyncHandler(async (req, res) => {
  const drive = await driveService.closeDrive(req.params.id);
  res.json(new ApiResponse(200, drive, 'Drive closed'));
});

export const getDrive = asyncHandler(async (req, res) => {
  const drive = await driveService.getDriveById(req.params.id);
  res.json(new ApiResponse(200, drive, 'Drive fetched'));
});

export const listDrives = asyncHandler(async (req, res) => {
  const result = await driveService.listDrives(req.query);
  res.json(new ApiResponse(200, result, 'Drives fetched'));
});

export const getApplicants = asyncHandler(async (req, res) => {
  const result = await driveService.getDriveApplicants(req.params.id, req.query);
  res.json(new ApiResponse(200, result, 'Applicants fetched'));
});
