import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AddFeePage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { name: 'asc' }
  })

  async function addFee(formData: FormData) {
    'use server'
    const studentId = formData.get('studentId') as string
    const month = formData.get('month') as string
    const amount = parseFloat(formData.get('amount') as string)

    await prisma.fee.create({
      data: {
        studentId,
        month,
        amount
      }
    })

    redirect('/dashboard/fees')
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/fees">
          <button className="text-blue-600 hover:text-blue-900 mr-4">&larr; Back to Fees</button>
        </Link>
        <h1 className="text-3xl font-bold">Add Fee</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={addFee} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student</label>
            <select
              id="studentId"
              name="studentId"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.class.name} (Roll: {student.rollNo})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
            <select
              id="month"
              name="month"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Fee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}