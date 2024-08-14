import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { ThemeButton } from '@/components/theme-provider'
import { getServerAuthSession } from '@/lib/auth'

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerAuthSession()

  if (!session) {
    const headersList = headers()
    const referer = headersList.get('referer')

    if (referer) {
      const pathname = new URL(referer).pathname

      redirect(`/auth?redirect=${pathname}`)
    }

    redirect('/auth')
  }

  return (
    <div className="container">
      <header className="flex justify-end py-2">
        <ThemeButton />
      </header>
      {children}
    </div>
  )
}
