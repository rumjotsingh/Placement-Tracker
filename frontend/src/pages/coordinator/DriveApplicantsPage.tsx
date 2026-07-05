import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { toast } from 'sonner'
import { driveApi, applicationApi } from '@/services'
import type { Application } from '@/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusSelect } from '@/components/shared/StatusSelect'
import { ScheduleInterviewDialog } from '@/components/coordinator/ScheduleInterviewDialog'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'

export default function DriveApplicantsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const portalBase = location.pathname.startsWith('/admin') ? '/admin' : '/coordinator'
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [scheduleApp, setScheduleApp] = useState<Application | null>(null)

  const { data: drive } = useQuery({
    queryKey: ['drive', id],
    queryFn: () => driveApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['drive-applicants', id, statusFilter, branchFilter],
    queryFn: () =>
      driveApi
        .getApplicants(id!, {
          ...(statusFilter && { status: statusFilter }),
          ...(branchFilter && { branch: branchFilter }),
        })
        .then((r) => r.data.data),
    enabled: !!id,
  })

  const statusMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: string }) =>
      applicationApi.updateStatus(appId, status),
    onSuccess: () => {
      toast.success('Status updated')
      queryClient.invalidateQueries({ queryKey: ['drive-applicants', id] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: () => toast.error('Failed to update status'),
  })

  const applicants = data?.items || []

  return (
    <div>
      <Button variant="ghost" className="mb-4 -ml-2" onClick={() => navigate(`${portalBase}/drives`)}>
        <ArrowLeft className="h-4 w-4" /> Back to Drives
      </Button>

      <PageHeader
        title={drive ? `${drive.company?.name} — ${drive.jobRole}` : 'Drive Applicants'}
        description={`${applicants.length} applicant${applicants.length !== 1 ? 's' : ''} · Package: ${drive?.package || '—'}`}
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Filter by branch..."
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="max-w-[160px]"
        />
        <select
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {[
            'Applied',
            'Shortlisted',
            'Online Assessment Scheduled',
            'Online Assessment Cleared',
            'Interview Round 1',
            'Interview Round 2',
            'HR Round',
            'Selected',
            'Rejected',
          ].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : applicants.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-text-secondary">
            No applicants yet for this drive.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Student', 'Roll No', 'Branch', 'Applied', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left p-4 text-text-secondary font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app._id} className="border-b border-border hover:bg-surface/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-text-secondary" />
                        <div>
                          <p className="font-medium">{app.student?.name}</p>
                          <p className="text-text-secondary text-xs">{app.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">{app.student?.rollNumber || '—'}</td>
                    <td className="p-4 text-text-secondary">{app.student?.branch || '—'}</td>
                    <td className="p-4 text-text-secondary">{formatDate(app.createdAt)}</td>
                    <td className="p-4">
                      <StatusSelect
                        value={app.status}
                        onChange={(status) =>
                          statusMutation.mutate({ appId: app._id, status })
                        }
                        disabled={statusMutation.isPending}
                      />
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setScheduleApp(app)}
                      >
                        <Calendar className="h-3.5 w-3.5" /> Schedule
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <ScheduleInterviewDialog
        open={!!scheduleApp}
        onOpenChange={(open) => !open && setScheduleApp(null)}
        application={scheduleApp}
      />
    </div>
  )
}
