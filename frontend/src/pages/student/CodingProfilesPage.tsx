import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Code2, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
import { codingApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatDate } from '@/lib/utils'

export default function CodingProfilesPage() {
  const queryClient = useQueryClient()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['coding', 'stats'],
    queryFn: () => codingApi.getStats().then((r) => r.data.data),
  })

  const sync = (platform: 'github' | 'leetcode' | 'codeforces' | 'all') => {
    const fn = {
      github: codingApi.syncGitHub,
      leetcode: codingApi.syncLeetCode,
      codeforces: codingApi.syncCodeforces,
      all: codingApi.syncAll,
    }[platform]

    fn().then(() => {
      toast.success(`${platform} synced!`)
      queryClient.invalidateQueries({ queryKey: ['coding'] })
    }).catch(() => toast.error('Sync failed'))
  }

  if (isLoading) return <><PageHeader title="Coding Profiles" /><DashboardSkeleton /></>

  const lc = stats?.leetcode
  const gh = stats?.github
  const cf = stats?.codeforces

  const leetcodeRings = [
    { name: 'Easy', value: lc?.easySolved || 0, fill: '#2EA043' },
    { name: 'Medium', value: lc?.mediumSolved || 0, fill: '#D29922' },
    { name: 'Hard', value: lc?.hardSolved || 0, fill: '#F85149' },
  ]

  const totalSolved = (lc?.totalSolved || 0)

  return (
    <div>
      <PageHeader
        title="Coding Profiles"
        description="Your competitive programming and development stats"
        action={
          <Button onClick={() => sync('all')}><RefreshCw className="h-4 w-4" /> Sync All</Button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><Code2 className="h-4 w-4" /> GitHub</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => sync('github')}><RefreshCw className="h-3 w-3" /></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Repos', value: gh?.publicRepos },
                { label: 'Stars', value: gh?.stars },
                { label: 'Followers', value: gh?.followers },
                { label: 'Following', value: gh?.following },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-3 rounded-lg bg-surface">
                  <p className="text-xl font-bold">{value ?? 0}</p>
                  <p className="text-xs text-text-secondary">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><Code2 className="h-4 w-4 text-yellow-400" /> LeetCode</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => sync('leetcode')}><RefreshCw className="h-3 w-3" /></Button>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-accent">{lc?.totalSolved ?? 0}</p>
              <p className="text-text-secondary text-sm">Total Solved</p>
              {lc?.contestRating ? <p className="text-xs text-text-secondary mt-1">Rating: {lc.contestRating}</p> : null}
            </div>
            {['Easy', 'Medium', 'Hard'].map((level, i) => {
              const val = [lc?.easySolved, lc?.mediumSolved, lc?.hardSolved][i] || 0
              const pct = totalSolved ? (val / totalSolved) * 100 : 0
              return (
                <div key={level} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{level}</span><span>{val}</span>
                  </div>
                  <Progress value={pct} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><Code2 className="h-4 w-4 text-blue-400" /> Codeforces</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => sync('codeforces')}><RefreshCw className="h-3 w-3" /></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{cf?.rating ?? 0}</p>
              <p className="text-text-secondary text-sm">{cf?.rank || 'Unrated'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-surface">
                <p className="text-lg font-bold">{cf?.maxRating ?? 0}</p>
                <p className="text-xs text-text-secondary">Max Rating</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-surface">
                <p className="text-lg font-bold">{cf?.contests ?? 0}</p>
                <p className="text-xs text-text-secondary">Contests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Unified Statistics</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leetcodeRings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="name" stroke="#8B949E" fontSize={12} />
              <YAxis stroke="#8B949E" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {leetcodeRings.map((entry, i) => <Bar key={i} dataKey="value" fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {stats?.lastSyncedAt && (
            <p className="text-xs text-text-secondary text-center mt-2">Last synced: {formatDate(stats.lastSyncedAt)}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
