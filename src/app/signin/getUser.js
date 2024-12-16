'use server'

import Users from '@/lib/schemas/userSchema'

export async function getUser(email) {
  const user = await Users.findOne({ email: email }).lean()
  return user
}