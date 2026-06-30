import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { applicationApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ApplicationsPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['applications', 'my'],
    queryFn: () => applicationApi.getMy().then((r) => r.data.data),
  })

  const apps = data?.items || []

  return (
    <div>
      <PageHeader
        title="Application Tracker"
        description="Track all your placement applications"
        action={<Button onClick={() => navigate('/student/drives')}>Browse Drives</Button>}
      />

      {isLoading ? <TableSkeleton /> : apps.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Start applying to placement drives to track your progress here."
          action={{ label: 'Browse Drives', onClick: () => navigate('/student/drives') }}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Company', 'Role', 'Package', 'Applied', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left p-4 text-text-secondary font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app._id} className="border-b border-border hover:bg-surface/50 transition-colors">
                      <td className="p-4 font-medium">{app.drive?.company?.name}</td>
                      <td className="p-4 text-text-secondary">{app.drive?.jobRole}</td>
                      <td className="p-4 text-accent font-medium">{app.drive?.package}</td>
                      <td className="p-4 text-text-secondary">{formatDate(app.createdAt)}</td>
                      <td className="p-4"><StatusBadge status={app.status} /></td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
