import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AttendancePage() {
  const user = await getUser()
  if (!user || user.role !== 'TEACHER') redirect('/dashboard')

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: { classes: true }
  })

  if (!teacher) redirect('/dashboard')

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

  // Check if attendance is already marked for today for each class
  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      teacherId: teacher.id,
      date: new Date(today)
    },
    include: {
      student: {
        select: { classId: true }
      }
    }
  })

  const markedClassIds = new Set(attendanceRecords.map(record => record.student.classId))

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacher.classes.map((cls) => {
          const isMarked = markedClassIds.has(cls.id)
          return (
            <div key={cls.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{cls.name}</h2>
              {cls.section && <p className="text-gray-600 mb-4">Section: {cls.section}</p>}
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-sm ${isMarked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {isMarked ? 'Marked' : 'Pending'}
                </span>
                <Link href={`/dashboard/attendance/${cls.id}`}>
                  <button className={`px-4 py-2 rounded ${isMarked ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    {isMarked ? 'View/Edit' : 'Mark Attendance'}
                  </button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      {teacher.classes.length === 0 && (
        <p className="text-gray-500 text-center mt-8">No classes assigned to you yet.</p>
      )}
    </div>
  )
}