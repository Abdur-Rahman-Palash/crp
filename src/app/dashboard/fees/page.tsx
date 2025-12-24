import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function FeesPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const fees = await prisma.fee.findMany({
    include: {
      student: {
        include: { class: true }
      },
      payments: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fees Management</h1>
        <Link href="/dashboard/fees/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Fee
          </button>
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fees.map((fee) => {
              const totalPaid = fee.payments.reduce((sum, payment) => sum + payment.amount, 0)
              return (
                <tr key={fee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{fee.student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fee.student.class.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fee.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${fee.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      fee.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      fee.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${totalPaid.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/dashboard/fees/${fee.id}/edit`}>
                      <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    </Link>
                    <Link href={`/dashboard/fees/${fee.id}/payments`}>
                      <button className="text-green-600 hover:text-green-900 mr-4">Payments</button>
                    </Link>
                    <form action={async () => {
                      'use server'
                      await prisma.fee.delete({ where: { id: fee.id } })
                      redirect('/dashboard/fees')
                    }} className="inline">
                      <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}