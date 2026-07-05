import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, ArrowLeft, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/authStore'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'

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
      const redirect = user.role === 'ADMIN' ? '/admin' : user.role === 'COORDINATOR' ? '/coordinator' : '/student'
      navigate(redirect)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-background" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold">PlaceTrack<span className="text-accent">Pro</span></span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Track your placement <br />
              <span className="gradient-accent">journey seamlessly</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-md">
              Join thousands of students managing their applications, interviews, and coding profiles in one place.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {['RS', 'PK', 'AM', 'VS'].map((initials, i) => (
                  <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-accent/80 to-accent-hover border-2 border-background flex items-center justify-center text-white text-xs font-medium">
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">10,000+</span> students already onboard
              </p>
            </div>
          </div>

          <p className="text-text-secondary text-sm">
            © 2026 PlaceTrack Pro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold">PlaceTrack<span className="text-accent">Pro</span></span>
          </Link>

          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-text-secondary">Sign in with Google or use your email and password</p>
          </div>

          <GoogleLoginButton className="mb-6" />

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-text-secondary">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@college.edu" 
                  className="pl-10 h-12" 
                  {...register('email')} 
                />
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
                  className="pl-10 pr-10 h-12"
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
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent font-medium hover:underline">Create account</Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-text-secondary text-xs text-center">
              Demo Accounts:
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
              <code className="px-2 py-1 rounded bg-surface text-text-secondary">admin@placetrack.edu / admin123</code>
              <code className="px-2 py-1 rounded bg-surface text-text-secondary">coordinator@placetrack.edu / coord123</code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
