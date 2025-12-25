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
    const subject = searchParams.get('subject')

    const where: any = {}
    if (classId) where.classId = classId
    if (subject) where.subject = subject

    const marks = await prisma.mark.findMany({
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
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(marks)
  } catch (error) {
    console.error('Error fetching marks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId, classId, subject, marks, examType, remarks } = await request.json()

    const mark = await prisma.mark.create({
      data: {
        studentId,
        subject,
        marks: parseFloat(marks),
        examType,
        remarks,
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

    return NextResponse.json(mark, { status: 201 })
  } catch (error) {
    console.error('Error creating mark:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}