import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/authStore'
import { BRANCHES } from '@/constants'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
  rollNumber: z.string().min(1, 'Roll number required'),
  branch: z.string().min(1, 'Branch required'),
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg glass-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-accent">PlaceTrack Pro</Link>
          <p className="text-text-secondary mt-2">Create your student account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Full Name</Label>
              <Input className="mt-1.5" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="col-span-2">
              <Label>Email</Label>
              <Input type="email" className="mt-1.5" placeholder="you@college.edu" {...register('email')} />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Roll Number</Label>
              <Input className="mt-1.5" placeholder="CS2024001" {...register('rollNumber')} />
              {errors.rollNumber && <p className="text-danger text-xs mt-1">{errors.rollNumber.message}</p>}
            </div>
            <div>
              <Label>Branch</Label>
              <select className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm" {...register('branch')}>
                <option value="">Select branch</option>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.branch && <p className="text-danger text-xs mt-1">{errors.branch.message}</p>}
            </div>
            <div>
              <Label>Graduation Year</Label>
              <Input type="number" className="mt-1.5" {...register('graduationYear')} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" className="mt-1.5" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
