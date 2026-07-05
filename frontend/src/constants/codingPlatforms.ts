export type CodingPlatformId =
  | 'github'
  | 'leetcode'
  | 'codeforces'
  | 'codechef'
  | 'geeksforgeeks'

export interface CodingPlatformConfig {
  id: CodingPlatformId
  name: string
  shortName: string
  usernameKey: keyof import('@/types').StudentProfile
  profileUrl: (username: string) => string
  color: string
  bg: string
  border: string
  accent: string
}

export const CODING_PLATFORMS: CodingPlatformConfig[] = [
  {
    id: 'github',
    name: 'GitHub',
    shortName: 'GH',
    usernameKey: 'githubUsername',
    profileUrl: (u) => `https://github.com/${u}`,
    color: 'text-white',
    bg: 'bg-[#0D1117]',
    border: 'border-white/10',
    accent: '#F0F6FC',
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    shortName: 'LC',
    usernameKey: 'leetcodeUsername',
    profileUrl: (u) => `https://leetcode.com/u/${u}`,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    accent: '#E8A317',
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    shortName: 'CF',
    usernameKey: 'codeforcesUsername',
    profileUrl: (u) => `https://codeforces.com/profile/${u}`,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    accent: '#58A6FF',
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    shortName: 'CC',
    usernameKey: 'codechefUsername',
    profileUrl: (u) => `https://www.codechef.com/users/${u}`,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    accent: '#7B4F2E',
  },
  {
    id: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    shortName: 'GFG',
    usernameKey: 'geeksforgeeksUsername',
    profileUrl: (u) => `https://www.geeksforgeeks.org/user/${u}/`,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    accent: '#2F8D46',
  },
]
