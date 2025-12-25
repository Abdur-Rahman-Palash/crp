import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const date = searchParams.get('date')

    const where: any = {}
    if (classId) where.classId = classId
    if (date) where.date = new Date(date)

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            class: true
          }
        },
        teacher: {
          include: {
            user: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId, classId, date, status } = await request.json()

    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date: new Date(date)
        }
      },
      update: {
        status,
        teacherId: user.teacher?.id
      },
      create: {
        studentId,
        date: new Date(date),
        status,
        teacherId: user.teacher?.id
      },
      include: {
        student: {
          include: {
            class: true
          }
        },
        teacher: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating attendance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}