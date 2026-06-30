import { useQuery } from '@tanstack/react-query'
import { BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { codingApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code2 } from 'lucide-react'

export default function DSATrackerPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['coding', 'dsa'],
    queryFn: () => codingApi.getDSA().then((r) => r.data.data),
  })

  if (isLoading) return <><PageHeader title="DSA Tracker" /><DashboardSkeleton /></>

  const total = (data?.easy || 0) + (data?.medium || 0) + (data?.hard || 0)

  return (
    <div>
      <PageHeader title="DSA Tracker" description="Track your problem-solving progress" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Easy" value={data?.easy ?? 0} icon={Code2} />
        <StatCard title="Medium" value={data?.medium ?? 0} icon={BarChart3} />
        <StatCard title="Hard" value={data?.hard ?? 0} icon={BarChart3} />
        <StatCard title="Total" value={total} icon={BarChart3} subtitle="All difficulties" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Weekly Growth</CardTitle></CardHeader>
          <CardContent>
            {data?.weeklyGrowth?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.weeklyGrowth.slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                  <XAxis dataKey="week" stroke="#8B949E" fontSize={10} />
                  <YAxis stroke="#8B949E" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="easy" stroke="#2EA043" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="medium" stroke="#D29922" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="hard" stroke="#F85149" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-sm text-center py-8">Sync LeetCode to see weekly growth</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Monthly Progress</CardTitle></CardHeader>
          <CardContent>
            {data?.monthlyGrowth?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.monthlyGrowth.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                  <XAxis dataKey="month" stroke="#8B949E" fontSize={10} />
                  <YAxis stroke="#8B949E" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8 }} />
                  <Bar dataKey="easy" fill="#2EA043" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="medium" fill="#D29922" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="hard" fill="#F85149" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-sm text-center py-8">No monthly data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
