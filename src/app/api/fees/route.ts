import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fees = await prisma.fee.findMany({
      include: {
        student: {
          include: {
            class: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(fees)
  } catch (error) {
    console.error('Error fetching fees:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || !['ADMIN', 'ACCOUNTANT'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId, amount, description, dueDate } = await request.json()

    const fee = await prisma.fee.create({
      data: {
        studentId,
        amount: parseFloat(amount),
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'DUE'
      },
      include: {
        student: {
          include: {
            class: true
          }
        }
      }
    })

    return NextResponse.json(fee, { status: 201 })
  } catch (error) {
    console.error('Error creating fee:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}