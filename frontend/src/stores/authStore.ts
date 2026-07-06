import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types'
import { AUTH_STORAGE_KEY, isTokenExpired } from '@/lib/auth'

interface AuthState {
  user: User | null
  token: string | null
  hasHydrated: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hasHydrated: false,
      setAuth: (user, token) => set({ user, token }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => {
        const token = get().token
        return !!token && !isTokenExpired(token)
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          useAuthStore.setState({ user: null, token: null })
        }
        useAuthStore.setState({ hasHydrated: true })
      },
    }
  )
)

// Fallback if rehydration callback does not run (e.g. empty storage)
if (typeof window !== 'undefined') {
  useAuthStore.persist.onFinishHydration(() => {
    const { token, logout, hasHydrated } = useAuthStore.getState()
    if (token && isTokenExpired(token)) logout()
    if (!hasHydrated) useAuthStore.setState({ hasHydrated: true })
  })

  queueMicrotask(() => {
    if (useAuthStore.persist.hasHydrated() && !useAuthStore.getState().hasHydrated) {
      useAuthStore.setState({ hasHydrated: true })
    }
  })
}
