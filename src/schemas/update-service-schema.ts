import { z } from 'zod'

export const updateServiceSchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(30),
  timeInMinutes: z.number().min(5).multipleOf(5),
})

export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>
