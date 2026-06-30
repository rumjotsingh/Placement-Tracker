import { useQuery } from '@tanstack/react-query'
import { Users, FileText, Briefcase, Calendar, Trophy } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function CoordinatorDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'coordinator'],
    queryFn: () => dashboardApi.coordinator().then((r) => r.data.data),
  })

  if (isLoading) return <><PageHeader title="Coordinator Dashboard" /><DashboardSkeleton /></>

  const m = data?.metrics

  return (
    <div>
      <PageHeader title="Coordinator Dashboard" description="Placement cell overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Students" value={m?.totalStudents ?? 0} icon={Users} />
        <StatCard title="Applications" value={m?.totalApplications ?? 0} icon={FileText} />
        <StatCard title="Active Drives" value={m?.totalDrives ?? 0} icon={Briefcase} />
        <StatCard title="Interviews" value={m?.totalInterviews ?? 0} icon={Calendar} />
        <StatCard title="Selected" value={m?.selectedStudents ?? 0} icon={Trophy} />
      </div>

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
                  <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8 }} />
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
