import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as resumeService from '../services/resumeService.js';

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, 'Resume PDF is required'));
  }
  const resume = await resumeService.uploadResume(req.user._id, req.file);
  res.status(201).json(new ApiResponse(201, resume, 'Resume uploaded'));
});

export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await resumeService.getResumes(req.user._id);
  res.json(new ApiResponse(200, resumes, 'Resumes fetched'));
});

export const getActiveResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getActiveResume(req.user._id);
  res.json(new ApiResponse(200, resume, 'Active resume fetched'));
});

export const deleteResume = asyncHandler(async (req, res) => {
  const result = await resumeService.deleteResumeVersion(req.user._id, req.params.id);
  res.json(new ApiResponse(200, result, result.message));
});
