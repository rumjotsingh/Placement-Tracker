import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { searchApi } from '@/services'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function StudentsPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['students', search],
    queryFn: () => searchApi.students({ search }).then((r) => r.data.data),
  })

  const students = data?.items || []

  return (
    <div>
      <PageHeader title="Student Management" description="Search and view student profiles" />
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <Input className="pl-9" placeholder="Search by name, email, roll number..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Name', 'Roll Number', 'Branch', 'Email', 'Year'].map((h) => (
                  <th key={h} className="text-left p-4 text-text-secondary font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-text-secondary">Loading...</td></tr>
              ) : students.map((s) => (
                <tr key={s._id} className="border-b border-border hover:bg-surface/50">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 text-text-secondary">{s.rollNumber}</td>
                  <td className="p-4"><Badge variant="outline">{s.branch}</Badge></td>
                  <td className="p-4 text-text-secondary">{s.email}</td>
                  <td className="p-4 text-text-secondary">{s.graduationYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
