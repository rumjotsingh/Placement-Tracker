import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/authStore'
import { getDashboardPath } from '@/lib/auth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { AuthLayout } from '@/components/auth/AuthLayout'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) toast.error(error)
  }, [searchParams])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await authApi.login(data)
      const { user, token } = res.data.data
      setAuth(user, token)
      toast.success('Welcome back!')
      navigate(getDashboardPath(user.role))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with Google or use your email and password"
      sideTitle="Track your placement journey seamlessly"
      sideDescription="Join thousands of students managing applications, interviews, and coding profiles in one workspace."
      sideFooter={
        <div className="flex items-center gap-4 pt-2">
          <div className="flex -space-x-2">
            {['RS', 'PK', 'AM', 'VS'].map((initials) => (
              <div
                key={initials}
                className="h-9 w-9 rounded-full bg-accent text-white border-2 border-surface flex items-center justify-center text-xs font-medium"
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">10,000+</span> students onboard
          </p>
        </div>
      }
    >
      <GoogleLoginButton className="mb-6" />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-background px-2 text-text-secondary">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input id="email" type="email" placeholder="you@college.edu" className="pl-10 h-12 bg-card" {...register('email')} />
          </div>
          {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              id="password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10 h-12 bg-card"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-danger text-xs">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-text-secondary text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-accent font-medium hover:underline">Create account</Link>
        </p>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-text-secondary text-xs text-center">Demo accounts</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
          <code className="px-2 py-1 rounded-lg bg-surface border border-border text-text-secondary">admin@placetrack.edu / admin123</code>
          <code className="px-2 py-1 rounded-lg bg-surface border border-border text-text-secondary">coordinator@placetrack.edu / coord123</code>
        </div>
      </div>
    </AuthLayout>
  )
}
