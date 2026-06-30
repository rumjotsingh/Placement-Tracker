import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'border-border bg-surface text-text-secondary': variant === 'default',
          'border-border bg-transparent text-text-secondary': variant === 'outline',
          'border-accent/20 bg-accent/10 text-accent': variant === 'success',
          'border-warning/20 bg-warning/10 text-warning': variant === 'warning',
          'border-danger/20 bg-danger/10 text-danger': variant === 'danger',
        },
        className
      )}
      {...props}
    />
  )
}
