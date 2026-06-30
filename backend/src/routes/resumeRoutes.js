import { Router } from 'express';
import * as resumeController from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { mongoIdParam } from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize(ROLES.STUDENT), upload.single('resume'), resumeController.uploadResume);
router.get('/', authorize(ROLES.STUDENT), resumeController.getResumes);
router.get('/active', authorize(ROLES.STUDENT), resumeController.getActiveResume);
router.delete(
  '/:id',
  authorize(ROLES.STUDENT),
  mongoIdParam('id'),
  validate,
  resumeController.deleteResume
);

export default router;
