import { Router } from 'express';
import * as companyController from '../controllers/companyController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { companyValidator, mongoIdParam, paginationQuery } from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.get('/', paginationQuery, validate, companyController.listCompanies);
router.get('/:id', mongoIdParam('id'), validate, companyController.getCompany);

router.post(
  '/',
  authenticate,
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  upload.single('logo'),
  companyValidator,
  validate,
  companyController.createCompany
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  upload.single('logo'),
  companyValidator,
  validate,
  companyController.updateCompany
);

router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  mongoIdParam('id'),
  validate,
  companyController.deleteCompany
);

export default router;
