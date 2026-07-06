import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/services'
import { AuthLayout } from '@/components/auth/AuthLayout'

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
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you instructions to recover your account"
      sideTitle="Secure account recovery"
      sideDescription="Enter the email linked to your account and we'll help you get back in safely."
    >
      {sent ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center space-y-4">
          <p className="text-text-secondary text-sm">
            If that email exists, reset instructions have been sent to your inbox.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">Back to sign in</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                id="email"
                type="email"
                className="pl-10 h-12 bg-card"
                placeholder="you@college.edu"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
