import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createWeekDaySchema } from '@/schemas/create-week-day-schema'
import { updateWeekDaySchema } from '@/schemas/update-week-day-schema'
import { createTRPCRouter, protectedProcedure } from '@/server/lib/trpc'

export const routerAvailability = createTRPCRouter({
  weekDay: {
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const prismaAvailabilities = await ctx.prisma.availability.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      })

      return prismaAvailabilities.map((availability) => ({
        id: availability.id,
        weekDay: availability.weekDay,
        startTimeInMinutes: availability.startTimeInMinutes,
        endTimeInMinutes: availability.endTimeInMinutes,
      }))
    }),

    create: protectedProcedure
      .input(createWeekDaySchema)
      .mutation(async ({ ctx, input }) => {
        const prismaAvailability = await ctx.prisma.availability.create({
          data: {
            userId: ctx.session.user.id,
            weekDay: input.weekDay,
            startTimeInMinutes: input.startTimeInMinutes,
            endTimeInMinutes: input.endTimeInMinutes,
          },
        })

        return { id: prismaAvailability.id }
      }),

    update: protectedProcedure
      .input(updateWeekDaySchema)
      .mutation(async ({ ctx, input }) => {
        const prismaAvailability = await ctx.prisma.availability.findUnique({
          where: {
            id: input.id,
          },
        })

        if (!prismaAvailability) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Availability not found.',
          })
        }

        if (prismaAvailability.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          })
        }

        await ctx.prisma.availability.update({
          where: {
            id: input.id,
          },
          data: {
            weekDay: input.weekDay,
            startTimeInMinutes: input.startTimeInMinutes,
            endTimeInMinutes: input.endTimeInMinutes,
          },
        })
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const prismaAvailability = await ctx.prisma.availability.findUnique({
          where: {
            id: input.id,
          },
        })

        if (!prismaAvailability) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Availability not found.',
          })
        }

        if (prismaAvailability.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          })
        }

        await ctx.prisma.availability.delete({
          where: {
            id: input.id,
          },
        })
      }),
  },
})
