import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ProtectedRoute, PublicRoute } from '@/components/shared/ProtectedRoute'
import { StudentLayout, CoordinatorLayout, AdminLayout } from '@/layouts/DashboardLayout'

import LandingPage from '@/pages/public/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

import StudentDashboard from '@/pages/student/StudentDashboard'
import ProfilePage from '@/pages/student/ProfilePage'
import ApplicationsPage from '@/pages/student/ApplicationsPage'
import DrivesPage from '@/pages/student/DrivesPage'
import CodingProfilesPage from '@/pages/student/CodingProfilesPage'
import DSATrackerPage from '@/pages/student/DSATrackerPage'
import ResumeVaultPage from '@/pages/student/ResumeVaultPage'
import InterviewsPage from '@/pages/student/InterviewsPage'
import NotificationsPage from '@/pages/student/NotificationsPage'
import SettingsPage from '@/pages/student/SettingsPage'

import CoordinatorDashboard from '@/pages/coordinator/CoordinatorDashboard'
import CompaniesPage from '@/pages/coordinator/CompaniesPage'
import CoordinatorDrivesPage from '@/pages/coordinator/DrivesPage'
import StudentsPage from '@/pages/coordinator/StudentsPage'

import AdminDashboard from '@/pages/admin/AdminDashboard'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="drives" element={<DrivesPage />} />
              <Route path="coding" element={<CodingProfilesPage />} />
              <Route path="dsa" element={<DSATrackerPage />} />
              <Route path="resume" element={<ResumeVaultPage />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']} />}>
            <Route path="/coordinator" element={<CoordinatorLayout />}>
              <Route index element={<CoordinatorDashboard />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="drives" element={<CoordinatorDrivesPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="users" element={<StudentsPage />} />
              <Route path="analytics" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="top-right" richColors />
    </QueryClientProvider>
  )
}
