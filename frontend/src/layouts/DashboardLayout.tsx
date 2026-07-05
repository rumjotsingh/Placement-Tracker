import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, FileText, Briefcase, Code2, BarChart3,
  FileUp, Calendar, Bell, Settings, LogOut, Menu, ChevronLeft, Search,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  { to: '/admin/drives', icon: FileText, label: 'Drives' },
  { to: '/admin/applications', icon: FileText, label: 'Applications' },
  { to: '/admin/interviews', icon: Calendar, label: 'Interviews' },
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
      'flex flex-col h-full bg-surface/50 backdrop-blur-sm border-r border-border transition-all duration-300',
      collapsed ? 'w-[68px]' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <span className="font-bold text-sm">PlaceTrack</span>
              <span className="text-accent font-bold text-sm">Pro</span>
              <p className="text-text-secondary text-[10px] -mt-0.5">{portalLabel}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 mx-auto rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex h-8 w-8">
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group',
              isActive
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-muted'
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn('h-4 w-4 shrink-0', collapsed && 'mx-auto')} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && label === 'Notifications' && unread ? (
                  <span className="ml-auto bg-accent text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">{unread}</span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-3 border-t border-border">
        <div className={cn('flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors', collapsed && 'justify-center')}>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-accent/20 to-accent/5 text-accent text-xs font-bold">
              {user ? getInitials(user.name) : '?'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-text-secondary hover:text-danger">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="absolute left-0 top-0 h-full w-64"
            >
              <Sidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-surface/30 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden sm:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input placeholder="Search..." className="pl-9 w-64 h-9 bg-muted border-0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => navigate(navItems.find(n => n.label === 'Notifications')?.to || '#')}
            >
              <Bell className="h-5 w-5" />
              {unread ? (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent rounded-full ring-2 ring-surface" />
              ) : null}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
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
