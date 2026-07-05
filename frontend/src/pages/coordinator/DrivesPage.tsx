import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Briefcase, Pencil, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { driveApi, companyApi } from '@/services'
import { BRANCHES, JOB_TYPES } from '@/constants'
import type { PlacementDrive } from '@/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { FormDialog } from '@/components/shared/FormDialog'
import {
  DatePicker,
  dateToDeadlineISO,
  dateToDriveISO,
  isoToLocalDate,
} from '@/components/shared/DateTimePicker'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'

type DriveForm = {
  company: string
  jobRole: string
  package: string
  jobType: string
  location: string
  description: string
  deadlineDate: Date | undefined
  driveDateDate: Date | undefined
  minCgpa: string
  eligibleBranches: string[]
}

const initialForm: DriveForm = {
  company: '',
  jobRole: '',
  package: '',
  jobType: 'Full-Time',
  location: '',
  description: '',
  deadlineDate: undefined,
  driveDateDate: undefined,
  minCgpa: '0',
  eligibleBranches: [],
}

function driveToForm(drive: PlacementDrive): DriveForm {
  return {
    company: typeof drive.company === 'object' ? drive.company._id : String(drive.company),
    jobRole: drive.jobRole,
    package: drive.package,
    jobType: drive.jobType || 'Full-Time',
    location: drive.location || '',
    description: drive.description || '',
    deadlineDate: isoToLocalDate(drive.deadline),
    driveDateDate: isoToLocalDate(drive.driveDate),
    minCgpa: String(drive.eligibilityCriteria?.minCgpa ?? 0),
    eligibleBranches: drive.eligibilityCriteria?.eligibleBranches ?? [],
  }
}

function formToPayload(form: DriveForm) {
  return {
    company: form.company,
    jobRole: form.jobRole,
    package: form.package,
    jobType: form.jobType,
    location: form.location || undefined,
    description: form.description || undefined,
    deadline: dateToDeadlineISO(form.deadlineDate),
    driveDate: dateToDriveISO(form.driveDateDate),
    eligibilityCriteria: {
      minCgpa: Number(form.minCgpa),
      eligibleBranches: form.eligibleBranches,
    },
  }
}

function DriveFormFields({
  form,
  setForm,
  companies,
  validationErrors,
  isEditing,
}: {
  form: DriveForm
  setForm: React.Dispatch<React.SetStateAction<DriveForm>>
  companies: { _id: string; name: string }[] | undefined
  validationErrors: Record<string, string>
  isEditing: boolean
}) {
  const toggleBranch = (branch: string) => {
    setForm((prev) => ({
      ...prev,
      eligibleBranches: prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch],
    }))
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
      <div className="sm:col-span-2">
        <Label>Company *</Label>
        <select
          className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        >
          <option value="">Select company</option>
          {companies?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Job Role *</Label>
        <Input
          placeholder="e.g. SDE Intern"
          className="mt-1.5"
          value={form.jobRole}
          onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
        />
      </div>

      <div>
        <Label>Package *</Label>
        <Input
          placeholder="e.g. 12 LPA"
          className="mt-1.5"
          value={form.package}
          onChange={(e) => setForm({ ...form, package: e.target.value })}
        />
      </div>

      <div>
        <Label>Job Type</Label>
        <select
          className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          value={form.jobType}
          onChange={(e) => setForm({ ...form, jobType: e.target.value })}
        >
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Location</Label>
        <Input
          placeholder="e.g. Bangalore"
          className="mt-1.5"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>

      <div>
        <Label>Min CGPA</Label>
        <Input
          type="number"
          min="0"
          max="10"
          step="0.01"
          className="mt-1.5"
          value={form.minCgpa}
          onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
        />
      </div>

      <div className="sm:col-span-2">
        <DatePicker
          label="Application Deadline"
          date={form.deadlineDate}
          onDateChange={(d) => setForm({ ...form, deadlineDate: d })}
          minDate={isEditing ? undefined : new Date()}
          required
          error={validationErrors.deadline}
        />
      </div>

      <div className="sm:col-span-2">
        <DatePicker
          label="Drive Date"
          date={form.driveDateDate}
          onDateChange={(d) => setForm({ ...form, driveDateDate: d })}
          minDate={
            form.deadlineDate
              ? new Date(form.deadlineDate.getFullYear(), form.deadlineDate.getMonth(), form.deadlineDate.getDate() + 1)
              : new Date()
          }
          required
          error={validationErrors.driveDate}
        />
      </div>

      <div className="sm:col-span-2">
        <Label>Eligible Branches</Label>
        <p className="text-text-secondary text-xs mt-1 mb-2">
          Leave all unchecked to allow all branches
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BRANCHES.map((branch) => (
            <label key={branch} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={form.eligibleBranches.includes(branch)}
                onCheckedChange={() => toggleBranch(branch)}
              />
              {branch}
            </label>
          ))}
        </div>
      </div>

      <div className="sm:col-span-2">
        <Label>Job Description</Label>
        <Textarea
          placeholder="Role responsibilities, requirements, interview process..."
          className="mt-1.5"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
    </div>
  )
}

