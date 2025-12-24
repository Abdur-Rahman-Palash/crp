import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function FeePaymentsPage({ params }: { params: { id: string } }) {
  const user = await getUser()
  if (!user || !['ADMIN', 'ACCOUNTANT'].includes(user.role)) redirect('/dashboard')

  const fee = await prisma.fee.findUnique({
    where: { id: params.id },
    include: {
      student: { include: { class: true } },
      payments: { orderBy: { date: 'desc' } }
    }
  })

  if (!fee) redirect('/dashboard/fees')

  const totalPaid = fee.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const remaining = fee.amount - totalPaid

  async function addPayment(formData: FormData) {
    'use server'
    const amount = parseFloat(formData.get('amount') as string)
    const receivedBy = user.name

    // Refetch fee to ensure data integrity
    const currentFee = await prisma.fee.findUnique({
      where: { id: params.id },
      include: { payments: true }
    })

    if (!currentFee) return

    const currentTotalPaid = currentFee.payments.reduce((sum, payment) => sum + payment.amount, 0)

    await prisma.payment.create({
      data: {
        feeId: params.id,
        amount,
        receivedBy,
        date: new Date()
      }
    })

    // Update fee status
    const newTotalPaid = currentTotalPaid + amount
    let newStatus: 'DUE' | 'PAID' | 'PARTIAL' = 'DUE'
    if (newTotalPaid >= currentFee.amount) {
      newStatus = 'PAID'
    } else if (newTotalPaid > 0) {
      newStatus = 'PARTIAL'
    }

    await prisma.fee.update({
      where: { id: params.id },
      data: { status: newStatus }
    })

    redirect(`/dashboard/fees/${params.id}/payments`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/fees">
          <button className="text-blue-600 hover:text-blue-900 mr-4">&larr; Back to Fees</button>
        </Link>
        <h1 className="text-3xl font-bold">Payments - {fee.student.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Fee Details</h3>
          <p><strong>Student:</strong> {fee.student.name}</p>
          <p><strong>Class:</strong> {fee.student.class.name}</p>
          <p><strong>Month:</strong> {fee.month}</p>
          <p><strong>Total Amount:</strong> ${fee.amount.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
          <p><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</p>
          <p><strong>Remaining:</strong> ${remaining.toFixed(2)}</p>
          <p><strong>Status:</strong>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              fee.status === 'PAID' ? 'bg-green-100 text-green-800' :
              fee.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {fee.status}
            </span>
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Add Payment</h3>
          <form action={addPayment} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                min="0.01"
                max={remaining.toFixed(2)}
                step="0.01"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Record Payment
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h3 className="text-lg font-semibold p-6 border-b">Payment History</h3>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received By</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fee.payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{payment.date.toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.receivedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {fee.payments.length === 0 && (
          <p className="text-gray-500 text-center py-8">No payments recorded yet.</p>
        )}
      </div>
    </div>
  )
}