import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, FileText, Briefcase, Code2, BarChart3,
  FileUp, Calendar, Bell, Settings, LogOut, Menu, ChevronLeft,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn, getInitials } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { notificationApi } from '@/services'

const studentNav = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/student/profile', icon: User, label: 'Profile' },
  { to: '/student/applications', icon: FileText, label: 'Applications' },
  { to: '/student/drives', icon: Briefcase, label: 'Placement Drives' },
  { to: '/student/coding', icon: Code2, label: 'Coding Profiles' },
  { to: '/student/dsa', icon: BarChart3, label: 'DSA Tracker' },
  { to: '/student/resume', icon: FileUp, label: 'Resume Vault' },
  { to: '/student/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/student/notifications', icon: Bell, label: 'Notifications' },
  { to: '/student/settings', icon: Settings, label: 'Settings' },
]

const coordinatorNav = [
  { to: '/coordinator', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/coordinator/companies', icon: Briefcase, label: 'Companies' },
  { to: '/coordinator/drives', icon: FileText, label: 'Drives' },
  { to: '/coordinator/students', icon: User, label: 'Students' },
  { to: '/coordinator/applications', icon: FileText, label: 'Applications' },
  { to: '/coordinator/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/coordinator/notifications', icon: Bell, label: 'Notifications' },
]

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: User, label: 'Users' },
  { to: '/admin/companies', icon: Briefcase, label: 'Companies' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
]

interface DashboardLayoutProps {
  navItems: typeof studentNav
  portalLabel: string
}

export function DashboardLayout({ navItems, portalLabel }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: unread } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationApi.unreadCount().then((r) => r.data.data.count),
    refetchInterval: 30000,
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const Sidebar = () => (
    <aside className={cn(
      'flex flex-col h-full bg-surface border-r border-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div>
            <span className="font-bold text-accent">PlaceTrack</span>
            <span className="text-text-secondary text-xs block">{portalLabel}</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex">
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
            {!collapsed && label === 'Notifications' && unread ? (
              <span className="ml-auto bg-accent text-white text-xs rounded-full px-1.5 py-0.5">{unread}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-accent/20 text-accent text-xs">
              {user ? getInitials(user.name) : '?'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-text-secondary truncate">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/50 backdrop-blur-sm lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => navigate('/student/notifications')}>
            <Bell className="h-5 w-5" />
            {unread ? (
              <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full" />
            ) : null}
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export function StudentLayout() {
  return <DashboardLayout navItems={studentNav} portalLabel="Student Portal" />
}

export function CoordinatorLayout() {
  return <DashboardLayout navItems={coordinatorNav} portalLabel="Coordinator Portal" />
}

export function AdminLayout() {
  return <DashboardLayout navItems={adminNav} portalLabel="Admin Portal" />
}
