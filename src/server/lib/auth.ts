import { AuthOptions, DefaultSession, getServerSession } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

import { env } from '@/env'

import { prisma } from './prisma'
import { PrismaAdapter } from './prisma-adapter'

type UserNextAuth = {
  id: string
  name: string
  email: string
  image?: string | null
}

export type UpdateSessionData = {
  user?: {
    name: string
  }
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: UserNextAuth
  }

  interface User extends UserNextAuth {}
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    error: '/auth',
    signIn: '/auth',
  },
  callbacks: {
    session: async ({ session, user, newSession, trigger }) => {
      let name = session.user.name

      if (trigger === 'update') {
        const newSessionData = newSession as UpdateSessionData

        if (newSessionData.user) {
          name = newSessionData.user.name
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          name,
        },
      }
    },
  },
}

export const getServerAuthSession = () => getServerSession(authOptions)
