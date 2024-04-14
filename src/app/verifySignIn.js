'use server'
import { getServerSession } from 'next-auth'
import { options } from './api/auth/[...nextauth]/options'

export default async function verifySignIn() {
  'use server'

  const session = await getServerSession(options)
  if (!session) {
    return false
  } else if (session.user) {
    return true
  }
}

export async function getSession() {
  'use server'
  const session = await getServerSession(options)
  return session
}
