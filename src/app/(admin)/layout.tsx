import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Header } from '@/components/header'
import { getServerAuthSession } from '@/server/lib/auth'

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

    if (referer && referer !== '/') {
      const pathname = new URL(referer).pathname

      redirect(`/auth?redirect=${pathname}`)
    }

    redirect('/auth')
  }

  return (
    <div>
      <Header />

      <div className="container mt-4">{children}</div>
    </div>
  )
}
