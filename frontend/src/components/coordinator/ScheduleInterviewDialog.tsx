import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { interviewApi } from '@/services'
import type { Application } from '@/types'
import { FormDialog } from '@/components/shared/FormDialog'
import { DatePicker, dateToDriveISO } from '@/components/shared/DateTimePicker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const INTERVIEW_MODES = ['Online', 'Offline'] as const

interface ScheduleInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: Application | null
}

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  application,
}: ScheduleInterviewDialogProps) {
  const queryClient = useQueryClient()
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState('10:00')
  const [mode, setMode] = useState<string>('Online')
  const [meetingLink, setMeetingLink] = useState('')
  const [notes, setNotes] = useState('')

  const reset = () => {
    setDate(undefined)
    setTime('10:00')
    setMode('Online')
    setMeetingLink('')
    setNotes('')
  }

  const scheduleMutation = useMutation({
    mutationFn: () => {
      const isoDate = dateToDriveISO(date)
      if (!isoDate || !application) throw new Error('Missing fields')
      return interviewApi.schedule({
        application: application._id,
        date: isoDate,
        time,
        mode,
        meetingLink: meetingLink || undefined,
        notes: notes || undefined,
      })
    },
    onSuccess: () => {
      toast.success('Interview scheduled!')
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['drive-applicants'] })
      onOpenChange(false)
      reset()
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to schedule interview'
      toast.error(msg)
    },
  })

  const canSubmit = !!application && !!date && !!time && !!mode

  return (
    <FormDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
      title="Schedule Interview"
      description={
        application
          ? `${application.student?.name} — ${application.drive?.company?.name} (${application.drive?.jobRole})`
          : undefined
      }
      submitLabel="Schedule"
      onSubmit={() => scheduleMutation.mutate()}
      loading={scheduleMutation.isPending}
      disabled={!canSubmit}
    >
      <div className="space-y-4">
        <DatePicker
          label="Interview Date"
          date={date}
          onDateChange={setDate}
          minDate={new Date()}
          required
        />

        <div>
          <Label>Time *</Label>
          <Input
            type="time"
            className="mt-1.5"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div>
          <Label>Mode *</Label>
          <select
            className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {INTERVIEW_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {mode === 'Online' && (
          <div>
            <Label>Meeting Link</Label>
            <Input
              placeholder="https://meet.google.com/..."
              className="mt-1.5"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
        )}

        <div>
          <Label>Notes</Label>
          <Textarea
            placeholder="Instructions for the candidate..."
            className="mt-1.5"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </FormDialog>
  )
}
