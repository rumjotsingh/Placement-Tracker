import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  createUserValidator,
  mongoIdParam,
} from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

router.post(
  '/coordinators',
  authenticate,
  authorize(ROLES.ADMIN),
  createUserValidator,
  validate,
  authController.createCoordinator
);

router.post(
  '/admins',
  authenticate,
  authorize(ROLES.ADMIN),
  createUserValidator,
  validate,
  authController.createAdmin
);

router.get('/users', authenticate, authorize(ROLES.ADMIN), authController.listUsers);
router.patch(
  '/users/:id/deactivate',
  authenticate,
  authorize(ROLES.ADMIN),
  mongoIdParam('id'),
  validate,
  authController.deactivateUser
);

export default router;
