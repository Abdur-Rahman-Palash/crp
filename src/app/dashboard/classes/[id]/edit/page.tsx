import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EditClassPage({ params }: { params: { id: string } }) {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const cls = await prisma.class.findUnique({
    where: { id: params.id },
    include: { teacher: { include: { user: true } } }
  })

  if (!cls) redirect('/dashboard/classes')

  const teachers = await prisma.teacher.findMany({
    include: { user: true }
  })

  async function updateClass(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const section = formData.get('section') as string
    const teacherId = formData.get('teacherId') as string

    await prisma.class.update({
      where: { id: params.id },
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
        <h1 className="text-3xl font-bold">Edit Class</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={updateClass} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Class Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={cls.name}
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
              defaultValue={cls.section || ''}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">Class Teacher (Optional)</label>
            <select
              id="teacherId"
              name="teacherId"
              defaultValue={cls.teacherId || ''}
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
              Update Class
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}