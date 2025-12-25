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
    const type = searchParams.get('type') || 'overview'

    let reportData: any = {}

    switch (type) {
      case 'students':
        reportData = await getStudentsReport()
        break
      case 'fees':
        reportData = await getFeesReport()
        break
      case 'attendance':
        reportData = await getAttendanceReport()
        break
      case 'marks':
        reportData = await getMarksReport()
        break
      default:
        reportData = await getOverviewReport()
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getOverviewReport() {
  const [totalStudents, totalTeachers, totalClasses, totalFees, totalPayments] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
    prisma.fee.aggregate({ _sum: { amount: true } }),
    prisma.payment.aggregate({ _sum: { amount: true } })
  ])

  return {
    type: 'overview',
    totalStudents,
    totalTeachers,
    totalClasses,
    totalFees: totalFees._sum.amount || 0,
    totalPayments: totalPayments._sum.amount || 0,
    pendingFees: (totalFees._sum.amount || 0) - (totalPayments._sum.amount || 0)
  }
}

async function getStudentsReport() {
  const students = await prisma.student.findMany({
    include: {
      class: true,
      fees: {
        include: {
          payments: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return {
    type: 'students',
    data: students.map(student => ({
      id: student.id,
      name: student.name,
      rollNo: student.rollNo,
      class: student.class?.name,
      totalFees: student.fees.reduce((sum, fee) => sum + fee.amount, 0),
      paidFees: student.fees.reduce((sum, fee) =>
        sum + fee.payments.reduce((pSum, payment) => pSum + payment.amount, 0), 0
      )
    }))
  }
}

async function getFeesReport() {
  const fees = await prisma.fee.findMany({
    include: {
      student: {
        include: {
          user: true,
          class: true
        }
      },
      payments: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    type: 'fees',
    data: fees
  }
}

async function getAttendanceReport() {
  const attendance = await prisma.attendance.findMany({
    include: {
      student: {
        include: {
          user: true,
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

  return {
    type: 'attendance',
    data: attendance
  }
}

async function getMarksReport() {
  const marks = await prisma.mark.findMany({
    include: {
      student: {
        include: {
          user: true,
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

  return {
    type: 'marks',
    data: marks
  }
}