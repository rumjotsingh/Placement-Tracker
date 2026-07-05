import { APPLICATION_STATUS } from '@/constants'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = Object.values(APPLICATION_STATUS)

interface StatusSelectProps {
  value: string
  onChange: (status: string) => void
  disabled?: boolean
  className?: string
}

export function StatusSelect({ value, onChange, disabled, className }: StatusSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-8 rounded-md border border-border bg-surface px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        className
      )}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}
