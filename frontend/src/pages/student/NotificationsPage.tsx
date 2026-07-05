import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { notificationApi } from '@/services'
import { useAuthStore } from '@/stores/authStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

import type { Notification } from '@/types'

function groupByDate(notifications: Notification[]) {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  return notifications.reduce((groups, n) => {
    const date = new Date(n.createdAt).toDateString()
    const label = date === today ? 'Today' : date === yesterday ? 'Yesterday' : 'Earlier'
    if (!groups[label]) groups[label] = []
    groups[label].push(n)
    return groups
  }, {} as Record<string, Notification[]>)
}

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.user?.role)
  const portalPrefix = role === 'ADMIN' ? '/admin' : role === 'COORDINATOR' ? '/coordinator' : '/student'

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list({ limit: '50' }).then((r) => r.data.data),
  })

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const notifications = data?.items || []
  const grouped = groupByDate(notifications)

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated on your placement activity"
        action={
          <Button variant="outline" onClick={() => markAllMutation.mutate()}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([label, items]) => (
            <div key={label}>
              <h3 className="text-sm font-medium text-text-secondary mb-3">{label}</h3>
              <div className="space-y-2">
                {items.map((n) => (
                  <Card
                    key={n._id}
                    className={`cursor-pointer transition-colors hover:border-accent/30 ${!n.read ? 'border-accent/20 bg-accent/5' : ''}`}
                    onClick={() => {
                      if (!n.read) markReadMutation.mutate(n._id)
                      if (n.link) {
                        const path = n.link.startsWith('/') ? n.link : `/${n.link}`
                        navigate(path.startsWith('/student') || path.startsWith('/coordinator') || path.startsWith('/admin') ? path : `${portalPrefix}${path}`)
                      }
                    }}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-accent' : 'bg-transparent'}`} />
                      <div>
                        <p className="font-medium text-sm">{n.title}</p>
                        <p className="text-text-secondary text-sm mt-0.5">{n.message}</p>
                        <p className="text-text-secondary text-xs mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
