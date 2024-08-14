'use client'

import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import * as React from 'react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function ThemeButton() {
  const t = useTranslations('Theme')

  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunMoonIcon
            className="hidden h-4 w-4 aria-checked:block"
            aria-checked={theme === 'system' || theme === undefined}
          />
          <SunIcon
            className="hidden h-4 w-4 aria-checked:block"
            aria-checked={theme === 'light'}
          />
          <MoonIcon
            className="hidden h-4 w-4 aria-checked:block"
            aria-checked={theme === 'dark'}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={cn(theme === 'system' && 'bg-accent')}
          onClick={() => setTheme('system')}
        >
          {t('system')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(theme === 'light' && 'bg-accent')}
          onClick={() => setTheme('light')}
        >
          {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(theme === 'dark' && 'bg-accent')}
          onClick={() => setTheme('dark')}
        >
          {t('dark')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
