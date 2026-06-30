import { Badge } from '@/components/ui/badge'
import { STATUS_COLORS } from '@/constants'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn('border', STATUS_COLORS[status] || 'bg-surface text-text-secondary border-border', className)}
    >
      {status}
    </Badge>
  )
}
