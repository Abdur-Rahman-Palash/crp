import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface EditStudentPageProps {
  params: { id: string }
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: { class: true }
  })

  if (!student) redirect('/dashboard/students')

  const classes = await prisma.class.findMany()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Student</h1>
      <form action={updateStudent.bind(null, params.id)} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={student.name}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">Roll Number</label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            defaultValue={student.rollNo}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700">Class</label>
          <select
            id="classId"
            name="classId"
            defaultValue={student.classId}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard/students">
            <button type="button" className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </Link>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Update Student
          </button>
        </div>
      </form>
    </div>
  )
}

async function updateStudent(id: string, formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const rollNo = formData.get('rollNo') as string
  const classId = formData.get('classId') as string

  await prisma.student.update({
    where: { id },
    data: {
      name,
      rollNo,
      classId
    }
  })

  redirect('/dashboard/students')
}