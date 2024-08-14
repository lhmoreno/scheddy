import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AuthForm } from '@/components/auth-form'
import { getServerAuthSession } from '@/lib/auth'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: '', namespace: 'Auth' })

  return {
    title: `${t('button.title')} | Scheddy`,
  }
}

export default async function Auth({ searchParams }: { searchParams: any }) {
  const session = await getServerAuthSession()

  if (session) {
    const params = new URLSearchParams(searchParams)
    const pathname = params.get('redirect')

    if (pathname) {
      redirect(pathname)
    }

    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <AuthForm />
    </main>
  )
}
