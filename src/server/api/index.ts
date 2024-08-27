import { createCallerFactory, createTRPCRouter } from '../lib/trpc'
import { routerProfile } from './routers/profile'

export const appRouter = createTRPCRouter({
  profile: routerProfile,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
