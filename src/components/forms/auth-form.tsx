'use client'

import { GithubIcon } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

export function AuthForm() {
  const t = useTranslations('Auth')

  return (
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-xl font-bold">{t('title')}</h1>
      <Button
        variant="outline"
        className="h-12 w-full justify-start px-4"
        onClick={() => signIn('github')}
      >
        <GithubIcon className="h-4 w-4" /> {t('input.github')}
      </Button>
    </div>
  )
}
