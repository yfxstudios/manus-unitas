'use server'

import QRCode from 'qrcode'
import speakeasy from 'speakeasy'

export async function qrcode() {
  const secret = speakeasy.generateSecret({
    name: "Manus Unitas",
  })
  const data = await QRCode.toDataURL(secret.otpauth_url)
  return {
    data,
    secret: secret.base32,
  }
}