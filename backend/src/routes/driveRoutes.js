import { Router } from 'express';
import * as driveController from '../controllers/driveController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { driveValidator, mongoIdParam, paginationQuery } from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.get('/', paginationQuery, validate, driveController.listDrives);
router.get(
  '/:id/eligibility',
  authenticate,
  authorize(ROLES.STUDENT),
  mongoIdParam('id'),
  validate,
  driveController.getEligibility
);
router.get('/:id', mongoIdParam('id'), validate, driveController.getDrive);
router.get(
  '/:id/applicants',
  authenticate,
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  paginationQuery,
  validate,
  driveController.getApplicants
);

router.post(
  '/',
  authenticate,
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  driveValidator,
  validate,
  driveController.createDrive
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  driveValidator,
  validate,
  driveController.updateDrive
);

router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  validate,
  driveController.deleteDrive
);

router.patch(
  '/:id/close',
  authenticate,
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  validate,
  driveController.closeDrive
);

export default router;
