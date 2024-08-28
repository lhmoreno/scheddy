'use client'

import { LogOutIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function Header() {
  const { data: session } = useSession()

  const { resolvedTheme } = useTheme()
  const pathname = usePathname()

  const t = useTranslations('Header')

  return (
    <div className="border-b">
      <div className="container flex h-14 items-center justify-between px-4">
        <Image
          src={
            resolvedTheme === 'dark'
              ? '/images/logo-dark.png'
              : '/images/logo-light.png'
          }
          width={100}
          height={28}
          alt="Scheddy logo"
        />

        <nav className="mx-6 flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/85 aria-selected:text-foreground aria-selected:hover:text-foreground"
            aria-selected={pathname === '/'}
          >
            Dashboard
          </Link>
          <Link
            href="/schedulings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/85 aria-selected:text-foreground aria-selected:hover:text-foreground"
            aria-selected={pathname.startsWith('/schedulings')}
          >
            {t('MainMenu.schedulings')}
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/85 aria-selected:text-foreground aria-selected:hover:text-foreground"
            aria-selected={pathname.startsWith('/services')}
          >
            {t('MainMenu.services')}
          </Link>
          <Link
            href="/availability"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/85 aria-selected:text-foreground aria-selected:hover:text-foreground"
            aria-selected={pathname.startsWith('/availability')}
          >
            {t('MainMenu.availability')}
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user.image ?? undefined}
                  alt={session?.user.name}
                />
                <AvatarFallback>
                  {session?.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="/me">
                  {t('UserNav.profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>{t('UserNav.settings')}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => signOut()}
            >
              {t('UserNav.logOut')}{' '}
              <LogOutIcon className="h-4 w-4 text-destructive/80" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
