import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import companyRoutes from './companyRoutes.js';
import driveRoutes from './driveRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import codingRoutes from './codingRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import searchRoutes from './searchRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'PlaceTrack Pro API is running' });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/resumes', resumeRoutes);
router.use('/companies', companyRoutes);
router.use('/drives', driveRoutes);
router.use('/applications', applicationRoutes);
router.use('/interviews', interviewRoutes);
router.use('/coding', codingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/search', searchRoutes);

export default router;
