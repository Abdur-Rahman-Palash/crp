import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ClassesPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const classes = await prisma.class.findMany({
    include: { teacher: { include: { user: true } }, _count: { select: { students: true } } }
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Classes</h1>
        <Link href="/dashboard/classes/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Class
          </button>
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cls.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cls.section || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cls.teacher?.user.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cls._count.students}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/dashboard/classes/${cls.id}/edit`}>
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  </Link>
                  <form action={async () => {
                    'use server'
                    await prisma.class.delete({ where: { id: cls.id } })
                    redirect('/dashboard/classes')
                  }} className="inline">
                    <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}