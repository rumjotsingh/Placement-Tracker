import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as interviewService from '../services/interviewService.js';

export const schedule = asyncHandler(async (req, res) => {
  const interview = await interviewService.scheduleInterview(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, interview, 'Interview scheduled'));
});

export const update = asyncHandler(async (req, res) => {
  const interview = await interviewService.updateInterview(req.params.id, req.body);
  res.json(new ApiResponse(200, interview, 'Interview updated'));
});

export const cancel = asyncHandler(async (req, res) => {
  const interview = await interviewService.cancelInterview(req.params.id);
  res.json(new ApiResponse(200, interview, 'Interview cancelled'));
});

export const addFeedback = asyncHandler(async (req, res) => {
  const interview = await interviewService.addFeedback(
    req.params.id,
    req.body.feedback,
    req.body.result
  );
  res.json(new ApiResponse(200, interview, 'Feedback added'));
});

export const getInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.getInterviewById(req.params.id);
  res.json(new ApiResponse(200, interview, 'Interview fetched'));
});

export const listInterviews = asyncHandler(async (req, res) => {
  const result = await interviewService.listInterviews(req.query, req.user);
  res.json(new ApiResponse(200, result, 'Interviews fetched'));
});
