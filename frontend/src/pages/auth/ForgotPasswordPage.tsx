import { useState } from 'react'
import { Link } from 'react-router-dom'
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

const schema = z.object({ email: z.string().email() })

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true)
    try {
      await authApi.forgotPassword(data.email)
      setSent(true)
      toast.success('Reset instructions sent!')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-accent">PlaceTrack Pro</Link>
          <p className="text-text-secondary mt-2">Reset your password</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-text-secondary">If that email exists, reset instructions have been sent.</p>
            <Link to="/login"><Button variant="outline" className="w-full">Back to Sign In</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" className="mt-1.5" placeholder="you@college.edu" {...register('email')} />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
