import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  label: string
  date?: Date
  onDateChange: (date: Date | undefined) => void
  minDate?: Date
  required?: boolean
  error?: string
}

export function DatePicker({
  label,
  date,
  onDateChange,
  minDate,
  required,
  error,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Label>
        {label}
        {required && ' *'}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'mt-1.5 w-full justify-start text-left font-normal',
              !date && 'text-text-secondary'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              onDateChange(d)
              setOpen(false)
            }}
            disabled={minDate ? { before: minDate } : undefined}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  )
}

/** Deadline: end of selected day (23:59:59) */
export function dateToDeadlineISO(date: Date | undefined): string | undefined {
  if (!date) return undefined
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}

/** Drive date: start of selected day (00:00:00) */
export function dateToDriveISO(date: Date | undefined): string | undefined {
  if (!date) return undefined
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function isoToLocalDate(iso: string): Date {
  const d = new Date(iso)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
