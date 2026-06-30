import { useQuery } from '@tanstack/react-query'
import { Calendar, Video } from 'lucide-react'
import { interviewApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, formatDateTime } from '@/lib/utils'

export default function InterviewsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => interviewApi.list().then((r) => r.data.data),
  })

  const interviews = data?.items || []

  return (
    <div>
      <PageHeader title="Interviews" description="Your scheduled interviews and feedback" />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {isLoading ? <TableSkeleton /> : interviews.length === 0 ? (
            <EmptyState icon={Calendar} title="No interviews scheduled" description="Interviews will appear here once scheduled by your coordinator." />
          ) : (
            <div className="space-y-4 mt-4">
              {interviews.map((interview) => (
                <Card key={interview._id} className="hover:border-accent/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-accent/10 p-3">
                          <Calendar className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold">{interview.application?.drive?.company?.name}</p>
                          <p className="text-text-secondary text-sm">{interview.application?.drive?.jobRole}</p>
                          <p className="text-sm mt-1">{formatDateTime(interview.date)} · {interview.time}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{interview.mode}</Badge>
                            <Badge variant={interview.result === 'Passed' ? 'success' : interview.result === 'Failed' ? 'danger' : 'default'}>
                              {interview.result}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {interview.meetingLink && (
                        <a href={interview.meetingLink} target="_blank" rel="noreferrer">
                          <Button size="sm"><Video className="h-4 w-4" /> Join Meeting</Button>
                        </a>
                      )}
                    </div>
                    {interview.notes && <p className="text-text-secondary text-sm mt-3 pl-16">{interview.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline">
          <div className="relative mt-6 pl-6 border-l border-border space-y-6">
            {interviews.map((interview) => (
              <div key={interview._id} className="relative">
                <div className="absolute -left-[25px] top-1 h-3 w-3 rounded-full bg-accent border-2 border-background" />
                <Card>
                  <CardContent className="p-4">
                    <p className="font-medium text-sm">{interview.application?.drive?.company?.name}</p>
                    <p className="text-text-secondary text-xs">{formatDate(interview.date)} · {interview.time}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
            {!interviews.length && <p className="text-text-secondary text-sm">No interviews to show</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
