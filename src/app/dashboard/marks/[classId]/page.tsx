import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ClassMarksPage({ params }: { params: { classId: string } }) {
  const user = await getUser()
  if (!user || user.role !== 'TEACHER') redirect('/dashboard')

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: { classes: true }
  })

  if (!teacher || !teacher.classes.some(cls => cls.id === params.classId)) {
    redirect('/dashboard/marks')
  }

  const cls = await prisma.class.findUnique({
    where: { id: params.classId },
    include: { students: true }
  })

  if (!cls) redirect('/dashboard/marks')

  async function enterMarks(formData: FormData) {
    'use server'

    // Refetch class and students
    const currentClass = await prisma.class.findUnique({
      where: { id: params.classId },
      include: { students: true }
    })

    if (!currentClass) return

    const subject = formData.get('subject') as string
    const examType = formData.get('examType') as string

    const marksData = currentClass.students
      .map(student => {
        const marksValue = formData.get(`marks-${student.id}`) as string
        const marks = parseFloat(marksValue)
        if (isNaN(marks)) return null
        return {
          studentId: student.id,
          marks
        }
      })
      .filter(data => data !== null)

    // Delete existing marks for this subject and exam type
    await prisma.mark.deleteMany({
      where: {
        studentId: { in: marksData.map(d => d!.studentId) },
        subject,
        examType,
        teacherId: teacher!.id
      }
    })

    // Create new marks records
    await prisma.mark.createMany({
      data: marksData.map(data => ({
        studentId: data!.studentId,
        teacherId: teacher!.id,
        subject,
        marks: data!.marks,
        examType
      }))
    })

    redirect('/dashboard/marks')
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/marks" className="text-blue-600 hover:text-blue-900 mr-4">&larr; Back to Marks</Link>
        <h1 className="text-3xl font-bold">Enter Marks - {cls.name}</h1>
        {cls.section && <span className="ml-2 text-gray-600">Section: {cls.section}</span>}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={enterMarks} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                id="subject"
                name="subject"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Subject</option>
                {teacher.subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="examType" className="block text-sm font-medium text-gray-700">Exam Type</label>
              <select
                id="examType"
                name="examType"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Exam Type</option>
                <option value="Mid-term">Mid-term</option>
                <option value="Final">Final</option>
                <option value="Quiz">Quiz</option>
                <option value="Assignment">Assignment</option>
                <option value="Project">Project</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Student Marks</h3>
            {cls.students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    name={`marks-${student.id}`}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Marks"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="ml-2 text-gray-600">/ 100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save Marks
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}