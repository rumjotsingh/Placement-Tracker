import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, FileText, Briefcase, Calendar, Trophy, Plus, Building2, Rocket } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { dashboardApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function CoordinatorDashboard() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'coordinator'],
    queryFn: () => dashboardApi.coordinator().then((r) => r.data.data),
  })

  if (isLoading) return <><PageHeader title="Coordinator Dashboard" /><DashboardSkeleton /></>

  const m = data?.metrics

  const quickActions = [
    {
      label: 'Add Company',
      description: 'Register a new recruiting partner',
      icon: Building2,
      onClick: () => navigate('/coordinator/companies?add=true'),
    },
    {
      label: 'Create Drive',
      description: 'Launch a new placement drive',
      icon: Rocket,
      onClick: () => navigate('/coordinator/drives?add=true'),
    },
    {
      label: 'View Students',
      description: 'Browse and manage students',
      icon: Users,
      onClick: () => navigate('/coordinator/students'),
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Coordinator Dashboard" description="Placement cell overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="Total Students" value={m?.totalStudents ?? 0} icon={Users} />
        <StatCard title="Applications" value={m?.totalApplications ?? 0} icon={FileText} />
        <StatCard title="Active Drives" value={m?.totalDrives ?? 0} icon={Briefcase} />
        <StatCard title="Interviews" value={m?.totalInterviews ?? 0} icon={Calendar} />
        <StatCard title="Selected" value={m?.selectedStudents ?? 0} icon={Trophy} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface/50 hover:border-accent/30 hover:bg-surface transition-all text-left group"
            >
              <div className="rounded-lg bg-accent/10 p-2.5 group-hover:bg-accent/20 transition-colors">
                <action.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5 text-accent" />
                  {action.label}
                </p>
                <p className="text-text-secondary text-xs mt-0.5">{action.description}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Branch-wise Selections</CardTitle></CardHeader>
          <CardContent>
            {data?.branchStats?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.branchStats.map((b) => ({ name: b._id || 'Unknown', count: b.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                  <XAxis dataKey="name" stroke="#8B949E" fontSize={11} />
                  <YAxis stroke="#8B949E" fontSize={12} />
                  <ChartTooltip variant="bar" />
                  <Bar dataKey="count" fill="#2EA043" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-text-secondary text-sm text-center py-8">No data yet</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Applications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.recentApplications?.slice(0, 6).map((app) => (
              <div key={app._id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <div>
                  <p className="font-medium text-sm">{app.student?.name}</p>
                  <p className="text-text-secondary text-xs">{app.drive?.company?.name} · {formatDate(app.createdAt)}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
            {!data?.recentApplications?.length && (
              <p className="text-text-secondary text-sm text-center py-8">No applications yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
