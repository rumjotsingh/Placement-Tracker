import { Router } from 'express';
import * as searchController from '../controllers/searchController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { paginationQuery } from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get(
  '/students',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  paginationQuery,
  validate,
  searchController.searchStudents
);

router.get('/companies', paginationQuery, validate, searchController.searchCompanies);
router.get('/drives', paginationQuery, validate, searchController.searchDrives);

router.get(
  '/applications',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  paginationQuery,
  validate,
  searchController.searchApplications
);

export default router;
