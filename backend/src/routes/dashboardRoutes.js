import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { mongoIdParam, paginationQuery } from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get('/student', authorize(ROLES.STUDENT), dashboardController.getStudentDashboard);
router.get(
  '/coordinator',
  authorize(ROLES.COORDINATOR, ROLES.ADMIN),
  dashboardController.getCoordinatorDashboard
);
router.get('/admin', authorize(ROLES.ADMIN), dashboardController.getAdminDashboard);

router.get('/notifications', paginationQuery, validate, dashboardController.getNotifications);
router.get('/notifications/unread-count', dashboardController.getUnreadCount);
router.patch(
  '/notifications/:id/read',
  mongoIdParam('id'),
  validate,
  dashboardController.markAsRead
);
router.patch('/notifications/read-all', dashboardController.markAllAsRead);

export default router;
