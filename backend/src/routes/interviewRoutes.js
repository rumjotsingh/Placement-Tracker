import { Router } from 'express';
import * as interviewController from '../controllers/interviewController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import {
  interviewValidator,
  interviewFeedbackValidator,
  mongoIdParam,
  paginationQuery,
} from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get('/', paginationQuery, validate, interviewController.listInterviews);
router.get('/:id', mongoIdParam('id'), validate, interviewController.getInterview);

router.post(
  '/',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  interviewValidator,
  validate,
  interviewController.schedule
);

router.put(
  '/:id',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  validate,
  interviewController.update
);

router.patch(
  '/:id/cancel',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  validate,
  interviewController.cancel
);

router.patch(
  '/:id/feedback',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  interviewFeedbackValidator,
  validate,
  interviewController.addFeedback
);

export default router;
