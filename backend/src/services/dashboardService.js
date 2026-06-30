import User from '../models/User.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import CodingStats from '../models/CodingStats.js';
import { APPLICATION_STATUS, DRIVE_STATUS, ROLES } from '../constants/index.js';
import { getUpcomingInterviews } from './interviewService.js';

export const getStudentDashboard = async (userId) => {
  const [
    totalApplications,
    interviewsScheduled,
    offersReceived,
    activeDrives,
    codingStats,
    upcomingInterviews,
    recentApplications,
  ] = await Promise.all([
    Application.countDocuments({ student: userId, withdrawn: false }),
    Interview.countDocuments({
      cancelled: false,
      application: {
        $in: (await Application.find({ student: userId }).select('_id')).map((a) => a._id),
      },
    }),
    Application.countDocuments({
      student: userId,
      status: APPLICATION_STATUS.SELECTED,
      withdrawn: false,
    }),
    PlacementDrive.countDocuments({ status: DRIVE_STATUS.OPEN, deadline: { $gte: new Date() } }),
    CodingStats.findOne({ user: userId }),
    getUpcomingInterviews(userId, 5),
    Application.find({ student: userId, withdrawn: false })
      .populate({ path: 'drive', populate: { path: 'company', select: 'name logo' } })
      .sort({ updatedAt: -1 })
      .limit(5),
  ]);

  return {
    cards: {
      totalApplications,
      interviewsScheduled,
      offersReceived,
      activeDrives,
      leetcodeSolved: codingStats?.leetcode?.totalSolved || 0,
      githubRepos: codingStats?.github?.publicRepos || 0,
      codeforcesRating: codingStats?.codeforces?.rating || 0,
    },
    upcomingInterviews,
    recentApplications,
    codingStats,
  };
};

export const getCoordinatorDashboard = async () => {
  const [
    totalStudents,
    totalDrives,
    totalApplications,
    totalInterviews,
    selectedStudents,
    recentApplications,
    upcomingDrives,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.STUDENT, isActive: true }),
    PlacementDrive.countDocuments(),
    Application.countDocuments({ withdrawn: false }),
    Interview.countDocuments({ cancelled: false }),
    Application.countDocuments({ status: APPLICATION_STATUS.SELECTED, withdrawn: false }),
    Application.find({ withdrawn: false })
      .populate('student', 'name email rollNumber branch')
      .populate({ path: 'drive', populate: { path: 'company', select: 'name' } })
      .sort({ createdAt: -1 })
      .limit(10),
    PlacementDrive.find({ status: DRIVE_STATUS.OPEN, driveDate: { $gte: new Date() } })
      .populate('company', 'name logo')
      .sort({ driveDate: 1 })
      .limit(5),
  ]);

  const branchStats = await Application.aggregate([
    { $match: { status: APPLICATION_STATUS.SELECTED, withdrawn: false } },
    {
      $lookup: {
        from: 'users',
        localField: 'student',
        foreignField: '_id',
        as: 'studentData',
      },
    },
    { $unwind: '$studentData' },
    { $group: { _id: '$studentData.branch', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return {
    metrics: {
      totalStudents,
      totalDrives,
      totalApplications,
      totalInterviews,
      selectedStudents,
    },
    recentApplications,
    upcomingDrives,
    branchStats,
  };
};

export const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalStudents,
    totalCompanies,
    totalDrives,
    totalOffers,
    branchPlacements,
    companySelections,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: ROLES.STUDENT, isActive: true }),
    Company.countDocuments({ isActive: true }),
    PlacementDrive.countDocuments(),
    Application.countDocuments({ status: APPLICATION_STATUS.SELECTED, withdrawn: false }),
    Application.aggregate([
      { $match: { status: APPLICATION_STATUS.SELECTED, withdrawn: false } },
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData',
        },
      },
      { $unwind: '$studentData' },
      { $group: { _id: '$studentData.branch', count: { $sum: 1 } } },
    ]),
    Application.aggregate([
      { $match: { status: APPLICATION_STATUS.SELECTED, withdrawn: false } },
      {
        $lookup: {
          from: 'placementdrives',
          localField: 'drive',
          foreignField: '_id',
          as: 'driveData',
        },
      },
      { $unwind: '$driveData' },
      {
        $lookup: {
          from: 'companies',
          localField: 'driveData.company',
          foreignField: '_id',
          as: 'companyData',
        },
      },
      { $unwind: '$companyData' },
      { $group: { _id: '$companyData.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const totalApplied = await Application.countDocuments({ withdrawn: false });
  const placementRate = totalApplied > 0 ? ((totalOffers / totalApplied) * 100).toFixed(2) : 0;

  const packageDistribution = await PlacementDrive.aggregate([
    { $group: { _id: '$package', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return {
    metrics: {
      totalUsers,
      totalStudents,
      totalCompanies,
      totalDrives,
      totalOffers,
      placementRate: Number(placementRate),
    },
    analytics: {
      branchPlacements,
      companySelections,
      packageDistribution,
    },
  };
};
