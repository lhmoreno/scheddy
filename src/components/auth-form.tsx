'use client'

import { LogInIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function AuthForm() {
  const t = useTranslations('Auth')

  const router = useRouter()
  const searchParams = useSearchParams()

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault()
    setIsLoading(true)
    setHasError(false)

    const formData = new FormData(ev.currentTarget)
    const password = formData.get('password')?.toString() ?? ''

    const res = await signIn('credentials', { redirect: false, password })

    if (res?.status === 401) {
      setHasError(true)
    }

    if (res?.status === 200) {
      const pathname = searchParams.get('redirect')

      if (pathname) {
        router.push(pathname)
      }

      router.push('/dashboard')
    }

    setIsLoading(false)
  }

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <Label>{t('input.label')}</Label>
        <Input
          className={cn(hasError && 'border-destructive')}
          name="password"
          type="password"
          placeholder={t('input.placeholder')}
        />
        <span className="text-sm font-medium text-destructive">
          {hasError && t('input.error')}
        </span>
      </div>
      <Button className="w-full" disabled={isLoading}>
        <LogInIcon className="h-4 w-4" /> {t('button.title')}
      </Button>
    </form>
  )
}
