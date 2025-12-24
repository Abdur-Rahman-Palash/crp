import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AddStudentForm } from '@/components/AddStudentForm'

export default async function AddStudentPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const classes = await prisma.class.findMany({
    orderBy: { name: 'asc' }
  })

  return <AddStudentForm classes={classes} />
}