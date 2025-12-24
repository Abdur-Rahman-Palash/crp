import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { TeachersClient } from '@/components/TeachersClient'

export default async function TeachersPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const teachers = await prisma.teacher.findMany({
    include: { user: true, classes: true },
    orderBy: { user: { name: 'asc' } }
  })

  // Transform data for client component
  const transformedTeachers = teachers.map(teacher => ({
    id: teacher.id,
    name: teacher.user.name || '',
    email: teacher.user.email,
    phone: '', // Teachers don't have phone in current schema
    subject: teacher.subjects.length > 0 ? teacher.subjects[0] : '', // Take first subject
    classes: teacher.classes
  }))

  return <TeachersClient teachers={transformedTeachers} />
}