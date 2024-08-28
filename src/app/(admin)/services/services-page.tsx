'use client'

import { PencilIcon, TrashIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api, RouterOutputs } from '@/lib/trpc-client'
import { cn } from '@/lib/utils'

import { ServiceDialogForm } from './service-dialog-form'

export function ServicesPage({
  data,
}: {
  data: RouterOutputs['service']['getAll']
}) {
  const t = useTranslations('Services')

  const { toast } = useToast()

  const [services, setServices] = useState(data.services)

  const { mutate: createServiceFn } = api.service.create.useMutation({
    onMutate(service) {
      const tempId = Math.round(Math.random() * 1000)

      setServices((v) => [...v, { ...service, id: tempId }])

      return { tempId }
    },
    onError(_, __, ctx) {
      if (ctx) {
        setServices((v) => v.filter((service) => service.id !== ctx.tempId))
      }
    },
    onSuccess({ id }, _, ctx) {
      if (ctx) {
        setServices((v) =>
          v.map((s) => (s.id === ctx.tempId ? { ...s, id } : s))
        )
      }

      toast({
        title: 'Adiciado com sucesso',
      })
    },
  })

  const { mutate: updateServiceFn } = api.service.update.useMutation({
    onMutate(service) {
      setServices((v) => v.map((s) => (s.id === service.id ? service : s)))

      return { previousServices: services }
    },
    onError(_, __, ctx) {
      if (ctx) {
        setServices(ctx.previousServices)
      }
    },
    onSuccess() {
      toast({
        title: 'Atualizado com sucesso',
      })
    },
  })

  const { mutate: deleteServiceFn } = api.service.delete.useMutation({
    onMutate({ id }) {
      setServices((v) => v.filter((service) => service.id !== id))

      return { previousServices: services }
    },
    onError(_, __, ctx) {
      if (ctx) {
        setServices(ctx.previousServices)
      }
    },
    onSuccess() {
      toast({
        title: 'Deletado com sucesso',
      })
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ServiceDialogForm
          onCreateSubmit={(service) => createServiceFn(service)}
          onUpdateSubmit={(service) => updateServiceFn(service)}
        >
          <Button>{t('addButton')}</Button>
        </ServiceDialogForm>
      </div>

      <ul className="mt-8 rounded-lg border">
        {services.map((service, index) => (
          <li
            key={service.id}
            className={cn(
              'flex items-center justify-between gap-2 p-4',
              index !== 0 && 'border-t'
            )}
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium">{service.name}</h3>
              <p className="text-muted-foreground">
                {convertNumberToTimeDisplay(service.timeInMinutes)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => deleteServiceFn({ id: service.id })}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <ServiceDialogForm
                service={service}
                onCreateSubmit={(service) => createServiceFn(service)}
                onUpdateSubmit={(service) => updateServiceFn(service)}
              >
                <Button variant="outline" size="icon">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </ServiceDialogForm>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function convertNumberToTimeDisplay(value: number) {
  const hours = Math.floor(value / 60)
  const minutesRest = value % 60

  if (hours === 0) {
    return `${value} min`
  }

  if (minutesRest === 0) {
    return `${hours} h`
  }

  return `${hours} h ${minutesRest} min`
}
