import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Briefcase, Clock, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { applicationApi, interviewApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatDateTime } from '@/lib/utils'

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: app, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  const { data: interviews } = useQuery({
    queryKey: ['interviews', 'for-app', id],
    queryFn: () => interviewApi.list().then((r) => r.data.data),
    enabled: !!id,
  })

  const withdrawMutation = useMutation({
    mutationFn: () => applicationApi.withdraw(id!),
    onSuccess: () => {
      toast.success('Application withdrawn')
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      navigate('/student/applications')
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to withdraw'
      toast.error(msg)
    },
  })

  if (isLoading) return <DashboardSkeleton />

  if (!app) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary mb-4">Application not found</p>
        <Button variant="outline" onClick={() => navigate('/student/applications')}>
          Back
        </Button>
      </div>
    )
  }

  const linkedInterviews =
    interviews?.items?.filter((i) => i.application?._id === app._id) || []
  const history = app.statusHistory || [{ status: app.status, changedAt: app.createdAt }]

  return (
    <div>
      <Button variant="ghost" className="mb-4 -ml-2" onClick={() => navigate('/student/applications')}>
        <ArrowLeft className="h-4 w-4" /> Back to Applications
      </Button>

      <PageHeader
        title={`${app.drive?.company?.name} — ${app.drive?.jobRole}`}
        description={`Applied ${formatDate(app.createdAt)}`}
        action={
          !app.withdrawn && app.status === 'Applied' ? (
            <Button
              variant="destructive"
              onClick={() => withdrawMutation.mutate()}
              disabled={withdrawMutation.isPending}
            >
              <XCircle className="h-4 w-4" /> Withdraw
            </Button>
          ) : undefined
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{app.drive?.package}</p>
                    <p className="text-text-secondary">{app.drive?.company?.name}</p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
              {app.drive?.location && (
                <p className="text-text-secondary text-sm">{app.drive.location}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Status Timeline
              </h3>
              <div className="relative pl-6 border-l border-border space-y-4">
                {[...history].reverse().map((entry, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[25px] top-1 h-3 w-3 rounded-full bg-accent border-2 border-background" />
                    <p className="font-medium text-sm">{entry.status}</p>
                    <p className="text-text-secondary text-xs">
                      {formatDateTime(entry.changedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Interviews</h3>
              {linkedInterviews.length === 0 ? (
                <p className="text-text-secondary text-sm">
                  No interviews scheduled yet. You'll be notified when one is scheduled.
                </p>
              ) : (
                <div className="space-y-3">
                  {linkedInterviews.map((interview) => (
                    <div key={interview._id} className="p-3 rounded-lg bg-surface border border-border">
                      <p className="font-medium text-sm">
                        {formatDateTime(interview.date)} · {interview.time}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {interview.mode}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {interview.result}
                        </Badge>
                      </div>
                      {interview.meetingLink && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent text-xs mt-2 block hover:underline"
                        >
                          Join meeting
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
