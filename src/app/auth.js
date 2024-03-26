import CredentialsProvider from 'next-auth/providers/credentials';


export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        //
        if (!credentials?.email || !credentials?.password) return null;
        //
        try {
          const email = credentials?.email;
          const pwd = credentials?.password;
          if (email === "example@example.com" && pwd === "Example!234") {
            return {
              id: 1,
              userId: 1,
              email,
              isActiveFlag: true,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return (user).isActiveFlag;
    },
    async jwt({ token, user }) {
      if (!token.userId && user) {
        token.userId = (user).userId;
      }
      return token;
    },
    async session({ token, session, user }) {
      if (token) {
        if (session.user) {
          (session.user).userId = token.userId;
        } else {
          session.user = {
            // id: token.id,
            email: token.email,
            //@ts-ignore
            userId: token.userId,
          };
        }
      }
      return session;
    },
  },
};
