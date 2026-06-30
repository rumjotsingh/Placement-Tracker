import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { FileUp, Download, Trash2, FileText, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { resumeApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export default function ResumeVaultPage() {
  const queryClient = useQueryClient()

  const { data: resumes, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.getAll().then((r) => r.data.data),
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeApi.upload(file),
    onSuccess: () => {
      toast.success('Resume uploaded!')
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
    onError: () => toast.error('Upload failed. Only PDF files allowed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resumeApi.delete(id),
    onSuccess: () => {
      toast.success('Resume deleted')
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
  })

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) uploadMutation.mutate(files[0])
  }, [uploadMutation])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  return (
    <div>
      <PageHeader title="Resume Vault" description="Upload and manage your resume versions" />

      <Card className="mb-6">
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl m-4 p-10 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-text-secondary mx-auto mb-3" />
            <p className="font-medium">{isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}</p>
            <p className="text-text-secondary text-sm mt-1">PDF only, max 5MB</p>
            <Button className="mt-4" disabled={uploadMutation.isPending}>
              <FileUp className="h-4 w-4" /> {uploadMutation.isPending ? 'Uploading...' : 'Browse Files'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Version History</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-text-secondary text-sm">Loading...</p>
          ) : !resumes?.length ? (
            <EmptyState icon={FileText} title="No resumes uploaded" description="Upload your first resume to get started." />
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div key={resume._id} className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{resume.fileName || `Resume v${resume.version}`}</p>
                        {resume.isActive && <Badge variant="success">Active</Badge>}
                      </div>
                      <p className="text-text-secondary text-xs">Version {resume.version} · {formatDate(resume.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={resume.url} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm"><Download className="h-4 w-4" /></Button>
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(resume._id)}>
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
