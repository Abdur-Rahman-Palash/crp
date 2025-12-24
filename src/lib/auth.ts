import { cookies } from 'next/headers'

export async function getUser() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')?.value
  if (!userCookie) return null
  return JSON.parse(userCookie)
}