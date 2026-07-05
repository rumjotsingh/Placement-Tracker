import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, XCircle, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { interviewApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { FormDialog } from '@/components/shared/FormDialog'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDateTime } from '@/lib/utils'

const INTERVIEW_RESULTS = ['Pending', 'Passed', 'Failed'] as const

export default function CoordinatorInterviewsPage() {
  const queryClient = useQueryClient()
  const [feedbackTarget, setFeedbackTarget] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [result, setResult] = useState<string>('Pending')

  const { data, isLoading } = useQuery({
    queryKey: ['interviews', 'coordinator'],
    queryFn: () => interviewApi.list().then((r) => r.data.data),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => interviewApi.cancel(id),
    onSuccess: () => {
      toast.success('Interview cancelled')
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
    onError: () => toast.error('Failed to cancel'),
  })

  const feedbackMutation = useMutation({
    mutationFn: () =>
      interviewApi.addFeedback(feedbackTarget!, { feedback, result: result !== 'Pending' ? result : undefined }),
    onSuccess: () => {
      toast.success('Feedback saved')
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      setFeedbackTarget(null)
      setFeedback('')
      setResult('Pending')
    },
    onError: () => toast.error('Failed to save feedback'),
  })

  const interviews = data?.items || []

  return (
    <div>
      <PageHeader
        title="Interview Management"
        description="View scheduled interviews, add feedback, and manage outcomes"
      />

      {isLoading ? (
        <TableSkeleton />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled"
          description="Schedule interviews from the Applications page or Drive Applicants view."
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview._id} className="hover:border-accent/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-accent/10 p-3">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {interview.application?.student?.name}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {interview.application?.drive?.company?.name} —{' '}
                        {interview.application?.drive?.jobRole}
                      </p>
                      <p className="text-sm mt-1">
                        {formatDateTime(interview.date)} · {interview.time}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{interview.mode}</Badge>
                        <Badge
                          variant={
                            interview.result === 'Passed'
                              ? 'success'
                              : interview.result === 'Failed'
                                ? 'danger'
                                : 'default'
                          }
                        >
                          {interview.result}
                        </Badge>
                      </div>
                      {interview.notes && (
                        <p className="text-text-secondary text-sm mt-2">{interview.notes}</p>
                      )}
                      {interview.feedback && (
                        <p className="text-sm mt-2 border-l-2 border-accent pl-3">
                          {interview.feedback}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {interview.meetingLink && (
                      <a href={interview.meetingLink} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline">
                          Join Link
                        </Button>
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFeedbackTarget(interview._id)
                        setFeedback(interview.feedback || '')
                        setResult(interview.result || 'Pending')
                      }}
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Feedback
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => cancelMutation.mutate(interview._id)}
                      disabled={cancelMutation.isPending}
                    >
                      <XCircle className="h-3.5 w-3.5" /> Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <FormDialog
        open={!!feedbackTarget}
        onOpenChange={(open) => !open && setFeedbackTarget(null)}
        title="Interview Feedback"
        description="Record interview outcome and notes for the candidate."
        submitLabel="Save Feedback"
        onSubmit={() => feedbackMutation.mutate()}
        loading={feedbackMutation.isPending}
        disabled={!feedback.trim()}
      >
        <div className="space-y-4">
          <div>
            <Label>Result</Label>
            <select
              className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            >
              {INTERVIEW_RESULTS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Feedback *</Label>
            <Textarea
              className="mt-1.5"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Interview performance notes..."
            />
          </div>
        </div>
      </FormDialog>
    </div>
  )
}
