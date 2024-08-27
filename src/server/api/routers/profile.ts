import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { updateProfileSchema } from '@/schemas/update-profile-schema'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/lib/trpc'

export const routerProfile = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const prismaUser = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    })

    if (!prismaUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User profile not found.',
      })
    }

    return {
      name: prismaUser.name,
      bio: prismaUser.bio,
      slug: prismaUser.slug,
    }
  }),

  update: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const prismaUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      })

      if (!prismaUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User profile not found.',
        })
      }

      if (input.slug !== prismaUser.slug) {
        const prismaUserBySlug = await ctx.prisma.user.findUnique({
          where: { slug: input.slug },
        })

        if (prismaUserBySlug) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'This slug is already being used.',
          })
        }
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          bio: input.bio,
          slug: input.slug,
        },
      })
    }),

  getPublic: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const prismaUser = await ctx.prisma.user.findUnique({
        where: {
          slug: input.slug,
        },
      })

      if (!prismaUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profile not found.',
        })
      }

      return {
        name: prismaUser.name,
        bio: prismaUser.bio,
      }
    }),
})
