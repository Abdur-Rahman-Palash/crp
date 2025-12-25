'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Login attempt for:', email)

    const user = await prisma.user.findUnique({
      where: { email },
      include: { teacher: true }
    })

    console.log('User found:', user ? 'yes' : 'no')

    if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
      console.log('Invalid credentials for:', email)
      throw new Error('Invalid credentials')
    }

    console.log('Login successful for:', email)

    // Instead of using cookies() directly, let's try a different approach
    // Create a response and set the cookie
    const response = NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'))
    response.cookies.set('user', JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    console.log('Cookie set via response, redirecting...')

    // Since we can't return a Response from a server action, let's use redirect
    // But first set the cookie using a different method
    const cookieStore = await cookies()
    cookieStore.set('user', JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

  } catch (error) {
    console.error('Login error:', error)
    throw error
  }

  redirect('/dashboard')
}