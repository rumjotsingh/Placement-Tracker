import { ExternalLink, RefreshCw } from 'lucide-react'
import type { CodingPlatformConfig } from '@/constants/codingPlatforms'
import type { CodingStats } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CodingPlatformCardProps {
  platform: CodingPlatformConfig
  username?: string
  stats?: CodingStats
  syncing?: boolean
  onSync: () => void
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center p-2.5 rounded-lg bg-surface">
      <p className="text-lg font-bold truncate">{value}</p>
      <p className="text-[10px] text-text-secondary uppercase tracking-wide">{label}</p>
    </div>
  )
}

export function CodingPlatformCard({
  platform,
  username,
  stats,
  syncing,
  onSync,
}: CodingPlatformCardProps) {
  const connected = !!username

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-200 hover:border-accent/30',
        platform.border,
        !connected && 'opacity-80'
      )}
    >
      <div
        className={cn('h-1.5 w-full', platform.bg)}
        style={{ backgroundColor: connected ? platform.accent : undefined }}
      />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0',
                platform.bg,
                platform.color
              )}
            >
              {platform.shortName}
            </div>
            <div className="min-w-0">
              <p className="font-semibold">{platform.name}</p>
              {connected ? (
                <a
                  href={platform.profileUrl(username)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent hover:underline flex items-center gap-1 truncate"
                >
                  @{username} <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                <p className="text-xs text-text-secondary">Not connected</p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            disabled={!connected || syncing}
            onClick={onSync}
            className="shrink-0"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', syncing && 'animate-spin')} />
          </Button>
        </div>

        {!connected ? (
          <p className="text-sm text-text-secondary">
            Add your {platform.name} username in Profile to sync stats.
          </p>
        ) : (
          <PlatformStats platform={platform.id} stats={stats} />
        )}
      </CardContent>
    </Card>
  )
}

function PlatformStats({ platform, stats }: { platform: string; stats?: CodingStats }) {
  if (!stats) {
    return <p className="text-sm text-text-secondary">Click sync to fetch stats</p>
  }

  switch (platform) {
    case 'github': {
      const gh = stats.github
      return (
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Repos" value={gh?.publicRepos ?? 0} />
          <StatBox label="Stars" value={gh?.stars ?? 0} />
          <StatBox label="Followers" value={gh?.followers ?? 0} />
          <StatBox label="Contributions" value={gh?.contributions ?? 0} />
        </div>
      )
    }
    case 'leetcode': {
      const lc = stats.leetcode
      const total = lc?.totalSolved || 0
      return (
        <div>
          <div className="text-center mb-3">
            <p className="text-3xl font-bold text-accent">{total}</p>
            <p className="text-xs text-text-secondary">Problems Solved</p>
            {lc?.contestRating ? (
              <Badge variant="outline" className="mt-2 text-xs">
                Contest Rating: {Math.round(lc.contestRating)}
              </Badge>
            ) : null}
          </div>
          {['Easy', 'Medium', 'Hard'].map((level, i) => {
            const val = [lc?.easySolved, lc?.mediumSolved, lc?.hardSolved][i] || 0
            const pct = total ? (val / total) * 100 : 0
            return (
              <div key={level} className="mb-1.5">
                <div className="flex justify-between text-xs mb-0.5">
                  <span>{level}</span>
                  <span>{val}</span>
                </div>
                <Progress value={pct} />
              </div>
            )
          })}
        </div>
      )
    }
    case 'codeforces': {
      const cf = stats.codeforces
      const total = cf?.totalSolved || 0
      return (
        <div>
          <div className="text-center mb-3">
            <p className="text-3xl font-bold text-blue-400">{total}</p>
            <p className="text-xs text-text-secondary">Problems Solved</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              <Badge variant="outline" className="text-xs capitalize">
                {cf?.rank || 'Unrated'} · {cf?.rating ?? 0}
              </Badge>
              {cf?.maxRating ? (
                <Badge variant="outline" className="text-xs">
                  Max {cf.maxRating}
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            <StatBox label="Easy" value={cf?.easySolved ?? 0} />
            <StatBox label="Med" value={cf?.mediumSolved ?? 0} />
            <StatBox label="Hard" value={cf?.hardSolved ?? 0} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBox label="Contests" value={cf?.contests ?? 0} />
            <StatBox label="Max Rank" value={cf?.maxRank || '—'} />
          </div>
        </div>
      )
    }
    case 'codechef': {
      const cc = stats.codechef
      return (
        <div>
          <div className="text-center mb-3">
            <p className="text-3xl font-bold text-amber-400">{cc?.problemsSolved ?? 0}</p>
            <p className="text-xs text-text-secondary">Problems Solved (365d)</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              <Badge variant="outline" className="text-xs">
                Rating: {cc?.rating ?? 0}
              </Badge>
              {cc?.stars ? (
                <Badge variant="outline" className="text-xs">
                  {cc.stars}
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBox label="Max Rating" value={cc?.maxRating ?? 0} />
            <StatBox label="Contests" value={cc?.contests ?? 0} />
            <StatBox label="Global Rank" value={cc?.globalRank ? `#${cc.globalRank}` : '—'} />
            <StatBox label="Country Rank" value={cc?.countryRank ? `#${cc.countryRank}` : '—'} />
          </div>
          {cc?.countryName && (
            <p className="text-xs text-text-secondary text-center mt-2">{cc.countryName}</p>
          )}
        </div>
      )
    }
    case 'geeksforgeeks': {
      const gfg = stats.geeksforgeeks
      const total = gfg?.totalSolved || 0
      return (
        <div>
          <div className="text-center mb-3">
            <p className="text-3xl font-bold text-green-400">{total}</p>
            <p className="text-xs text-text-secondary">Problems Solved</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {gfg?.codingScore ? (
                <Badge variant="outline" className="text-xs">
                  Score: {gfg.codingScore}
                </Badge>
              ) : null}
              {gfg?.currentStreak ? (
                <Badge variant="outline" className="text-xs">
                  🔥 {gfg.currentStreak} day streak
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            <StatBox label="School" value={gfg?.schoolSolved ?? 0} />
            <StatBox label="Basic" value={gfg?.basicSolved ?? 0} />
            <StatBox label="Easy" value={gfg?.easySolved ?? 0} />
            <StatBox label="Medium" value={gfg?.mediumSolved ?? 0} />
            <StatBox label="Hard" value={gfg?.hardSolved ?? 0} />
            <StatBox label="Inst. Rank" value={gfg?.instituteRank ? `#${gfg.instituteRank}` : '—'} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBox label="Monthly Score" value={gfg?.monthlyScore ?? 0} />
            <StatBox label="Max Streak" value={gfg?.maxStreak ?? 0} />
          </div>
        </div>
      )
    }
    default:
      return null
  }
}
