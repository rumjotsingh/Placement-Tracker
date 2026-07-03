import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, User, Mail, Lock, Hash, GraduationCap, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/authStore'
import { BRANCHES } from '@/constants'

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
              Start your placement <br />
              <span className="gradient-accent">journey today</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-md">
              Create your account and get instant access to placement drives, coding profile tracking, and more.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                'Track applications across 500+ companies',
                'Sync GitHub, LeetCode & Codeforces profiles',
                'Get interview reminders and notifications',
                'Access analytics and progress insights',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                  </div>
                  <span className="text-text-secondary text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-text-secondary text-sm">
            © 2026 PlaceTrack Pro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
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
            <h2 className="text-3xl font-bold mb-2">Create your account</h2>
            <p className="text-text-secondary">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input id="name" placeholder="John Doe" className="pl-10 h-11" {...register('name')} />
              </div>
              {errors.name && <p className="text-danger text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input id="email" type="email" placeholder="you@college.edu" className="pl-10 h-11" {...register('email')} />
              </div>
              {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input id="rollNumber" placeholder="CS2024001" className="pl-10 h-11" {...register('rollNumber')} />
                </div>
                {errors.rollNumber && <p className="text-danger text-xs">{errors.rollNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary z-10" />
                  <select 
                    id="branch"
                    className="flex h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50" 
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
                  <Input id="graduationYear" type="number" className="pl-10 h-11" {...register('graduationYear')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11" {...register('password')} />
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

          <p className="mt-6 text-center text-text-secondary text-xs">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
