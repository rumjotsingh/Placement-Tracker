import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Trash2, Briefcase } from 'lucide-react'
import { toast } from 'sonner'
import { companyApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { FormDialog } from '@/components/shared/FormDialog'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialForm = {
  name: '',
  website: '',
  industry: '',
  location: '',
  description: '',
}

export default function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
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
      setDialogOpen(false)
      setForm(initialForm)
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

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setDialogOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const openAddDialog = () => setDialogOpen(true)

  return (
    <div>
      <PageHeader
        title="Company Management"
        description="Manage recruiting partner companies"
        action={
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4" /> Add Company
          </Button>
        }
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add Company"
        description="Add a new recruiting partner to the placement portal."
        submitLabel="Create Company"
        onSubmit={() => createMutation.mutate()}
        loading={createMutation.isPending}
        disabled={!form.name.trim()}
        size="lg"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Company Name *</Label>
            <Input
              className="mt-1.5"
              placeholder="e.g. Google, Microsoft"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input
              className="mt-1.5"
              placeholder="https://company.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>
          <div>
            <Label>Industry</Label>
            <Input
              className="mt-1.5"
              placeholder="e.g. Technology, Finance"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              className="mt-1.5"
              placeholder="e.g. Bangalore, India"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <textarea
              className="mt-1.5 flex min-h-[100px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              placeholder="Brief description about the company..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
      </FormDialog>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <Input
          className="pl-9"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No companies"
          description="Add your first recruiting partner."
          action={{ label: 'Add Company', onClick: openAddDialog }}
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Company', 'Industry', 'Location', 'Actions'].map((h) => (
                    <th key={h} className="text-left p-4 text-text-secondary font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c._id} className="border-b border-border hover:bg-surface/50 transition-colors">
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
