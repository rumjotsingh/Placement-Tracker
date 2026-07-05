import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { RefreshCw, Trophy, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { toast } from 'sonner'
import { codingApi, profileApi } from '@/services'
import { CODING_PLATFORMS, type CodingPlatformId } from '@/constants/codingPlatforms'
import { CodingPlatformCard } from '@/components/student/CodingPlatformCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, getApiError } from '@/lib/utils'
import { getPlatformTotals, getBreakdownChart } from '@/lib/codingStats'

const SYNC_FNS: Record<CodingPlatformId, () => Promise<unknown>> = {
  github: () => codingApi.syncGitHub(),
  leetcode: () => codingApi.syncLeetCode(),
  codeforces: () => codingApi.syncCodeforces(),
  codechef: () => codingApi.syncCodeChef(),
  geeksforgeeks: () => codingApi.syncGeeksforGeeks(),
}

export default function CodingProfilesPage() {
  const queryClient = useQueryClient()
  const [syncing, setSyncing] = useState<CodingPlatformId | 'all' | null>(null)

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['coding', 'stats'],
    queryFn: () => codingApi.getStats().then((r) => r.data.data),
  })

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMyProfile().then((r) => r.data.data),
  })

  const sync = async (platform: CodingPlatformId | 'all') => {
    setSyncing(platform)
    try {
      if (platform === 'all') {
        const res = await codingApi.syncAll()
        const errors = res.data.data.errors as { platform: string; message: string }[]
        if (errors?.length) {
          errors.forEach((e) => toast.error(`${e.platform}: ${e.message}`))
          toast.warning(`Synced with ${errors.length} error(s)`)
        } else {
          toast.success('All profiles synced!')
        }
      } else {
        await SYNC_FNS[platform]()
        toast.success(`${platform} synced!`)
      }
      queryClient.invalidateQueries({ queryKey: ['coding'] })
    } catch (err) {
      toast.error(getApiError(err, 'Sync failed — check your username in Profile'))
    } finally {
      setSyncing(null)
    }
  }

  if (statsLoading || profileLoading) {
    return (
      <>
        <PageHeader title="Coding Profiles" />
        <DashboardSkeleton />
      </>
    )
  }

  const totals = getPlatformTotals(stats)
  const connectedCount = CODING_PLATFORMS.filter((p) => profile?.[p.usernameKey]).length
  const chartData = getBreakdownChart(stats)

  const ratings = [
    { label: 'Codeforces', value: stats?.codeforces?.rating, color: 'text-blue-400' },
    { label: 'CodeChef', value: stats?.codechef?.rating, color: 'text-amber-400' },
    { label: 'LeetCode', value: stats?.leetcode?.contestRating, color: 'text-yellow-400' },
  ].filter((r) => r.value && r.value > 0)

  return (
    <div>
      <PageHeader
        title="Coding Profiles"
        description="Track your competitive programming stats across all platforms"
        action={
          <Button onClick={() => sync('all')} disabled={!!syncing}>
            <RefreshCw className={`h-4 w-4 ${syncing === 'all' ? 'animate-spin' : ''}`} />
            Sync All
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
              <Trophy className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">{connectedCount}/5</p>
              <p className="text-sm text-text-secondary">Platforms Connected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-text-secondary mb-2">Contest Ratings</p>
            {ratings.length ? (
              <div className="flex flex-wrap gap-3">
                {ratings.map((r) => (
                  <div key={r.label}>
                    <p className={`text-xl font-bold ${r.color}`}>{r.value}</p>
                    <p className="text-[10px] text-text-secondary">{r.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">Sync profiles to see ratings</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {CODING_PLATFORMS.map((platform) => (
          <CodingPlatformCard
            key={platform.id}
            platform={platform}
            username={profile?.[platform.usernameKey] as string | undefined}
            stats={stats}
            syncing={syncing === platform.id}
            onSync={() => sync(platform.id)}
          />
        ))}
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Problem Solving Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="name" stroke="#8B949E" fontSize={12} />
                <YAxis stroke="#8B949E" fontSize={12} />
                <ChartTooltip variant="bar" />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {stats?.lastSyncedAt && (
              <p className="text-xs text-text-secondary text-center mt-3">
                Last synced: {formatDate(stats.lastSyncedAt)}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
