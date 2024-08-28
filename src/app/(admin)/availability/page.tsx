import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { api } from '@/lib/trpc-server'

import { AvailabilityPage } from './availability-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: '', namespace: 'Availability' })

  return {
    title: `${t('title')} | Scheddy`,
  }
}

export default async function Availability() {
  const t = await getTranslations({ locale: '', namespace: 'Availability' })
  const data = await api.availability.weekDay.getAll()

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <AvailabilityPage data={data} />
    </div>
  )
}
