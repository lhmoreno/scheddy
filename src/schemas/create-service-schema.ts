import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(3).max(30),
  timeInMinutes: z.number().min(5).multipleOf(5),
})

export type CreateServiceSchema = z.infer<typeof createServiceSchema>
