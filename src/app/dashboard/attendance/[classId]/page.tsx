import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ClassAttendancePage({ params }: { params: { classId: string } }) {
  const user = await getUser()
  if (!user || user.role !== 'TEACHER') redirect('/dashboard')

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: { classes: true }
  })

  if (!teacher || !teacher.classes.some(cls => cls.id === params.classId)) {
    redirect('/dashboard/attendance')
  }

  const cls = await prisma.class.findUnique({
    where: { id: params.classId },
    include: { students: true }
  })

  if (!cls) redirect('/dashboard/attendance')

  const today = new Date().toISOString().split('T')[0]

  // Get existing attendance records for today for students in this class
  const existingAttendance = await prisma.attendance.findMany({
    where: {
      studentId: { in: cls.students.map(s => s.id) },
      date: new Date(today)
    }
  })

  const attendanceMap = new Map(
    existingAttendance.map(att => [att.studentId, att.status])
  )

  async function markAttendance(formData: FormData) {
    'use server'

    // Refetch class and students to ensure data integrity
    const currentClass = await prisma.class.findUnique({
      where: { id: params.classId },
      include: { students: true }
    })

    if (!currentClass) return

    const attendanceData = currentClass.students.map(student => ({
      studentId: student.id,
      status: (formData.get(`attendance-${student.id}`) as string) === 'present' ? 'PRESENT' : 'ABSENT'
    }))

    // Delete existing records for today for students in this class
    await prisma.attendance.deleteMany({
      where: {
        studentId: { in: currentClass.students.map(s => s.id) },
        date: new Date(today)
      }
    })

    // Create new attendance records
    await prisma.attendance.createMany({
      data: attendanceData.map(data => ({
        studentId: data.studentId,
        teacherId: teacher!.id,
        date: new Date(today),
        status: data.status as 'PRESENT' | 'ABSENT'
      }))
    })

    redirect('/dashboard/attendance')
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/attendance" className="text-blue-600 hover:text-blue-900 mr-4">&larr; Back to Attendance</Link>
        <h1 className="text-3xl font-bold">Mark Attendance - {cls.name}</h1>
        {cls.section && <span className="ml-2 text-gray-600">Section: {cls.section}</span>}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <p className="text-gray-600">Date: {new Date(today).toLocaleDateString()}</p>
          <p className="text-gray-600">Students: {cls.students.length}</p>
        </div>

        <form action={markAttendance} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {cls.students.map((student) => {
              const currentStatus = attendanceMap.get(student.id) || 'PRESENT'
              return (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="present"
                        defaultChecked={currentStatus === 'PRESENT'}
                        className="mr-2"
                      />
                      <span className="text-green-600">Present</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="absent"
                        defaultChecked={currentStatus === 'ABSENT'}
                        className="mr-2"
                      />
                      <span className="text-red-600">Absent</span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}