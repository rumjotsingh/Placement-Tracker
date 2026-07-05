import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Search } from 'lucide-react'
import { toast } from 'sonner'
import { applicationApi, driveApi } from '@/services'
import type { Application } from '@/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusSelect } from '@/components/shared/StatusSelect'
import { ScheduleInterviewDialog } from '@/components/coordinator/ScheduleInterviewDialog'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

export default function CoordinatorApplicationsPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [driveFilter, setDriveFilter] = useState('')
  const [scheduleApp, setScheduleApp] = useState<Application | null>(null)

  const { data: drives } = useQuery({
    queryKey: ['drives', 'all'],
    queryFn: () => driveApi.list().then((r) => r.data.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['applications', 'coordinator', statusFilter, driveFilter],
    queryFn: () =>
      applicationApi
        .list({
          ...(statusFilter && { status: statusFilter }),
          ...(driveFilter && { drive: driveFilter }),
        })
        .then((r) => r.data.data),
  })

  const statusMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: string }) =>
      applicationApi.updateStatus(appId, status),
    onSuccess: () => {
      toast.success('Status updated')
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: () => toast.error('Failed to update status'),
  })

  const apps = data?.items || []
  const driveList = drives?.items || []

  return (
    <div>
      <PageHeader
        title="Application Tracker"
        description="Review all student applications, update status, and schedule interviews"
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm min-w-[200px]"
          value={driveFilter}
          onChange={(e) => setDriveFilter(e.target.value)}
        >
          <option value="">All drives</option>
          {driveList.map((d) => (
            <option key={d._id} value={d._id}>
              {d.company?.name} — {d.jobRole}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {[
            'Applied',
            'Shortlisted',
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
      ) : apps.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No applications found"
          description="Applications will appear here when students apply to drives."
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Student', 'Company', 'Role', 'Package', 'Applied', 'Status', 'Actions'].map(
                    (h) => (
                      <th key={h} className="text-left p-4 text-text-secondary font-medium">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app._id} className="border-b border-border hover:bg-surface/50">
                    <td className="p-4">
                      <p className="font-medium">{app.student?.name}</p>
                      <p className="text-text-secondary text-xs">
                        {app.student?.rollNumber} · {app.student?.branch}
                      </p>
                    </td>
                    <td className="p-4">{app.drive?.company?.name}</td>
                    <td className="p-4 text-text-secondary">{app.drive?.jobRole}</td>
                    <td className="p-4 text-accent font-medium">{app.drive?.package}</td>
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
                      <Button size="sm" variant="outline" onClick={() => setScheduleApp(app)}>
                        <Calendar className="h-3.5 w-3.5" /> Interview
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
