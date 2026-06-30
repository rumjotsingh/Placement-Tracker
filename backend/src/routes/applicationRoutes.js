import { Router } from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import {
  applicationStatusValidator,
  mongoIdParam,
  paginationQuery,
} from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get('/my', authorize(ROLES.STUDENT), paginationQuery, validate, applicationController.getMyApplications);
router.post(
  '/drives/:driveId/apply',
  authorize(ROLES.STUDENT),
  mongoIdParam('driveId'),
  validate,
  applicationController.apply
);
router.patch(
  '/:id/withdraw',
  authorize(ROLES.STUDENT),
  mongoIdParam('id'),
  validate,
  applicationController.withdraw
);

router.get(
  '/',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  paginationQuery,
  validate,
  applicationController.listApplications
);

router.get('/:id', mongoIdParam('id'), validate, applicationController.getApplication);

router.patch(
  '/:id/status',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  applicationStatusValidator,
  validate,
  applicationController.updateStatus
);

export default router;
