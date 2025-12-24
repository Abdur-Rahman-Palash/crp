import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MarksPage() {
  const user = await getUser()
  if (!user || user.role !== 'TEACHER') redirect('/dashboard')

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: { classes: true }
  })

  if (!teacher) redirect('/dashboard')

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Marks Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacher.classes.map((cls) => (
          <div key={cls.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{cls.name}</h2>
            {cls.section && <p className="text-gray-600 mb-4">Section: {cls.section}</p>}
            <Link href={`/dashboard/marks/${cls.id}`}>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Enter Marks
              </button>
            </Link>
          </div>
        ))}
      </div>
      {teacher.classes.length === 0 && (
        <p className="text-gray-500 text-center mt-8">No classes assigned to you yet.</p>
      )}
    </div>
  )
}