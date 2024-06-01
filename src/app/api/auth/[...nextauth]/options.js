import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import Users from "@/lib/schemas/userSchema"
import { verify } from '@/app/2fa/verify'

export const options = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorAuth: { label: "2FA Key", type: "text" }
      },
      async authorize(credentials) {
        const user = await Users.findOne({ email: credentials.email })
        if (user) {
          if (user.twoFactorAuth.verified === true && !credentials.twoFactorAuth) {
            throw new Error('2FA key required')
          } else if (user.twoFactorAuth.verified === true && credentials.twoFactorAuth) {
            const { verified } = await verify(user.twoFactorAuth.secret, credentials.twoFactorAuth)
            if (verified === false) {
              throw new Error('2FA key incorrect')
            } else {
              return user
            }
          } else if (!user.twoFactorAuth.verified) {
            if (user.password === credentials.password) {
              return user
            } else {
              throw new Error('Password incorrect')
            }
          } else {
            throw new Error('An error occurred. Please try again')
          }
        } else {
          throw new Error('User not found')
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
    error: '/signin',
  }
}