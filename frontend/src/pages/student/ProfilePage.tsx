import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, Edit2, ExternalLink, Code2, Mail, Phone, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { profileApi, codingApi } from '@/services'
import { CODING_PLATFORMS } from '@/constants/codingPlatforms'
import { PageHeader } from '@/components/shared/PageHeader'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getInitials, getApiError } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const queryClient = useQueryClient()
  const navigate = useNavigate()
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
    onSuccess: (res) => {
      const errors = res.data.data.errors as { platform: string; message: string }[]
      if (errors?.length) {
        errors.forEach((e) => toast.error(`${e.platform}: ${e.message}`))
        toast.warning(`Synced with ${errors.length} error(s)`)
      } else {
        toast.success('Profiles synced!')
      }
      queryClient.invalidateQueries({ queryKey: ['coding'] })
    },
    onError: (err) => toast.error(getApiError(err, 'Sync failed')),
  })

  if (isLoading) {
    return (
      <>
        <PageHeader title="Profile" />
        <DashboardSkeleton />
      </>
    )
  }

  const u = profile?.user || user
  const connectedPlatforms = CODING_PLATFORMS.filter((p) => profile?.[p.usernameKey])

  const startEdit = () => {
    setForm({
      cgpa: profile?.cgpa ?? '',
      phone: profile?.phone ?? '',
      skills: profile?.skills?.join(', ') ?? '',
      githubUsername: profile?.githubUsername ?? '',
      leetcodeUsername: profile?.leetcodeUsername ?? '',
      codeforcesUsername: profile?.codeforcesUsername ?? '',
      codechefUsername: profile?.codechefUsername ?? '',
      geeksforgeeksUsername: profile?.geeksforgeeksUsername ?? '',
    })
    setEditing(true)
  }

  const saveEdit = () => {
    updateMutation.mutate({
      ...form,
      cgpa: form.cgpa ? Number(form.cgpa) : undefined,
      skills: (form.skills as string)?.split(',').map((s) => s.trim()).filter(Boolean),
    })
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your academic info and coding platform connections"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
            >
              <RefreshCw className={cn('h-4 w-4', syncMutation.isPending && 'animate-spin')} />
              Sync All
            </Button>
            <Button onClick={editing ? saveEdit : startEdit} disabled={updateMutation.isPending}>
              <Edit2 className="h-4 w-4" /> {editing ? 'Save' : 'Edit Profile'}
            </Button>
          </div>
        }
      />

      <Card className="mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-accent/20 via-accent/5 to-transparent" />
        <CardContent className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-accent/30">
              <AvatarImage src={profile?.profileImage} />
              <AvatarFallback className="text-2xl bg-accent/20 text-accent">
                {getInitials(u?.name || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-2 sm:pt-8">
              <h2 className="text-2xl font-bold">{u?.name}</h2>
              <p className="text-text-secondary flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> {u?.email}
              </p>
              {profile?.phone && (
                <p className="text-text-secondary text-sm flex items-center gap-1.5 mt-1">
                  <Phone className="h-3.5 w-3.5" /> {profile.phone}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">{u?.branch}</Badge>
                <Badge variant="outline">CGPA: {profile?.cgpa ?? 'N/A'}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> Class of {u?.graduationYear}
                </Badge>
                <Badge variant="outline">{u?.rollNumber}</Badge>
              </div>
            </div>
            <Button
              variant="outline"
              className="sm:mt-8"
              onClick={() => navigate('/student/coding')}
            >
              <Code2 className="h-4 w-4" /> View Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="coding" className="mb-6">
        <TabsList>
          <TabsTrigger value="coding">Coding Profiles</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="skills">Skills & Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="coding" className="mt-4">
          {editing ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Connect Coding Platforms</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {CODING_PLATFORMS.map((platform) => (
                  <div key={platform.id}>
                    <Label>{platform.name} Username</Label>
                    <Input
                      placeholder={
                        platform.id === 'geeksforgeeks'
                          ? 'From geeksforgeeks.org/user/{username}'
                          : platform.id === 'codechef'
                            ? 'From codechef.com/users/{handle}'
                            : `Your ${platform.name} handle`
                      }
                      className="mt-1.5"
                      value={(form[platform.usernameKey] as string) || ''}
                      onChange={(e) =>
                        setForm({ ...form, [platform.usernameKey]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CODING_PLATFORMS.map((platform) => {
                const username = profile?.[platform.usernameKey] as string | undefined
                const connected = !!username
                return (
                  <Card
                    key={platform.id}
                    className={cn(
                      'transition-all hover:border-accent/30',
                      platform.border,
                      !connected && 'opacity-70'
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xs',
                            platform.bg,
                            platform.color
                          )}
                        >
                          {platform.shortName}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{platform.name}</p>
                          {connected ? (
                            <p className="text-xs text-text-secondary truncate">@{username}</p>
                          ) : (
                            <p className="text-xs text-text-secondary">Not connected</p>
                          )}
                        </div>
                        {connected && (
                          <a
                            href={platform.profileUrl(username)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent hover:text-accent-hover"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          connected
                            ? 'border-accent/30 text-accent'
                            : 'border-border text-text-secondary'
                        )}
                      >
                        {connected ? 'Connected' : 'Add username to connect'}
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
          {!editing && connectedPlatforms.length > 0 && (
            <p className="text-sm text-text-secondary mt-4 text-center">
              {connectedPlatforms.length} of {CODING_PLATFORMS.length} platforms connected ·{' '}
              <button
                className="text-accent hover:underline"
                onClick={() => navigate('/student/coding')}
              >
                View synced stats →
              </button>
            </p>
          )}
        </TabsContent>

        <TabsContent value="personal" className="mt-4">
          {editing ? (
            <Card>
              <CardContent className="grid sm:grid-cols-2 gap-4 pt-6">
                {[
                  { key: 'cgpa', label: 'CGPA', type: 'number' },
                  { key: 'phone', label: 'Phone' },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      type={type || 'text'}
                      className="mt-1.5"
                      value={form[key] as string}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Roll Number', value: u?.rollNumber },
                  { label: 'Branch', value: u?.branch },
                  { label: 'CGPA', value: profile?.cgpa },
                  { label: 'Graduation Year', value: u?.graduationYear },
                  { label: 'Phone', value: profile?.phone || '—' },
                  { label: 'Email', value: u?.email },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 rounded-lg bg-surface border border-border">
                    <p className="text-xs text-text-secondary uppercase tracking-wide">{label}</p>
                    <p className="font-medium mt-1">{value ?? '—'}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="skills" className="mt-4 space-y-4">
          {editing && (
            <Card>
              <CardContent className="pt-6">
                <Label>Skills (comma separated)</Label>
                <Input
                  className="mt-1.5"
                  value={form.skills as string}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </CardContent>
            </Card>
          )}
          {profile?.skills?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-text-secondary text-sm">
                No skills added yet. Edit profile to add skills.
              </CardContent>
            </Card>
          )}
          {profile?.projects?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.projects.map((p) => (
                  <div
                    key={p._id || p.title}
                    className="p-4 rounded-lg bg-surface border border-border"
                  >
                    <p className="font-medium">{p.title}</p>
                    {p.description && (
                      <p className="text-text-secondary text-sm mt-1">{p.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}
