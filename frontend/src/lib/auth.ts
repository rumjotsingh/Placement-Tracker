import type { Role } from '@/types'

export const AUTH_STORAGE_KEY = 'placetrack-auth'

export function getDashboardPath(role: Role): string {
  if (role === 'ADMIN') return '/admin'
  if (role === 'COORDINATOR') return '/coordinator'
  return '/student'
}

interface JwtPayload {
  role?: Role
  exp?: number
}

export function getRoleFromToken(token: string): Role | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload
    if (payload.role === 'ADMIN' || payload.role === 'COORDINATOR' || payload.role === 'STUDENT') {
      return payload.role
    }
    return null
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

/** Where to send an authenticated user (token valid). */
export function getAuthenticatedHomePath(
  token: string | null,
  user: { role: Role } | null
): string | null {
  if (!token || isTokenExpired(token)) return null
  if (user) return getDashboardPath(user.role)
  const role = getRoleFromToken(token)
  return role ? getDashboardPath(role) : null
}
