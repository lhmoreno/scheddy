import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ProfileForm } from '@/components/forms/profile-form'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/trpc-server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: '', namespace: 'Me.ProfileForm' })

  return {
    title: `${t('title')} | Scheddy`,
  }
}

export default async function Me() {
  const profile = await api.profile.get()

  const t = await getTranslations('Me')

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6 rounded-md border p-6">
        <div>
          <h3 className="text-lg font-medium">{t('ProfileForm.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('ProfileForm.subtitle')}
          </p>
        </div>
        <Separator />
        <ProfileForm profile={profile} />
      </div>
      <div className="space-y-6 rounded-md border p-6">
        <div>
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings. Set your preferred language and
            timezone.
          </p>
        </div>
        <Separator />
        <div>delete button</div>
      </div>
    </div>
  )
}
