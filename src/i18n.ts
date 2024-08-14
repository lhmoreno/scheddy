import { headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const { get } = headers()
  const hasPt = get('accept-language')?.includes('pt')

  const locale = hasPt ? 'pt' : 'en'

  return {
    locale,
    messages: (await import(`./i18n/${locale}.json`)).default,
  }
})
