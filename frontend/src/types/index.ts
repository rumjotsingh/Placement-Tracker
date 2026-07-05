export type Role = 'STUDENT' | 'COORDINATOR' | 'ADMIN'

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  rollNumber?: string
  branch?: string
  graduationYear?: number
  isActive: boolean
  createdAt: string
}

export interface ApiResponse<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}

export interface Paginated<T> {
  items: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface Project {
  _id?: string
  title: string
  description?: string
  technologies?: string[]
  link?: string
}

export interface StudentProfile {
  _id: string
  user: User
  cgpa?: number
  phone?: string
  skills: string[]
  certifications: string[]
  projects: Project[]
  githubUsername?: string
  leetcodeUsername?: string
  codeforcesUsername?: string
  codechefUsername?: string
  geeksforgeeksUsername?: string
  profileImage?: string
  portfolioSlug?: string
}

export interface Resume {
  _id: string
  url: string
  version: number
  fileName?: string
  isActive: boolean
  createdAt: string
}

export interface Company {
  _id: string
  name: string
  website?: string
  logo?: string
  industry?: string
  description?: string
  location?: string
  isActive: boolean
}

export interface PlacementDrive {
  _id: string
  company: Company
  jobRole: string
  package: string
  jobType: string
  location?: string
  eligibilityCriteria: {
    minCgpa: number
    eligibleBranches: string[]
  }
  description?: string
  deadline: string
  driveDate: string
  status: 'OPEN' | 'CLOSED'
  createdAt: string
}

export interface DriveEligibility {
  eligible: boolean
  reasons: string[]
  student?: {
    cgpa: number | null
    branch: string | null
    hasResume: boolean
  }
}

export interface Application {
  _id: string
  student: User
  drive: PlacementDrive
  status: string
  withdrawn: boolean
  statusHistory?: { status: string; changedAt: string; changedBy?: string }[]
  createdAt: string
  updatedAt: string
}

export interface Interview {
  _id: string
  application: Application
  date: string
  time: string
  mode: 'Online' | 'Offline'
  meetingLink?: string
  notes?: string
  result: string
  feedback?: string
  cancelled: boolean
}

export interface CodingStats {
  github: {
    publicRepos: number
    followers: number
    following: number
    stars: number
    contributions: number
  }
  leetcode: {
    easySolved: number
    mediumSolved: number
    hardSolved: number
    totalSolved: number
    contestRating: number
  }
  codeforces: {
    rating: number
    rank: string
    maxRating: number
    maxRank?: string
    contests: number
    totalSolved: number
    easySolved: number
    mediumSolved: number
    hardSolved: number
  }
  codechef?: {
    rating: number
    maxRating: number
    globalRank: number
    countryRank: number
    stars: string
    name?: string
    countryName?: string
    problemsSolved: number
    contests: number
  }
  geeksforgeeks?: {
    totalSolved: number
    codingScore: number
    monthlyScore: number
    instituteRank: number
    easySolved: number
    mediumSolved: number
    hardSolved: number
    schoolSolved: number
    basicSolved: number
    currentStreak: number
    maxStreak: number
  }
  lastSyncedAt?: string
}

export interface DSAProgress {
  easy: number
  medium: number
  hard: number
  weeklyGrowth: { week: string; easy: number; medium: number; hard: number }[]
  monthlyGrowth: { month: string; easy: number; medium: number; hard: number }[]
}

export interface Notification {
  _id: string
  type: string
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

export interface StudentDashboard {
  cards: {
    totalApplications: number
    interviewsScheduled: number
    offersReceived: number
    activeDrives: number
    leetcodeSolved: number
    githubRepos: number
    codeforcesRating: number
  }
  upcomingInterviews: Interview[]
  recentApplications: Application[]
  codingStats?: CodingStats
}

export interface CoordinatorDashboard {
  metrics: {
    totalStudents: number
    totalDrives: number
    totalApplications: number
    totalInterviews: number
    selectedStudents: number
  }
  recentApplications: Application[]
  upcomingDrives: PlacementDrive[]
  branchStats: { _id: string; count: number }[]
}

export interface AdminDashboard {
  metrics: {
    totalUsers: number
    totalStudents: number
    totalCompanies: number
    totalDrives: number
    totalOffers: number
    placementRate: number
  }
  analytics: {
    branchPlacements: { _id: string; count: number }[]
    companySelections: { _id: string; count: number }[]
    packageDistribution: { _id: string; count: number }[]
  }
}
