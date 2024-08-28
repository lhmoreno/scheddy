import { z } from 'zod'

export const createWeekDaySchema = z.object({
  weekDay: z.number().min(0).max(6),
  startTimeInMinutes: z.number().min(5).multipleOf(5),
  endTimeInMinutes: z.number().min(5).multipleOf(5),
})

export type CreateWeekDaySchema = z.infer<typeof createWeekDaySchema>
