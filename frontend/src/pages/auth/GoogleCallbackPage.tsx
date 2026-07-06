import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services'
import { getDashboardPath } from '@/lib/auth'

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    const role = searchParams.get('role')
    const error = searchParams.get('error')

    if (error) {
      toast.error(error)
      navigate('/login', { replace: true })
      return
    }

    if (!token) {
      toast.error('Google sign-in failed. Missing token.')
      navigate('/login', { replace: true })
      return
    }

    const completeLogin = async () => {
      try {
        useAuthStore.setState({ token })
        const res = await authApi.getMe()
        const user = res.data.data
        setAuth(user, token)
        toast.success('Signed in with Google!')

        const redirect =
          role === 'ADMIN' || user.role === 'ADMIN'
            ? getDashboardPath('ADMIN')
            : role === 'COORDINATOR' || user.role === 'COORDINATOR'
              ? getDashboardPath('COORDINATOR')
              : getDashboardPath('STUDENT')

        navigate(redirect, { replace: true })
      } catch {
        useAuthStore.getState().logout()
        toast.error('Failed to complete Google sign-in')
        navigate('/login', { replace: true })
      }
    }

    completeLogin()
  }, [navigate, searchParams, setAuth])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
      <p className="text-text-secondary">Completing Google sign-in...</p>
    </div>
  )
}
