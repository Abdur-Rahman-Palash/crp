import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { StudentsClient } from '@/components/StudentsClient'

export default async function StudentsPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { name: 'asc' }
  })

  return <StudentsClient students={students} />
}