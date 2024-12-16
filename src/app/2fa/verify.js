'use server'

import speakeasy from 'speakeasy'
import crypto, { AES } from 'crypto-js'
import Users from '@/lib/schemas/userSchema'
import { getServerSession } from 'next-auth'


export async function verify(secret, token) {
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  })


  return { verified }
}


export async function saveSecretKey(secret, id) {
  // const encryptedSecret = AES.encrypt(secret, process.env.ENCRYPTION_SECRET).toString()

  const user = await Users.findOne({ _id: id })
  user.twoFactorAuth = {
    secret: secret, // encryptedSecret,
    verified: true,
  }

  await user.save()

  console.log(`Secret saved: ${secret}`)
}