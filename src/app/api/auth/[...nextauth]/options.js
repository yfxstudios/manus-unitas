import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'


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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await Users.find(user => user.email === credentials.email)
        if (user) {
          if (user.password === credentials.password) {
            return user
          } else {
            throw new Error('Password incorrect')
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