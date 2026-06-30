import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { driveApi, companyApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'

export default function CoordinatorDrivesPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    company: '', jobRole: '', package: '', location: '', deadline: '', driveDate: '', minCgpa: '0',
  })
  const queryClient = useQueryClient()

  const { data: drives } = useQuery({
    queryKey: ['drives', 'all'],
    queryFn: () => driveApi.list().then((r) => r.data.data),
  })

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyApi.list().then((r) => r.data.data),
  })

  const createMutation = useMutation({
    mutationFn: () => driveApi.create({
      ...form,
      eligibilityCriteria: { minCgpa: Number(form.minCgpa), eligibleBranches: [] },
    }),
    onSuccess: () => {
      toast.success('Drive created!')
      queryClient.invalidateQueries({ queryKey: ['drives'] })
      setShowForm(false)
    },
    onError: () => toast.error('Failed to create drive'),
  })

  const closeMutation = useMutation({
    mutationFn: (id: string) => driveApi.close(id),
    onSuccess: () => {
      toast.success('Drive closed')
      queryClient.invalidateQueries({ queryKey: ['drives'] })
    },
  })

  return (
    <div>
      <PageHeader title="Drive Management" description="Create and manage placement drives" action={<Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> Create Drive</Button>} />

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Company</Label>
              <select className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
                <option value="">Select company</option>
                {companies?.items?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            {[
              { key: 'jobRole', label: 'Job Role' },
              { key: 'package', label: 'Package' },
              { key: 'location', label: 'Location' },
              { key: 'deadline', label: 'Deadline', type: 'datetime-local' },
              { key: 'driveDate', label: 'Drive Date', type: 'datetime-local' },
              { key: 'minCgpa', label: 'Min CGPA', type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input type={type || 'text'} className="mt-1.5" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div className="col-span-2 flex gap-2">
              <Button onClick={() => createMutation.mutate()}>Create Drive</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {drives?.items?.map((drive) => (
          <Card key={drive._id}>
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{drive.company?.name} — {drive.jobRole}</p>
                <p className="text-accent font-medium">{drive.package}</p>
                <p className="text-text-secondary text-sm">Deadline: {formatDate(drive.deadline)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={drive.status} />
                {drive.status === 'OPEN' && (
                  <Button variant="outline" size="sm" onClick={() => closeMutation.mutate(drive._id)}>Close Drive</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
