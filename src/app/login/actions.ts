'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({
    where: { email },
    include: { teacher: true }
  })

  if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid credentials')
  }

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('user', JSON.stringify({ id: user.id, role: user.role }))

  redirect('/dashboard')
}