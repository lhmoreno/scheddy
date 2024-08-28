import { z } from 'zod'

export const updateWeekDaySchema = z.object({
  id: z.number(),
  weekDay: z.number().min(0).max(6),
  startTimeInMinutes: z.number().min(5).multipleOf(5),
  endTimeInMinutes: z.number().min(5).multipleOf(5),
})

export type UpdateWeekDaySchema = z.infer<typeof updateWeekDaySchema>
