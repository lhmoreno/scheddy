import { createCallerFactory, createTRPCRouter } from '../lib/trpc'
import { routerAvailability } from './routers/availability'
import { routerProfile } from './routers/profile'
import { routerService } from './routers/service'

export const appRouter = createTRPCRouter({
  profile: routerProfile,
  service: routerService,
  availability: routerAvailability,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
