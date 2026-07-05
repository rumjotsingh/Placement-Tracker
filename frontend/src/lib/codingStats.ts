import type { CodingStats } from '@/types'

export function getPlatformTotals(stats?: CodingStats) {
  const lc = stats?.leetcode
  const cf = stats?.codeforces
  const cc = stats?.codechef
  const gfg = stats?.geeksforgeeks

  const leetcodeTotal = lc?.totalSolved || 0
  const codeforcesTotal = cf?.totalSolved || 0
  const codechefTotal = cc?.problemsSolved || 0
  const gfgTotal = gfg?.totalSolved || 0

  const easy =
    (lc?.easySolved || 0) +
    (cf?.easySolved || 0) +
    (gfg?.easySolved || 0) +
    (gfg?.schoolSolved || 0) +
    (gfg?.basicSolved || 0)
  const medium = (lc?.mediumSolved || 0) + (cf?.mediumSolved || 0) + (gfg?.mediumSolved || 0)
  const hard = (lc?.hardSolved || 0) + (cf?.hardSolved || 0) + (gfg?.hardSolved || 0)

  return {
    leetcodeTotal,
    codeforcesTotal,
    codechefTotal,
    gfgTotal,
    grandTotal: leetcodeTotal + codeforcesTotal + codechefTotal + gfgTotal,
    easy,
    medium,
    hard,
    allDifficultyTotal: easy + medium + hard,
  }
}

export const PLATFORM_BREAKDOWN = [
  { key: 'leetcode', label: 'LeetCode', color: '#E8A317' },
  { key: 'codeforces', label: 'Codeforces', color: '#58A6FF' },
  { key: 'codechef', label: 'CodeChef', color: '#D29922' },
  { key: 'geeksforgeeks', label: 'GeeksforGeeks', color: '#2F8D46' },
] as const

export function getBreakdownChart(stats?: CodingStats) {
  const t = getPlatformTotals(stats)
  return [
    { name: 'LeetCode', value: t.leetcodeTotal, fill: '#E8A317' },
    { name: 'Codeforces', value: t.codeforcesTotal, fill: '#58A6FF' },
    { name: 'CodeChef', value: t.codechefTotal, fill: '#D29922' },
    { name: 'GFG', value: t.gfgTotal, fill: '#2F8D46' },
  ].filter((d) => d.value > 0)
}
