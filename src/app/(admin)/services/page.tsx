import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { api } from '@/lib/trpc-server'

import { ServicesPage } from './services-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: '', namespace: 'Services' })

  return {
    title: `${t('title')} | Scheddy`,
  }
}

export default async function Services() {
  const t = await getTranslations({ locale: '', namespace: 'Services' })
  const data = await api.service.getAll()

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <ServicesPage data={data} />
    </div>
  )
}
