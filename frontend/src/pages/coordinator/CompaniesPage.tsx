import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { companyApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Briefcase } from 'lucide-react'

export default function CompaniesPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', website: '', industry: '', location: '', description: '' })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['companies', search],
    queryFn: () => companyApi.list({ search }).then((r) => r.data.data),
  })

  const createMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v))
      return companyApi.create(fd)
    },
    onSuccess: () => {
      toast.success('Company created!')
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      setShowForm(false)
      setForm({ name: '', website: '', industry: '', location: '', description: '' })
    },
    onError: () => toast.error('Failed to create company'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => companyApi.delete(id),
    onSuccess: () => {
      toast.success('Company removed')
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })

  const companies = data?.items || []

  return (
    <div>
      <PageHeader
        title="Company Management"
        description="Manage recruiting partner companies"
        action={<Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> Add Company</Button>}
      />

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
            {Object.entries({ name: 'Company Name', website: 'Website', industry: 'Industry', location: 'Location', description: 'Description' }).map(([key, label]) => (
              <div key={key} className={key === 'description' ? 'col-span-2' : ''}>
                <Label>{label}</Label>
                <Input className="mt-1.5" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div className="col-span-2 flex gap-2">
              <Button onClick={() => createMutation.mutate()} disabled={!form.name}>Create</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <Input className="pl-9" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? <TableSkeleton /> : companies.length === 0 ? (
        <EmptyState icon={Briefcase} title="No companies" description="Add your first recruiting partner." action={{ label: 'Add Company', onClick: () => setShowForm(true) }} />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Company', 'Industry', 'Location', 'Actions'].map((h) => (
                    <th key={h} className="text-left p-4 text-text-secondary font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c._id} className="border-b border-border hover:bg-surface/50">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-text-secondary">{c.industry || '—'}</td>
                    <td className="p-4 text-text-secondary">{c.location || '—'}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(c._id)}>
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
