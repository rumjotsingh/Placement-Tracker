import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as applicationService from '../services/applicationService.js';

export const apply = asyncHandler(async (req, res) => {
  const application = await applicationService.applyToDrive(req.user._id, req.params.driveId);
  res.status(201).json(new ApiResponse(201, application, 'Application submitted'));
});

export const withdraw = asyncHandler(async (req, res) => {
  const result = await applicationService.withdrawApplication(req.user._id, req.params.id);
  res.json(new ApiResponse(200, result, result.message));
});

export const updateStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.body.status,
    req.user._id
  );
  res.json(new ApiResponse(200, application, 'Status updated'));
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const result = await applicationService.getStudentApplications(req.user._id, req.query);
  res.json(new ApiResponse(200, result, 'Applications fetched'));
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(req.params.id, req.user);
  res.json(new ApiResponse(200, application, 'Application fetched'));
});

export const listApplications = asyncHandler(async (req, res) => {
  const result = await applicationService.listApplications(req.query);
  res.json(new ApiResponse(200, result, 'Applications fetched'));
});
