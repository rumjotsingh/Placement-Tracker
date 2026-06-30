import { useQuery } from '@tanstack/react-query'
import { FileText, Trophy, Calendar, Briefcase, Code2, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { dashboardApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatDateTime } from '@/lib/utils'

const CHART_COLORS = ['#2EA043', '#238636', '#D29922', '#F85149', '#8B949E', '#58A6FF']

export default function StudentDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: () => dashboardApi.student().then((r) => r.data.data),
  })

  if (isLoading) return <><PageHeader title="Dashboard" description="Your placement overview" /><DashboardSkeleton /></>
  if (error) return <p className="text-danger">Failed to load dashboard</p>

  const cards = data?.cards
  const statusData = data?.recentApplications?.reduce((acc, app) => {
    const existing = acc.find((a) => a.name === app.status)
    if (existing) existing.value++
    else acc.push({ name: app.status, value: 1 })
    return acc
  }, [] as { name: string; value: number }[]) || []

  const codingData = [
    { name: 'Easy', value: data?.codingStats?.leetcode?.easySolved || 0 },
    { name: 'Medium', value: data?.codingStats?.leetcode?.mediumSolved || 0 },
    { name: 'Hard', value: data?.codingStats?.leetcode?.hardSolved || 0 },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" description="Your placement preparation overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="Applications" value={cards?.totalApplications ?? 0} icon={FileText} trend={12} />
        <StatCard title="Offers Received" value={cards?.offersReceived ?? 0} icon={Trophy} trend={cards?.offersReceived ? 100 : 0} />
        <StatCard title="Interviews" value={cards?.interviewsScheduled ?? 0} icon={Calendar} />
        <StatCard title="Active Drives" value={cards?.activeDrives ?? 0} icon={Briefcase} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="LeetCode Solved" value={cards?.leetcodeSolved ?? 0} icon={Code2} subtitle="Total problems" />
        <StatCard title="GitHub Repos" value={cards?.githubRepos ?? 0} icon={Code2} subtitle="Public repositories" />
        <StatCard title="Codeforces Rating" value={cards?.codeforcesRating ?? 0} icon={TrendingUp} subtitle="Current rating" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Application Status</CardTitle></CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                    {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-sm text-center py-8">No applications yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Coding Progress</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={codingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="name" stroke="#8B949E" fontSize={12} />
                <YAxis stroke="#8B949E" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8 }} />
                <Bar dataKey="value" fill="#2EA043" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Applications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.recentApplications?.length ? data.recentApplications.map((app) => (
              <div key={app._id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <div>
                  <p className="font-medium text-sm">{app.drive?.company?.name}</p>
                  <p className="text-text-secondary text-xs">{app.drive?.jobRole} · {formatDate(app.createdAt)}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            )) : (
              <p className="text-text-secondary text-sm text-center py-4">No applications yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Upcoming Interviews</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.upcomingInterviews?.length ? data.upcomingInterviews.map((interview) => (
              <div key={interview._id} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
                <div className="rounded-lg bg-accent/10 p-2">
                  <Calendar className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">{interview.application?.drive?.jobRole}</p>
                  <p className="text-text-secondary text-xs">{formatDateTime(interview.date)} · {interview.time}</p>
                </div>
              </div>
            )) : (
              <p className="text-text-secondary text-sm text-center py-4">No upcoming interviews</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
