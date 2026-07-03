import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileText, Trophy, Calendar, Briefcase, Code2, TrendingUp, ArrowUpRight, Clock, Building2 } from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Link } from 'react-router-dom'
import { dashboardApi } from '@/services'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/authStore'
import { PageHeader } from '@/components/shared/PageHeader'

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: () => dashboardApi.student().then((r) => r.data.data),
  })

  if (isLoading) return <><PageHeader title="Dashboard" description="Your placement overview" /><DashboardSkeleton /></>
  if (error) return <p className="text-danger">Failed to load dashboard</p>

  const cards = data?.cards

  const codingData = [
    { name: 'Easy', value: data?.codingStats?.leetcode?.easySolved || 0, fill: '#2EA043' },
    { name: 'Medium', value: data?.codingStats?.leetcode?.mediumSolved || 0, fill: '#D29922' },
    { name: 'Hard', value: data?.codingStats?.leetcode?.hardSolved || 0, fill: '#F85149' },
  ]

  const weeklyData = [
    { day: 'Mon', problems: 5 },
    { day: 'Tue', problems: 8 },
    { day: 'Wed', problems: 6 },
    { day: 'Thu', problems: 12 },
    { day: 'Fri', problems: 9 },
    { day: 'Sat', problems: 15 },
    { day: 'Sun', problems: 11 },
  ]

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            {greeting()}, <span className="gradient-accent">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-text-secondary mt-1">Here's what's happening with your placement journey</p>
        </div>
        <Link to="/student/drives">
          <Button className="gap-2">
            <Briefcase className="h-4 w-4" /> Browse Drives
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Applications" value={cards?.totalApplications ?? 0} icon={FileText} trend={12} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard title="Offers Received" value={cards?.offersReceived ?? 0} icon={Trophy} trend={cards?.offersReceived ? 100 : 0} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Interviews" value={cards?.interviewsScheduled ?? 0} icon={Calendar} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatCard title="Active Drives" value={cards?.activeDrives ?? 0} icon={Briefcase} />
        </motion.div>
      </div>

      {/* Coding Stats Mini Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="card-hover">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center">
                <Code2 className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cards?.leetcodeSolved ?? 0}</p>
                <p className="text-text-secondary text-sm">LeetCode Solved</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="card-hover">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
                <Code2 className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cards?.githubRepos ?? 0}</p>
                <p className="text-text-secondary text-sm">GitHub Repos</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="card-hover">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cards?.codeforcesRating ?? 0}</p>
                <p className="text-text-secondary text-sm">CF Rating</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Weekly Progress</CardTitle>
              <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">+28% this week</span>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2EA043" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2EA043" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                  <XAxis dataKey="day" stroke="#8B949E" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#8B949E" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8 }}
                    labelStyle={{ color: '#F0F6FC' }}
                  />
                  <Area type="monotone" dataKey="problems" stroke="#2EA043" strokeWidth={2} fillOpacity={1} fill="url(#colorProblems)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Problems by Difficulty</CardTitle>
              <Link to="/student/coding" className="text-xs text-accent hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie 
                      data={codingData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={50} 
                      outerRadius={75} 
                      dataKey="value" 
                      paddingAngle={4}
                      strokeWidth={0}
                    >
                      {codingData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {codingData.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">{item.name}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Applications</CardTitle>
              <Link to="/student/applications" className="text-xs text-accent hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.recentApplications?.length ? data.recentApplications.slice(0, 4).map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-border hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{app.drive?.company?.name}</p>
                      <p className="text-text-secondary text-xs">{app.drive?.jobRole}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary text-sm">No applications yet</p>
                  <Link to="/student/drives">
                    <Button variant="outline" size="sm" className="mt-3">Browse Drives</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Interviews */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Upcoming Interviews</CardTitle>
              <Link to="/student/interviews" className="text-xs text-accent hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.upcomingInterviews?.length ? data.upcomingInterviews.slice(0, 4).map((interview) => (
                <div key={interview._id} className="flex items-center gap-4 p-3 rounded-xl bg-surface/50 border border-border hover:border-accent/30 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-blue-400">{new Date(interview.date).getDate()}</span>
                    <span className="text-[10px] text-blue-400/70">{new Date(interview.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{interview.application?.drive?.jobRole}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3 text-text-secondary" />
                      <p className="text-text-secondary text-xs">{interview.time} · {interview.mode}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 text-text-secondary mx-auto mb-2 opacity-50" />
                  <p className="text-text-secondary text-sm">No upcoming interviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
