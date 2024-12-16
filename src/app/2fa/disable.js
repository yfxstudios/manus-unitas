'use server'

import Users from '@/lib/schemas/userSchema'


export async function disableTwoFactorAuth(id) {
  const user = await Users.findOne({ _id: id })
  user.twoFactorAuth = {
    secret: null,
    verified: false,
  }

  await user.save()
}