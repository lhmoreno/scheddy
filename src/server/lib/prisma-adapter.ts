import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { Adapter } from 'next-auth/adapters'
import { ProviderType } from 'next-auth/providers/index'

export function PrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    createUser: async (data) => {
      if (!data.email)
        throw Error('Provider did not forward email but it is required')

      if (!data.name)
        throw Error('Provider did not forward name but it is required')

      const prismaUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          emailVerified: data.emailVerified,
          image: data.image,
          slug: `user-${randomUUID()}`.slice(0, 20),
        },
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        emailVerified: prismaUser.emailVerified,
        image: prismaUser.image,
      }
    },
    getUser: (id) => prisma.user.findUnique({ where: { id } }),
    getUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),
    getUserByAccount: async (provider_providerAccountId) => {
      const prismaAccount = await prisma.account.findUnique({
        where: {
          provider_providerAccountId,
        },
        select: { user: true },
      })

      return prismaAccount?.user ?? null
    },
    updateUser: async ({ id, ...props }) => {
      if (props.email === null)
        throw Error('Provider did not forward email but it is required')

      if (props.name === null)
        throw Error('Provider did not forward name but it is required')

      const prismaUser = await prisma.user.update({
        where: { id },
        data: {
          name: props.name,
          email: props.email,
          emailVerified: props.emailVerified,
          image: props.name,
        },
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        emailVerified: prismaUser.emailVerified,
        image: prismaUser.image,
      }
    },
    deleteUser: (id) => prisma.user.delete({ where: { id } }),
    linkAccount: async (data) => {
      const prismaAccount = await prisma.account.create({ data })

      return {
        userId: prismaAccount.userId,
        type: prismaAccount.type as ProviderType,
        provider: prismaAccount.provider,
        providerAccountId: prismaAccount.providerAccountId,
      }
    },
    unlinkAccount: async (provider_providerAccountId) => {
      await prisma.account.deleteMany({
        where: provider_providerAccountId,
      })
    },
    getSessionAndUser: async (sessionToken) => {
      const prismaUserAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })

      if (!prismaUserAndSession) return null

      const { user, ...session } = prismaUserAndSession

      return { user, session }
    },
    createSession: (data) => prisma.session.create({ data }),
    updateSession: (data) =>
      prisma.session.update({
        data,
        where: { sessionToken: data.sessionToken },
      }),
    deleteSession: (sessionToken) =>
      prisma.session.delete({ where: { sessionToken } }),
  }
}
