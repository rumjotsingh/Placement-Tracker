import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { Role } from '@/types'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirect = user.role === 'ADMIN' ? '/admin' : user.role === 'COORDINATOR' ? '/coordinator' : '/student'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated() && user) {
    const redirect = user.role === 'ADMIN' ? '/admin' : user.role === 'COORDINATOR' ? '/coordinator' : '/student'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
