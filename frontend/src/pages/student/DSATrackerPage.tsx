import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Code2, RefreshCw, Target, TrendingUp, Layers, ArrowRight } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { toast } from 'sonner'
import { codingApi, profileApi } from '@/services'
import { CODING_PLATFORMS } from '@/constants/codingPlatforms'
import { getPlatformTotals, getBreakdownChart } from '@/lib/codingStats'
import { formatDate, getApiError } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const DIFFICULTY_COLORS = { Easy: '#2EA043', Medium: '#D29922', Hard: '#F85149' }

const DSA_PLATFORMS = CODING_PLATFORMS.filter((p) =>
  ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks'].includes(p.id)
)

export default function DSATrackerPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [syncing, setSyncing] = useState(false)

  const { data: dsa, isLoading: dsaLoading } = useQuery({
    queryKey: ['coding', 'dsa'],
    queryFn: () => codingApi.getDSA().then((r) => r.data.data),
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['coding', 'stats'],
    queryFn: () => codingApi.getStats().then((r) => r.data.data),
  })

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMyProfile().then((r) => r.data.data),
  })

  const syncAll = async () => {
    setSyncing(true)
    try {
      const res = await codingApi.syncAll()
      const errors = res.data.data.errors as { platform: string; message: string }[]
      if (errors?.length) {
        errors.forEach((e) => toast.error(`${e.platform}: ${e.message}`))
        toast.warning(`Synced with ${errors.length} error(s)`)
      } else {
        toast.success('All platforms synced!')
      }
      queryClient.invalidateQueries({ queryKey: ['coding'] })
    } catch (err) {
      toast.error(getApiError(err, 'Sync failed — check usernames in Profile'))
    } finally {
      setSyncing(false)
    }
  }

  if (dsaLoading || statsLoading || profileLoading) {
    return (
      <>
        <PageHeader title="DSA Tracker" />
        <DashboardSkeleton />
      </>
    )
  }

  const totals = getPlatformTotals(stats)
  const platformChart = getBreakdownChart(stats)
  const difficultyChart = [
    { name: 'Easy', value: totals.easy, fill: DIFFICULTY_COLORS.Easy },
    { name: 'Medium', value: totals.medium, fill: DIFFICULTY_COLORS.Medium },
    { name: 'Hard', value: totals.hard, fill: DIFFICULTY_COLORS.Hard },
  ].filter((d) => d.value > 0)

  const connectedDsa = DSA_PLATFORMS.filter((p) => profile?.[p.usernameKey]).length
  const hasData = totals.grandTotal > 0

  const platformRows = [
    {
      platform: 'LeetCode',
      total: totals.leetcodeTotal,
      easy: stats?.leetcode?.easySolved || 0,
      medium: stats?.leetcode?.mediumSolved || 0,
      hard: stats?.leetcode?.hardSolved || 0,
      extra: stats?.leetcode?.contestRating
        ? `Rating ${Math.round(stats.leetcode.contestRating)}`
        : null,
      color: 'text-yellow-400',
      accent: '#E8A317',
    },
    {
      platform: 'Codeforces',
      total: totals.codeforcesTotal,
      easy: stats?.codeforces?.easySolved || 0,
      medium: stats?.codeforces?.mediumSolved || 0,
      hard: stats?.codeforces?.hardSolved || 0,
      extra: stats?.codeforces?.rating
        ? `${stats.codeforces.rank || 'Unrated'} · ${stats.codeforces.rating}`
        : null,
      color: 'text-blue-400',
      accent: '#58A6FF',
    },
    {
      platform: 'CodeChef',
      total: totals.codechefTotal,
      easy: '—',
      medium: '—',
      hard: '—',
      extra: stats?.codechef?.rating
        ? `Rating ${stats.codechef.rating} · ${stats.codechef.stars || ''}`
        : stats?.codechef?.stars
          ? stats.codechef.stars
          : null,
      color: 'text-amber-400',
      accent: '#7B4F2E',
    },
    {
      platform: 'GeeksforGeeks',
      total: totals.gfgTotal,
      easy:
        (stats?.geeksforgeeks?.schoolSolved || 0) +
        (stats?.geeksforgeeks?.basicSolved || 0) +
        (stats?.geeksforgeeks?.easySolved || 0),
      medium: stats?.geeksforgeeks?.mediumSolved || 0,
      hard: stats?.geeksforgeeks?.hardSolved || 0,
      extra: stats?.geeksforgeeks?.codingScore
        ? `Score ${stats.geeksforgeeks.codingScore}`
        : null,
      color: 'text-green-400',
      accent: '#2F8D46',
    },
  ].filter((r) => r.total > 0 || r.extra)

  return (
    <div>
      <PageHeader
        title="DSA Tracker"
        description="Unified problem-solving progress across all coding platforms"
        action={
          <Button onClick={syncAll} disabled={syncing}>
            <RefreshCw className={cn('h-4 w-4', syncing && 'animate-spin')} />
            Sync All Platforms
          </Button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold">{totals.grandTotal}</p>
              <p className="text-sm text-text-secondary">Total Problems Solved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-surface flex items-center justify-center">
              <Layers className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">{connectedDsa}/4</p>
              <p className="text-sm text-text-secondary">DSA Platforms Connected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-surface flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">{totals.allDifficultyTotal}</p>
              <p className="text-sm text-text-secondary">
                {stats?.lastSyncedAt
                  ? `Synced ${formatDate(stats.lastSyncedAt)}`
                  : 'By difficulty (LC + CF + GFG)'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasData && (
        <Card className="mb-6 border-dashed">
          <CardContent className="p-8 text-center">
            <Code2 className="h-10 w-10 text-text-secondary mx-auto mb-3" />
            <p className="font-medium mb-1">No DSA stats yet</p>
            <p className="text-sm text-text-secondary mb-4 max-w-md mx-auto">
              Add your LeetCode, Codeforces, CodeChef, and GeeksforGeeks usernames in Profile,
              then sync to see your unified progress.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => navigate('/student/profile')}>
                Go to Profile
              </Button>
              <Button onClick={syncAll} disabled={syncing}>
                <RefreshCw className={cn('h-4 w-4', syncing && 'animate-spin')} />
                Sync Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Easy', value: totals.easy, color: DIFFICULTY_COLORS.Easy },
          { label: 'Medium', value: totals.medium, color: DIFFICULTY_COLORS.Medium },
          { label: 'Hard', value: totals.hard, color: DIFFICULTY_COLORS.Hard },
        ].map(({ label, value, color }) => {
          const pct = totals.allDifficultyTotal ? (value / totals.allDifficultyTotal) * 100 : 0
          return (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xl font-bold" style={{ color }}>
                    {value}
                  </span>
                </div>
                <Progress value={pct} />
                <p className="text-[10px] text-text-secondary mt-1.5">{pct.toFixed(0)}% of total</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {platformRows.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
          {platformRows.map((row) => (
            <Card key={row.platform} className="overflow-hidden hover:border-accent/30 transition-all">
              <div className="h-1 w-full" style={{ backgroundColor: row.accent }} />
              <CardContent className="p-4">
                <p className={cn('text-sm font-semibold mb-1', row.color)}>{row.platform}</p>
                <p className="text-2xl font-bold">{row.total}</p>
                <p className="text-[10px] text-text-secondary uppercase tracking-wide mb-2">
                  Problems
                </p>
                {row.extra && (
                  <Badge variant="outline" className="text-[10px]">
                    {row.extra}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Platform Breakdown</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/coding')}>
            Coding Profiles <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {platformRows.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-6">
              Connect and sync your coding profiles to see stats here.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Platform', 'Total Solved', 'Easy', 'Medium', 'Hard', 'Details'].map((h) => (
                    <th key={h} className="text-left p-3 text-text-secondary font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {platformRows.map((row) => (
                  <tr key={row.platform} className="border-b border-border hover:bg-surface/50">
                    <td className={`p-3 font-medium ${row.color}`}>{row.platform}</td>
                    <td className="p-3 font-bold">{row.total}</td>
                    <td className="p-3 text-text-secondary">{row.easy}</td>
                    <td className="p-3 text-text-secondary">{row.medium}</td>
                    <td className="p-3 text-text-secondary">{row.hard}</td>
                    <td className="p-3">
                      {row.extra ? (
                        <Badge variant="outline" className="text-xs">
                          {row.extra}
                        </Badge>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Problems by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            {platformChart.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={platformChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {platformChart.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip variant="pie" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-sm text-center py-8">No platform data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Difficulty Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {difficultyChart.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={difficultyChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                  <XAxis dataKey="name" stroke="#8B949E" fontSize={12} />
                  <YAxis stroke="#8B949E" fontSize={12} />
                  <ChartTooltip variant="bar" />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {difficultyChart.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-sm text-center py-8">
                Sync to see difficulty split
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {dsa?.weeklyGrowth?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dsa.weeklyGrowth.slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                  <XAxis dataKey="week" stroke="#8B949E" fontSize={10} />
                  <YAxis stroke="#8B949E" fontSize={12} />
                  <ChartTooltip variant="line" />
                  <Line type="monotone" dataKey="easy" stroke="#2EA043" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="medium" stroke="#D29922" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="hard" stroke="#F85149" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-sm text-center py-8">
                Sync all platforms to track weekly growth
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {dsa?.monthlyGrowth?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dsa.monthlyGrowth.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                  <XAxis dataKey="month" stroke="#8B949E" fontSize={10} />
                  <YAxis stroke="#8B949E" fontSize={12} />
                  <ChartTooltip variant="bar" />
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
