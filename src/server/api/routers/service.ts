import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createServiceSchema } from '@/schemas/create-service-schema'
import { updateServiceSchema } from '@/schemas/update-service-schema'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/lib/trpc'

export const routerService = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const prismaServices = await ctx.prisma.service.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    })

    return {
      services: prismaServices.map((service) => ({
        id: service.id,
        name: service.name,
        timeInMinutes: service.timeInMinutes,
      })),
    }
  }),

  create: protectedProcedure
    .input(createServiceSchema)
    .mutation(async ({ ctx, input }) => {
      const prismaService = await ctx.prisma.service.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          timeInMinutes: input.timeInMinutes,
        },
      })

      return { id: prismaService.id }
    }),

  update: protectedProcedure
    .input(updateServiceSchema)
    .mutation(async ({ ctx, input }) => {
      const prismaService = await ctx.prisma.service.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!prismaService) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Service not found.',
        })
      }

      if (prismaService.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      await ctx.prisma.service.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          timeInMinutes: input.timeInMinutes,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const prismaService = await ctx.prisma.service.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!prismaService) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Service not found.',
        })
      }

      if (prismaService.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      await ctx.prisma.service.delete({
        where: {
          id: input.id,
        },
      })
    }),

  getAllPublic: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const prismaServices = await ctx.prisma.service.findMany({
        where: {
          user: {
            slug: input.slug,
          },
        },
      })

      return {
        services: prismaServices.map((service) => ({
          id: service.id,
          name: service.name,
          timeInMinutes: service.timeInMinutes,
        })),
      }
    }),
})
