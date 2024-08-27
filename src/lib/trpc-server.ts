import 'server-only'

import { headers } from 'next/headers'
import { cache } from 'react'

import { createCaller } from '@/server/api'
import { createTRPCContext } from '@/server/lib/trpc'

const createContext = cache(() => {
  const heads = new Headers(headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads,
  })
})

export const api = createCaller(createContext)
