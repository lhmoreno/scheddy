import { AuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        password: { label: 'Admin Password', type: 'password' },
      },
      async authorize(credentials) {
        const password = credentials?.password

        if (password === '123') {
          return {
            id: 'id',
          }
        }

        return null
      },
    }),
  ],
  pages: {
    error: '/auth',
    signIn: '/auth',
  },
}

export const getServerAuthSession = () => getServerSession(authOptions)
