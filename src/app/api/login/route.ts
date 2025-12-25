import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt for:', email)

    const user = await prisma.user.findUnique({
      where: { email },
      include: { teacher: true }
    })

    console.log('User found:', user ? 'yes' : 'no')

    if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
      console.log('Invalid credentials for:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('Login successful for:', email)

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, role: user.role, name: user.name, email: user.email }
    })

    // Set HTTP-only cookie
    response.cookies.set('user', JSON.stringify({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    console.log('Cookie set, login successful')
    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}