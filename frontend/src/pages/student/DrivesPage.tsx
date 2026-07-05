import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Clock, Users, CheckCircle2 } from 'lucide-react'
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

  const { data, isLoading } = useQuery({
    queryKey: ['drives', search],
    queryFn: () => driveApi.list({ status: 'OPEN', search }).then((r) => r.data.data),
  })

  const { data: applications } = useQuery({
    queryKey: ['applications', 'my'],
    queryFn: () => applicationApi.getMy().then((r) => r.data.data),
  })

  const appliedDriveIds = new Set(
    applications?.items?.filter((a) => !a.withdrawn).map((a) => a.drive?._id || (a.drive as unknown as string)) || []
  )

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

      {isLoading ? (
        <DashboardSkeleton />
      ) : drives.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No active drives"
          description="Check back later for new placement opportunities."
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {drives.map((drive, i) => {
            const hasApplied = appliedDriveIds.has(drive._id)

            return (
              <motion.div
                key={drive._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:border-accent/30 transition-all duration-200 flex flex-col">
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex items-start gap-3">
                        {drive.company?.logo ? (
                          <img
                            src={drive.company.logo}
                            alt={drive.company.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
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
                      {hasApplied && (
                        <Badge className="bg-accent/10 text-accent border-accent/20 shrink-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Applied
                        </Badge>
                      )}
                    </div>

                    <p className="text-2xl font-bold text-accent mb-3">{drive.package}</p>

                    <div className="space-y-1.5 text-sm text-text-secondary mb-4 flex-1">
                      {drive.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {drive.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        Deadline: {formatDate(drive.deadline)}
                      </div>
                      {drive.eligibilityCriteria?.minCgpa > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" />
                          Min CGPA: {drive.eligibilityCriteria.minCgpa}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {drive.eligibilityCriteria?.eligibleBranches?.map((b) => (
                        <Badge key={b} variant="outline" className="text-xs">
                          {b}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      variant={hasApplied ? 'outline' : 'default'}
                      onClick={() => navigate(`/student/drives/${drive._id}`)}
                    >
                      {hasApplied ? 'View Application' : 'View & Apply'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
