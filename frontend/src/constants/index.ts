export const ROLES = {
  STUDENT: 'STUDENT',
  COORDINATOR: 'COORDINATOR',
  ADMIN: 'ADMIN',
} as const

export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  OA_SCHEDULED: 'Online Assessment Scheduled',
  OA_CLEARED: 'Online Assessment Cleared',
  INTERVIEW_1: 'Interview Round 1',
  INTERVIEW_2: 'Interview Round 2',
  HR_ROUND: 'HR Round',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
} as const

export const STATUS_COLORS: Record<string, string> = {
  Applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Shortlisted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Online Assessment Scheduled': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Online Assessment Cleared': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Interview Round 1': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Interview Round 2': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'HR Round': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Selected: 'bg-accent/10 text-accent border-accent/20',
  Rejected: 'bg-danger/10 text-danger border-danger/20',
}

export const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'AI/ML', 'DS'] as const
