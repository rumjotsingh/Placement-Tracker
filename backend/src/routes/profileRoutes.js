import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateValidator } from '../validators/index.js';

const router = Router();

router.get('/me', authenticate, profileController.getMyProfile);
router.get('/portfolio/:slug', profileController.getPublicPortfolio);
router.put('/me', authenticate, profileUpdateValidator, validate, profileController.updateProfile);
router.patch('/me/info', authenticate, profileController.updateBasicInfo);
router.post(
  '/me/image',
  authenticate,
  upload.single('profileImage'),
  profileController.uploadProfileImage
);

export default router;
