import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { dashboardApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, FileText, Trophy, TrendingUp } from 'lucide-react'

const COLORS = ['#2EA043', '#238636', '#58A6FF', '#D29922', '#F85149', '#8B949E']

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => dashboardApi.admin().then((r) => r.data.data),
  })

  if (isLoading) return <><PageHeader title="Admin Dashboard" /><DashboardSkeleton /></>

  const m = data?.metrics

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Institution-wide placement analytics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        <StatCard title="Total Users" value={m?.totalUsers ?? 0} icon={Users} />
        <StatCard title="Total Students" value={m?.totalStudents ?? 0} icon={Users} />
        <StatCard title="Companies" value={m?.totalCompanies ?? 0} icon={Briefcase} />
        <StatCard title="Placement Drives" value={m?.totalDrives ?? 0} icon={FileText} />
        <StatCard title="Total Offers" value={m?.totalOffers ?? 0} icon={Trophy} />
        <StatCard title="Placement Rate" value={`${m?.placementRate ?? 0}%`} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Branch-wise Placements</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.analytics?.branchPlacements?.map((b) => ({ name: b._id || 'Unknown', count: b.count })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="name" stroke="#8B949E" fontSize={11} />
                <YAxis stroke="#8B949E" fontSize={12} />
                <ChartTooltip variant="bar" />
                <Bar dataKey="count" fill="#2EA043" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Recruiters</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data?.analytics?.companySelections?.map((c) => ({ name: c._id, value: c.count })) || []}
                  cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name }) => name}
                >
                  {data?.analytics?.companySelections?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip variant="pie" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
