import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: '404 | Scheddy',
}

export default async function NotFound() {
  const t = await getTranslations({ locale: '', namespace: 'NotFound' })

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>
        <h2 className="text-center text-3xl font-bold">404</h2>
        <p className="mt-2">{t('description')}</p>
      </div>
    </div>
  )
}
