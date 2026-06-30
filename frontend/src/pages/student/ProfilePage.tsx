import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Code2, RefreshCw, Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { profileApi, codingApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMyProfile().then((r) => r.data.data),
  })

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated')
      setEditing(false)
    },
    onError: () => toast.error('Failed to update profile'),
  })

  const syncMutation = useMutation({
    mutationFn: () => codingApi.syncAll(),
    onSuccess: () => {
      toast.success('Profiles synced!')
      queryClient.invalidateQueries({ queryKey: ['coding'] })
    },
    onError: () => toast.error('Sync failed'),
  })

  if (isLoading) return <><PageHeader title="Profile" /><DashboardSkeleton /></>

  const u = profile?.user || user

  const startEdit = () => {
    setForm({
      cgpa: profile?.cgpa,
      phone: profile?.phone,
      skills: profile?.skills?.join(', '),
      githubUsername: profile?.githubUsername,
      leetcodeUsername: profile?.leetcodeUsername,
      codeforcesUsername: profile?.codeforcesUsername,
    })
    setEditing(true)
  }

  const saveEdit = () => {
    updateMutation.mutate({
      ...form,
      skills: (form.skills as string)?.split(',').map((s) => s.trim()).filter(Boolean),
    })
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your personal and coding profiles"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending}>
              <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} /> Sync All
            </Button>
            <Button onClick={editing ? saveEdit : startEdit}>
              <Edit2 className="h-4 w-4" /> {editing ? 'Save' : 'Edit Profile'}
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.profileImage} />
              <AvatarFallback className="text-xl bg-accent/20 text-accent">{getInitials(u?.name || '')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{u?.name}</h2>
              <p className="text-text-secondary">{u?.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">{u?.branch}</Badge>
                <Badge variant="outline">CGPA: {profile?.cgpa ?? 'N/A'}</Badge>
                <Badge variant="outline">Class of {u?.graduationYear}</Badge>
                <Badge variant="outline">{u?.rollNumber}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editing && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'cgpa', label: 'CGPA', type: 'number' },
              { key: 'phone', label: 'Phone' },
              { key: 'skills', label: 'Skills (comma separated)' },
              { key: 'githubUsername', label: 'GitHub Username' },
              { key: 'leetcodeUsername', label: 'LeetCode Username' },
              { key: 'codeforcesUsername', label: 'Codeforces Username' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type={type || 'text'}
                  className="mt-1.5"
                  value={form[key] as string || ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { platform: 'GitHub', icon: Code2, username: profile?.githubUsername, color: 'text-white' },
          { platform: 'LeetCode', icon: Code2, username: profile?.leetcodeUsername, color: 'text-yellow-400' },
          { platform: 'Codeforces', icon: Code2, username: profile?.codeforcesUsername, color: 'text-blue-400' },
        ].map(({ platform, icon: Icon, username, color }) => (
          <Card key={platform}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="font-medium">{platform}</span>
              </div>
              <p className="text-text-secondary text-sm">{username || 'Not connected'}</p>
              {username && <p className="text-xs text-text-secondary mt-2">@{username}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {profile?.skills?.length ? (
        <Card className="mb-6">
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profile.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
          </CardContent>
        </Card>
      ) : null}

      {profile?.projects?.length ? (
        <Card>
          <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {profile.projects.map((p) => (
              <div key={p._id || p.title} className="p-4 rounded-lg bg-surface border border-border">
                <p className="font-medium">{p.title}</p>
                {p.description && <p className="text-text-secondary text-sm mt-1">{p.description}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
