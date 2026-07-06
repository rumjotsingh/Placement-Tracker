import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, User, Mail, Lock, Hash, GraduationCap, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/authStore'
import { BRANCHES } from '@/constants'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { AuthLayout } from '@/components/auth/AuthLayout'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  branch: z.string().min(1, 'Please select your branch'),
  graduationYear: z.coerce.number().min(2020).max(2035),
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { graduationYear: 2026 },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await authApi.register(data)
      const { user, token } = res.data.data
      setAuth(user, token)
      toast.success('Account created successfully!')
      navigate('/student')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up with Google or fill in your details"
      sideTitle="Start your placement journey today"
      sideDescription="Create your account and get instant access to drives, coding profile tracking, and interview tools."
      sideFooter={
        <ul className="space-y-3 pt-2">
          {[
            'Track applications across 500+ companies',
            'Sync GitHub, LeetCode & Codeforces profiles',
            'Interview reminders and notifications',
            'Analytics and progress insights',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      }
    >
      <GoogleLoginButton label="Sign up with Google" className="mb-6" />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-background px-2 text-text-secondary">Or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input id="name" placeholder="John Doe" className="pl-10 h-11 bg-card" {...register('name')} />
          </div>
          {errors.name && <p className="text-danger text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input id="email" type="email" placeholder="you@college.edu" className="pl-10 h-11 bg-card" {...register('email')} />
          </div>
          {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input id="rollNumber" placeholder="CS2024001" className="pl-10 h-11 bg-card" {...register('rollNumber')} />
            </div>
            {errors.rollNumber && <p className="text-danger text-xs">{errors.rollNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary z-10" />
              <select
                id="branch"
                className="flex h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                {...register('branch')}
              >
                <option value="">Select</option>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {errors.branch && <p className="text-danger text-xs">{errors.branch.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input id="graduationYear" type="number" className="pl-10 h-11 bg-card" {...register('graduationYear')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11 bg-card" {...register('password')} />
            </div>
            {errors.password && <p className="text-danger text-xs">{errors.password.message}</p>}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-text-secondary text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
