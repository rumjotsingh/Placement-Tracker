import api from './api'
import type {
  ApiResponse,
  User,
  StudentProfile,
  Resume,
  Company,
  PlacementDrive,
  Application,
  Interview,
  CodingStats,
  DSAProgress,
  Notification,
  StudentDashboard,
  CoordinatorDashboard,
  AdminDashboard,
  Paginated,
} from '@/types'

export const authApi = {
  register: (data: Record<string, unknown>) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  forgotPassword: (email: string) =>
    api.post<ApiResponse<{ message: string; resetToken?: string }>>('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) =>
    api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
}

export const profileApi = {
  getMyProfile: () => api.get<ApiResponse<StudentProfile>>('/profile/me'),
  updateProfile: (data: Partial<StudentProfile>) => api.put<ApiResponse<StudentProfile>>('/profile/me', data),
  uploadImage: (file: File) => {
    const form = new FormData()
    form.append('profileImage', file)
    return api.post<ApiResponse<StudentProfile>>('/profile/me/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const resumeApi = {
  getAll: () => api.get<ApiResponse<Resume[]>>('/resumes'),
  getActive: () => api.get<ApiResponse<Resume>>('/resumes/active'),
  upload: (file: File) => {
    const form = new FormData()
    form.append('resume', file)
    return api.post<ApiResponse<Resume>>('/resumes', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/resumes/${id}`),
}

export const companyApi = {
  list: (params?: Record<string, string>) =>
    api.get<ApiResponse<Paginated<Company>>>('/companies', { params }),
  get: (id: string) => api.get<ApiResponse<Company>>(`/companies/${id}`),
  create: (data: FormData) =>
    api.post<ApiResponse<Company>>('/companies', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Company>>(`/companies/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/companies/${id}`),
}

export const driveApi = {
  list: (params?: Record<string, string>) =>
    api.get<ApiResponse<Paginated<PlacementDrive>>>('/drives', { params }),
  get: (id: string) => api.get<ApiResponse<PlacementDrive>>(`/drives/${id}`),
  create: (data: Record<string, unknown>) => api.post<ApiResponse<PlacementDrive>>('/drives', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<PlacementDrive>>(`/drives/${id}`, data),
  close: (id: string) => api.patch<ApiResponse<PlacementDrive>>(`/drives/${id}/close`),
  getApplicants: (id: string, params?: Record<string, string>) =>
    api.get<ApiResponse<Paginated<Application>>>(`/drives/${id}/applicants`, { params }),
}

export const applicationApi = {
  getMy: (params?: Record<string, string>) =>
    api.get<ApiResponse<Paginated<Application>>>('/applications/my', { params }),
  apply: (driveId: string) =>
    api.post<ApiResponse<Application>>(`/applications/drives/${driveId}/apply`),
  withdraw: (id: string) =>
    api.patch<ApiResponse<{ message: string }>>(`/applications/${id}/withdraw`),
  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Application>>(`/applications/${id}/status`, { status }),
  list: (params?: Record<string, string>) =>
    api.get<ApiResponse<Paginated<Application>>>('/applications', { params }),
}

export const interviewApi = {
  list: (params?: Record<string, string>) =>
    api.get<ApiResponse<Paginated<Interview>>>('/interviews', { params }),
  schedule: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Interview>>('/interviews', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<Interview>>(`/interviews/${id}`, data),
  cancel: (id: string) => api.patch<ApiResponse<Interview>>(`/interviews/${id}/cancel`),
  addFeedback: (id: string, data: { feedback: string; result?: string }) =>
    api.patch<ApiResponse<Interview>>(`/interviews/${id}/feedback`, data),
}

export const codingApi = {
  getStats: () => api.get<ApiResponse<CodingStats>>('/coding/stats'),
  getDSA: () => api.get<ApiResponse<DSAProgress>>('/coding/dsa'),
  updateDSA: (data: Partial<DSAProgress>) => api.put<ApiResponse<DSAProgress>>('/coding/dsa', data),
  syncGitHub: () => api.post<ApiResponse<CodingStats>>('/coding/sync/github'),
  syncLeetCode: () => api.post<ApiResponse<CodingStats>>('/coding/sync/leetcode'),
  syncCodeforces: () => api.post<ApiResponse<CodingStats>>('/coding/sync/codeforces'),
  syncAll: () => api.post<ApiResponse<{ stats: CodingStats; errors: unknown[] }>>('/coding/sync/all'),
}

export const dashboardApi = {
  student: () => api.get<ApiResponse<StudentDashboard>>('/dashboard/student'),
  coordinator: () => api.get<ApiResponse<CoordinatorDashboard>>('/dashboard/coordinator'),
  admin: () => api.get<ApiResponse<AdminDashboard>>('/dashboard/admin'),
}

export const notificationApi = {
  list: (params?: Record<string, string>) =>
    api.get<ApiResponse<Paginated<Notification>>>('/dashboard/notifications', { params }),
  unreadCount: () => api.get<ApiResponse<{ count: number }>>('/dashboard/notifications/unread-count'),
  markRead: (id: string) =>
    api.patch<ApiResponse<Notification>>(`/dashboard/notifications/${id}/read`),
  markAllRead: () => api.patch<ApiResponse<null>>('/dashboard/notifications/read-all'),
}

export const searchApi = {
  students: (params?: Record<string, string>) =>
    api.get<ApiResponse<Paginated<User>>>('/search/students', { params }),
}
