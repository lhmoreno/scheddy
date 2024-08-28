'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { useDayjs } from '@/lib/dayjs'
import { api, RouterOutputs } from '@/lib/trpc-client'

const dayMinutesInterval = Array.from(Array(96).keys()).map((i) => i * 15)

export function AvailabilityPage({
  data,
}: {
  data: RouterOutputs['availability']['weekDay']['getAll']
}) {
  const dayjs = useDayjs()
  const locale = useLocale()

  const t = useTranslations('Availability')

  const { toast } = useToast()

  const [weekDays, setWeekDays] = useState(data)

  const { mutate: createWeekDayFn } =
    api.availability.weekDay.create.useMutation({
      onMutate(weekDay) {
        const tempId = Math.round(Math.random() * 1000)

        setWeekDays((v) => [...v, { ...weekDay, id: tempId }])

        return { tempId }
      },
      onError(_, __, ctx) {
        if (ctx) {
          setWeekDays((v) => v.filter((weekDay) => weekDay.id !== ctx.tempId))
        }
      },
      onSuccess({ id }, _, ctx) {
        if (ctx) {
          setWeekDays((v) =>
            v.map((s) => (s.id === ctx.tempId ? { ...s, id } : s))
          )
        }

        toast({
          title: 'Adiciado com sucesso',
        })
      },
    })

  const { mutate: updateWeekDayFn } =
    api.availability.weekDay.update.useMutation({
      onSuccess() {
        toast({
          title: 'Atualizado com sucesso',
        })
      },
    })

  const { mutate: deleteWeekDayFn } =
    api.availability.weekDay.delete.useMutation({
      onMutate({ id }) {
        setWeekDays((v) => v.filter((service) => service.id !== id))

        return { previousWeekDays: weekDays }
      },
      onError(_, __, ctx) {
        if (ctx) {
          setWeekDays(ctx.previousWeekDays)
        }
      },
      onSuccess() {
        toast({
          title: 'Deletado com sucesso',
        })
      },
    })

  return (
    <div className="space-y-8">
      {Array.from({ length: 7 }).map((_, index) => {
        const weekDay = locale === 'pt' ? (index === 6 ? 0 : index + 1) : index
        const availability = weekDays.find((a) => a.weekDay === weekDay)

        return (
          <div key={index}>
            <div className="flex items-center gap-2">
              <Switch
                checked={!!availability}
                onCheckedChange={(value) => {
                  if (value && !availability) {
                    createWeekDayFn({
                      weekDay,
                      startTimeInMinutes: 540,
                      endTimeInMinutes: 1080,
                    })
                  }

                  if (!value && availability) {
                    deleteWeekDayFn({ id: availability.id })
                  }
                }}
              />
              <Label className="capitalize">
                {dayjs().day(weekDay).format('dddd')}
              </Label>
            </div>

            {availability && (
              <div className="mt-3 flex items-center gap-2">
                <Select
                  value={String(availability.startTimeInMinutes)}
                  onValueChange={(value) => {
                    const minutes = Number(value)
                    const newData = {
                      ...availability,
                      startTimeInMinutes: minutes,
                    }

                    setWeekDays((v) =>
                      v.map((w) => (w.id === availability.id ? newData : w))
                    )

                    if (minutes < availability.endTimeInMinutes) {
                      updateWeekDayFn(newData)
                    } else {
                      toast({
                        title: 'Horários inválidos',
                      })
                    }
                  }}
                >
                  <SelectTrigger className="w-[96px]">
                    <SelectValue defaultValue="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayMinutesInterval.map((minutes) => {
                      const date = dayjs().startOf('day').add(minutes, 'minute')
                      const timeString =
                        locale === 'pt'
                          ? date.format('HH:mm')
                          : date.format('h:mm a')

                      return (
                        <SelectItem key={minutes} value={String(minutes)}>
                          {timeString}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <span className="font-medium text-muted-foreground">-</span>
                <Select
                  value={String(availability.endTimeInMinutes)}
                  onValueChange={(value) => {
                    const minutes = Number(value)
                    const newData = {
                      ...availability,
                      endTimeInMinutes: minutes,
                    }

                    setWeekDays((v) =>
                      v.map((w) => (w.id === availability.id ? newData : w))
                    )

                    if (minutes > availability.startTimeInMinutes) {
                      updateWeekDayFn(newData)
                    } else {
                      toast({
                        title: 'Horários inválidos',
                      })
                    }
                  }}
                >
                  <SelectTrigger className="w-[96px]">
                    <SelectValue defaultValue="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayMinutesInterval.map((minutes) => {
                      const date = dayjs().startOf('day').add(minutes, 'minute')
                      const timeString =
                        locale === 'pt'
                          ? date.format('HH:mm')
                          : date.format('h:mm a')

                      return (
                        <SelectItem key={minutes} value={String(minutes)}>
                          {timeString}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
