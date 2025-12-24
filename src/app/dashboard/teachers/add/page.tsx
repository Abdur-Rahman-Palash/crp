import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import bcrypt from 'bcryptjs'

export default async function AddTeacherPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const classes = await prisma.class.findMany()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add Teacher</h1>
      <form action={addTeacher} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Subjects (comma separated)</label>
          <input
            type="text"
            id="subjects"
            name="subjects"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700">Assigned Class</label>
          <select
            id="classId"
            name="classId"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">None</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard/teachers">
            <button type="button" className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </Link>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Teacher
          </button>
        </div>
      </form>
    </div>
  )
}

async function addTeacher(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const subjects = (formData.get('subjects') as string).split(',').map(s => s.trim())
  const classId = formData.get('classId') as string

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'TEACHER'
    }
  })

  await prisma.teacher.create({
    data: {
      userId: user.id,
      subjects,
      ...(classId && { classes: { connect: { id: classId } } })
    }
  })

  redirect('/dashboard/teachers')
}