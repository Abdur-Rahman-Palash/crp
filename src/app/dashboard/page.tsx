import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/DashboardClient'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const role = user.role

  const cards = [
    { title: 'Students', href: '/dashboard/students', roles: ['ADMIN'] },
    { title: 'Teachers', href: '/dashboard/teachers', roles: ['ADMIN'] },
    { title: 'Classes', href: '/dashboard/classes', roles: ['ADMIN'] },
    { title: 'Fees', href: '/dashboard/fees', roles: ['ADMIN'] },
    { title: 'Reports', href: '/dashboard/reports', roles: ['ADMIN'] },
    { title: 'Payments', href: '/dashboard/payments', roles: ['ACCOUNTANT'] },
    { title: 'Invoices', href: '/dashboard/invoices', roles: ['ACCOUNTANT'] },
    { title: 'Attendance', href: '/dashboard/attendance', roles: ['TEACHER'] },
    { title: 'Marks', href: '/dashboard/marks', roles: ['TEACHER'] },
  ].filter(card => card.roles.includes(role))

  return <DashboardClient cards={cards} />
}