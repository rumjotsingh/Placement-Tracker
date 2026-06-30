import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

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
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_50%)] opacity-5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-accent">PlaceTrack Pro</Link>
          <p className="text-text-secondary mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@college.edu" className="mt-1.5" {...register('email')} />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1.5">
              <Input id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" {...register('password')} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent hover:underline">Create account</Link>
        </p>
      </motion.div>
    </div>
  )
}
