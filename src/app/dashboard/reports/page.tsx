import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function ReportsPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  // Monthly income report
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const monthlyPayments = await prisma.payment.findMany({
    where: {
      date: {
        gte: new Date(`${currentMonth}-01`),
        lt: new Date(`${currentMonth}-01`) // This will be next month
      }
    }
  })

  const monthlyIncome = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0)

  // Total income all time
  const allPayments = await prisma.payment.findMany()
  const totalIncome = allPayments.reduce((sum, payment) => sum + payment.amount, 0)

  // Due students
  const dueFees = await prisma.fee.findMany({
    where: { status: { in: ['DUE', 'PARTIAL'] } },
    include: {
      student: { include: { class: true } },
      payments: true
    }
  })

  // Class-wise student count
  const classes = await prisma.class.findMany({
    include: { _count: { select: { students: true } } }
  })

  // Recent payments
  const recentPayments = await prisma.payment.findMany({
    take: 10,
    orderBy: { date: 'desc' },
    include: {
      fee: {
        include: {
          student: { include: { class: true } }
        }
      }
    }
  })

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Monthly Income</h3>
          <p className="text-3xl font-bold text-green-600">${monthlyIncome.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-blue-600">${totalIncome.toFixed(2)}</p>
          <p className="text-sm text-gray-600">All time</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Due Students</h3>
          <p className="text-3xl font-bold text-red-600">{dueFees.length}</p>
          <p className="text-sm text-gray-600">Pending payments</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Classes</h3>
          <p className="text-3xl font-bold text-purple-600">{classes.length}</p>
          <p className="text-sm text-gray-600">Active classes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Due Students</h3>
          <div className="space-y-2">
            {dueFees.slice(0, 10).map((fee) => {
              const paid = fee.payments.reduce((sum, p) => sum + p.amount, 0)
              const remaining = fee.amount - paid
              return (
                <div key={fee.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{fee.student.name}</p>
                    <p className="text-sm text-gray-600">{fee.student.class.name} - {fee.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">${remaining.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Due</p>
                  </div>
                </div>
              )
            })}
            {dueFees.length === 0 && (
              <p className="text-gray-500 text-center py-4">No due payments</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Class Summary</h3>
          <div className="space-y-2">
            {classes.map((cls) => (
              <div key={cls.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{cls.name}</p>
                  {cls.section && <p className="text-sm text-gray-600">Section: {cls.section}</p>}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{cls._count.students}</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Received By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-4 py-2 whitespace-nowrap">{payment.date.toLocaleDateString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">{payment.fee.student.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{payment.fee.student.class.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">${payment.amount.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{payment.receivedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}