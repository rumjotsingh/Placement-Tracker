import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Clock, Users, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { driveApi, applicationApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'

export default function DrivesPage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['drives', search],
    queryFn: () => driveApi.list({ status: 'OPEN', search }).then((r) => r.data.data),
  })

  const applyMutation = useMutation({
    mutationFn: (driveId: string) => applicationApi.apply(driveId),
    onSuccess: () => {
      toast.success('Application submitted!')
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to apply'
      toast.error(msg)
    },
  })

  const drives = data?.items || []

  return (
    <div>
      <PageHeader title="Placement Drives" description="Browse and apply to open recruitment drives" />
      <Input
        placeholder="Search drives..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm mb-6"
      />

      {isLoading ? <DashboardSkeleton /> : drives.length === 0 ? (
        <EmptyState icon={Briefcase} title="No active drives" description="Check back later for new placement opportunities." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {drives.map((drive, i) => (
            <motion.div key={drive._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full hover:border-accent/30 transition-all duration-200 flex flex-col">
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    {drive.company?.logo ? (
                      <img src={drive.company.logo} alt={drive.company.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-accent" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{drive.company?.name}</p>
                      <p className="text-text-secondary text-sm">{drive.jobRole}</p>
                    </div>
                  </div>

                  <p className="text-2xl font-bold text-accent mb-3">{drive.package}</p>

                  <div className="space-y-1.5 text-sm text-text-secondary mb-4 flex-1">
                    {drive.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{drive.location}</div>}
                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />Deadline: {formatDate(drive.deadline)}</div>
                    {drive.eligibilityCriteria?.minCgpa > 0 && (
                      <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />Min CGPA: {drive.eligibilityCriteria.minCgpa}</div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {drive.eligibilityCriteria?.eligibleBranches?.map((b) => (
                      <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => applyMutation.mutate(drive._id)}
                      disabled={applyMutation.isPending}
                    >
                      {applyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply Now'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate(`/student/drives/${drive._id}`)}>Details</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
