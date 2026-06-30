import { Router } from 'express';
import * as codingController from '../controllers/codingController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { dsaUpdateValidator } from '../validators/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate, authorize(ROLES.STUDENT));

router.get('/stats', codingController.getStats);
router.get('/dsa', codingController.getDSAProgress);
router.put('/dsa', dsaUpdateValidator, validate, codingController.updateDSAProgress);
router.post('/sync/github', codingController.syncGitHub);
router.post('/sync/leetcode', codingController.syncLeetCode);
router.post('/sync/codeforces', codingController.syncCodeforces);
router.post('/sync/all', codingController.syncAll);

export default router;
