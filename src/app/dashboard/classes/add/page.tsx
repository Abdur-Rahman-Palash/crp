import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AddClassPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const teachers = await prisma.teacher.findMany({
    include: { user: true }
  })

  async function addClass(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const section = formData.get('section') as string
    const teacherId = formData.get('teacherId') as string

    await prisma.class.create({
      data: {
        name,
        section: section || null,
        teacherId: teacherId || null
      }
    })

    redirect('/dashboard/classes')
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/classes">
          <button className="text-blue-600 hover:text-blue-900 mr-4">&larr; Back to Classes</button>
        </Link>
        <h1 className="text-3xl font-bold">Add Class</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={addClass} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Class Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section (Optional)</label>
            <input
              type="text"
              id="section"
              name="section"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">Class Teacher (Optional)</label>
            <select
              id="teacherId"
              name="teacherId"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.user.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}