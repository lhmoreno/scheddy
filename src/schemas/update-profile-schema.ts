import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(3).max(30),
  bio: z.string().max(255).nullable(),
  slug: z.string().min(3).max(20),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
