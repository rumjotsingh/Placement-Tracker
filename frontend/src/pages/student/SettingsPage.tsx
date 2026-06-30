import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'

export default function SettingsPage() {
  const { user } = useAuthStore()

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account preferences" />
      <Card>
        <CardHeader><CardTitle>Account Information</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Roll Number', value: user?.rollNumber },
            { label: 'Branch', value: user?.branch },
            { label: 'Role', value: user?.role },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-text-secondary text-sm">{label}</span>
              <span className="text-sm font-medium">{value || '—'}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
