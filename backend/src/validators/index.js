import { body, param, query } from 'express-validator';
import { APPLICATION_STATUS, JOB_TYPES, INTERVIEW_MODES, INTERVIEW_RESULTS } from '../constants/index.js';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('branch').trim().notEmpty().withMessage('Branch is required'),
  body('graduationYear').isInt({ min: 2020, max: 2035 }).withMessage('Valid graduation year is required'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const profileUpdateValidator = [
  body('cgpa').optional().isFloat({ min: 0, max: 10 }),
  body('phone').optional().trim(),
  body('skills').optional().isArray(),
  body('certifications').optional().isArray(),
  body('projects').optional().isArray(),
  body('githubUsername').optional().trim(),
  body('leetcodeUsername').optional().trim(),
  body('codeforcesUsername').optional().trim(),
];

export const companyValidator = [
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('website').optional().isURL().withMessage('Valid website URL required'),
  body('industry').optional().trim(),
  body('description').optional().trim(),
  body('location').optional().trim(),
];

export const driveValidator = [
  body('company').notEmpty().withMessage('Company is required'),
  body('jobRole').trim().notEmpty().withMessage('Job role is required'),
  body('package').trim().notEmpty().withMessage('Package is required'),
  body('jobType').optional().isIn(JOB_TYPES),
  body('location').optional().trim(),
  body('deadline').isISO8601().withMessage('Valid deadline is required'),
  body('driveDate').isISO8601().withMessage('Valid drive date is required'),
  body('eligibilityCriteria.minCgpa').optional().isFloat({ min: 0, max: 10 }),
  body('eligibilityCriteria.eligibleBranches').optional().isArray(),
];

export const applicationStatusValidator = [
  body('status').isIn(Object.values(APPLICATION_STATUS)).withMessage('Invalid status'),
];

export const interviewValidator = [
  body('application').notEmpty().withMessage('Application is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').trim().notEmpty().withMessage('Time is required'),
  body('mode').isIn(INTERVIEW_MODES).withMessage('Invalid interview mode'),
  body('meetingLink').optional().trim(),
  body('notes').optional().trim(),
];

export const interviewFeedbackValidator = [
  body('feedback').trim().notEmpty().withMessage('Feedback is required'),
  body('result').optional().isIn(INTERVIEW_RESULTS),
];

export const mongoIdParam = (name = 'id') => [param(name).isMongoId().withMessage(`Invalid ${name}`)];

export const paginationQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

export const createUserValidator = [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('rollNumber').optional().trim(),
  body('branch').optional().trim(),
  body('graduationYear').optional().isInt({ min: 2020, max: 2035 }),
];

export const dsaUpdateValidator = [
  body('easy').optional().isInt({ min: 0 }),
  body('medium').optional().isInt({ min: 0 }),
  body('hard').optional().isInt({ min: 0 }),
];
