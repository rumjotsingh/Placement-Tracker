import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { driveApi, applicationApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDateTime } from '@/lib/utils'

export default function DriveDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: drive, isLoading } = useQuery({
    queryKey: ['drive', id],
    queryFn: () => driveApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  const { data: eligibility, isLoading: checkingEligibility } = useQuery({
    queryKey: ['drive-eligibility', id],
    queryFn: () => driveApi.getEligibility(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  const applyMutation = useMutation({
    mutationFn: () => applicationApi.apply(id!),
    onSuccess: () => {
      toast.success('Application submitted successfully!')
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['drive-eligibility', id] })
      setConfirmOpen(false)
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to apply'
      toast.error(msg)
    },
  })

  if (isLoading) return <DashboardSkeleton />

  if (!drive) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary mb-4">Drive not found</p>
        <Button variant="outline" onClick={() => navigate('/student/drives')}>
          Back to Drives
        </Button>
      </div>
    )
  }

  const isEligible = eligibility?.eligible
  const alreadyApplied = eligibility?.reasons?.some((r) => r.includes('already applied'))

  return (
    <div>
      <Button variant="ghost" className="mb-4 -ml-2" onClick={() => navigate('/student/drives')}>
        <ArrowLeft className="h-4 w-4" /> Back to Drives
      </Button>

      <PageHeader
        title={`${drive.company?.name} — ${drive.jobRole}`}
        description={drive.jobType || 'Placement Drive'}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                {drive.company?.logo ? (
                  <img
                    src={drive.company.logo}
                    alt={drive.company.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Briefcase className="h-7 w-7 text-accent" />
                  </div>
                )}
                <div>
                  <p className="text-3xl font-bold text-accent">{drive.package}</p>
                  <p className="text-text-secondary">{drive.company?.name}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {drive.location && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin className="h-4 w-4" /> {drive.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="h-4 w-4" /> Deadline: {formatDateTime(drive.deadline)}
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="h-4 w-4" /> Drive Date: {formatDateTime(drive.driveDate)}
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Users className="h-4 w-4" />
                  Min CGPA: {drive.eligibilityCriteria?.minCgpa || 'No minimum'}
                </div>
              </div>

              {drive.description && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Job Description
                  </h3>
                  <p className="text-text-secondary text-sm whitespace-pre-wrap">{drive.description}</p>
                </div>
              )}

              {drive.eligibilityCriteria?.eligibleBranches?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Eligible Branches</p>
                  <div className="flex flex-wrap gap-2">
                    {drive.eligibilityCriteria.eligibleBranches.map((b) => (
                      <Badge key={b} variant="outline">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Eligibility Check</h3>

              {checkingEligibility ? (
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Checking eligibility...
                </div>
              ) : (
                <>
                  {eligibility?.student && (
                    <div className="text-sm text-text-secondary space-y-1 mb-4 pb-4 border-b border-border">
                      <p>Your CGPA: {eligibility.student.cgpa ?? 'Not set'}</p>
                      <p>Your Branch: {eligibility.student.branch ?? 'Not set'}</p>
                      <p>Active Resume: {eligibility.student.hasResume ? 'Yes' : 'No'}</p>
                    </div>
                  )}

                  {isEligible ? (
                    <div className="flex items-start gap-2 text-accent mb-4">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      <p className="text-sm">You meet all eligibility criteria for this drive.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {eligibility?.reasons.map((reason) => (
                        <div key={reason} className="flex items-start gap-2 text-danger text-sm">
                          <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {!eligibility?.student?.hasResume && (
                    <Button variant="outline" size="sm" className="w-full mb-3" asChild>
                      <Link to="/student/resume">Upload Resume</Link>
                    </Button>
                  )}

                  {!eligibility?.student?.cgpa && drive.eligibilityCriteria?.minCgpa > 0 && (
                    <Button variant="outline" size="sm" className="w-full mb-3" asChild>
                      <Link to="/student/profile">Update Profile</Link>
                    </Button>
                  )}

                  <Button
                    className="w-full"
                    disabled={!isEligible || applyMutation.isPending || alreadyApplied}
                    onClick={() => setConfirmOpen(true)}
                  >
                    {alreadyApplied
                      ? 'Already Applied'
                      : applyMutation.isPending
                        ? 'Submitting...'
                        : 'Apply to Drive'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogDescription>
              You are applying for <strong>{drive.jobRole}</strong> at{' '}
              <strong>{drive.company?.name}</strong>. This action cannot be undone easily.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                'Confirm Apply'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