export default function CoordinatorDrivesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const portalBase = location.pathname.startsWith('/admin') ? '/admin' : '/coordinator'
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PlacementDrive | null>(null)
  const [form, setForm] = useState<DriveForm>(initialForm)
  const queryClient = useQueryClient()

  const isEditing = !!editingDrive

  const { data: drives, isLoading } = useQuery({
    queryKey: ['drives', 'all'],
    queryFn: () => driveApi.list().then((r) => r.data.data),
  })

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyApi.list().then((r) => r.data.data),
  })

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {}
    const deadline = dateToDeadlineISO(form.deadlineDate)
    const driveDate = dateToDriveISO(form.driveDateDate)

    if (deadline && driveDate) {
      if (new Date(deadline) >= new Date(driveDate)) {
        errors.deadline = 'Deadline must be before the drive date'
        errors.driveDate = 'Drive date must be after the deadline'
      }
      if (!isEditing && new Date(deadline) <= new Date()) {
        errors.deadline = 'Deadline must be in the future'
      }
    }

    return errors
  }, [form.deadlineDate, form.driveDateDate, isEditing])

  const resetDialog = () => {
    setDialogOpen(false)
    setEditingDrive(null)
    setForm(initialForm)
  }

  const createMutation = useMutation({
    mutationFn: () => driveApi.create(formToPayload(form)),
    onSuccess: () => {
      toast.success('Drive created!')
      queryClient.invalidateQueries({ queryKey: ['drives'] })
      resetDialog()
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create drive'
      toast.error(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: () => driveApi.update(editingDrive!._id, formToPayload(form)),
    onSuccess: () => {
      toast.success('Drive updated!')
      queryClient.invalidateQueries({ queryKey: ['drives'] })
      resetDialog()
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update drive'
      toast.error(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => driveApi.delete(id),
    onSuccess: () => {
      toast.success('Drive deleted')
      queryClient.invalidateQueries({ queryKey: ['drives'] })
      setDeleteTarget(null)
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to delete drive'
      toast.error(msg)
    },
  })

  const closeMutation = useMutation({
    mutationFn: (id: string) => driveApi.close(id),
    onSuccess: () => {
      toast.success('Drive closed')
      queryClient.invalidateQueries({ queryKey: ['drives'] })
    },
  })

  const driveList = drives?.items || []
  const companyItems = companies?.items

  const hasRequiredFields =
    form.company && form.jobRole && form.package && form.deadlineDate && form.driveDateDate

  const canSubmit = hasRequiredFields && Object.keys(validationErrors).length === 0

  const openCreateDialog = () => {
    setEditingDrive(null)
    setForm(initialForm)
    setDialogOpen(true)
  }

  const openEditDialog = (drive: PlacementDrive) => {
    setEditingDrive(drive)
    setForm(driveToForm(drive))
    setDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) resetDialog()
    else setDialogOpen(true)
  }

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      openCreateDialog()
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  return (
    <div>
      <PageHeader
        title="Drive Management"
        description="Create and manage placement drives"
        action={
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4" /> Create Drive
          </Button>
        }
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        title={isEditing ? 'Edit Placement Drive' : 'Create Placement Drive'}
        description={
          isEditing
            ? 'Update drive details. Deadline must still be before the drive date.'
            : 'Set up a new campus recruitment drive. Students will be checked against eligibility criteria when applying.'
        }
        submitLabel={isEditing ? 'Save Changes' : 'Create Drive'}
        onSubmit={() => (isEditing ? updateMutation.mutate() : createMutation.mutate())}
        loading={createMutation.isPending || updateMutation.isPending}
        disabled={!canSubmit}
        size="xl"
      >
        <DriveFormFields
          form={form}
          setForm={setForm}
          companies={companyItems}
          validationErrors={validationErrors}
          isEditing={isEditing}
        />
      </FormDialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Drive</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the drive for{' '}
              <strong>
                {deleteTarget?.company?.name} — {deleteTarget?.jobRole}
              </strong>
              ? This cannot be undone. Drives with existing applications cannot be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Drive'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <p className="text-text-secondary text-sm">Loading drives...</p>
      ) : driveList.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No placement drives"
          description="Create your first drive to start accepting applications."
          action={{ label: 'Create Drive', onClick: openCreateDialog }}
        />
      ) : (
        <div className="space-y-3">
          {driveList.map((drive) => (
            <Card key={drive._id} className="card-hover">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">
                      {drive.company?.name} — {drive.jobRole}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {drive.jobType}
                    </Badge>
                  </div>
                  <p className="text-accent font-medium">{drive.package}</p>
                  <p className="text-text-secondary text-sm">
                    Deadline: {formatDate(drive.deadline)} · Drive: {formatDate(drive.driveDate)}
                  </p>
                  {drive.eligibilityCriteria?.eligibleBranches?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {drive.eligibilityCriteria.eligibleBranches.map((b) => (
                        <Badge key={b} variant="outline" className="text-xs">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={drive.status} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`${portalBase}/drives/${drive._id}/applicants`)}
                  >
                    <Users className="h-3.5 w-3.5" /> Applicants
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(drive)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  {drive.status === 'OPEN' && (
                    <Button variant="outline" size="sm" onClick={() => closeMutation.mutate(drive._id)}>
                      Close
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(drive)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
