import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payments = await prisma.payment.findMany({
      include: {
        fee: {
          include: {
            student: {
              include: {
                user: true,
                class: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || !['ADMIN', 'ACCOUNTANT'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { feeId, amount, paymentMethod, notes } = await request.json()

    const payment = await prisma.payment.create({
      data: {
        feeId,
        amount: parseFloat(amount),
        paymentMethod,
        notes,
        collectedBy: user.id
      },
      include: {
        fee: {
          include: {
            student: {
              include: {
                user: true,
                class: true
              }
            }
          }
        }
      }
    })

    // Update fee status if fully paid
    const totalPaid = await prisma.payment.aggregate({
      where: { feeId },
      _sum: { amount: true }
    })

    const fee = await prisma.fee.findUnique({
      where: { id: feeId }
    })

    if (fee && totalPaid._sum.amount >= fee.amount) {
      await prisma.fee.update({
        where: { id: feeId },
        data: { status: 'PAID' }
      })
    }

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}