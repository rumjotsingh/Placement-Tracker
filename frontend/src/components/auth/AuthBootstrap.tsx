import { useEffect, type ReactNode } from 'react'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/authStore'
import { isTokenExpired } from '@/lib/auth'

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const { token, user, setUser, logout, hasHydrated } = useAuthStore()

  useEffect(() => {
    if (!hasHydrated) return

    if (!token || isTokenExpired(token)) {
      if (token) logout()
      return
    }

    if (user) return

    let cancelled = false

    authApi
      .getMe()
      .then((res) => {
        if (!cancelled) setUser(res.data.data)
      })
      .catch(() => {
        if (!cancelled) logout()
      })

    return () => {
      cancelled = true
    }
  }, [hasHydrated, token, user, setUser, logout])

  return <>{children}</>
}
