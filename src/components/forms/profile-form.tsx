'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { api, RouterOutputs } from '@/lib/trpc-client'
import {
  UpdateProfileSchema,
  updateProfileSchema,
} from '@/schemas/update-profile-schema'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useToast } from '../ui/use-toast'

export function ProfileForm({
  profile,
}: {
  profile: RouterOutputs['profile']['get']
}) {
  const { toast } = useToast()

  const t = useTranslations('Me.ProfileForm')

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: profile,
  })

  const { mutate } = api.profile.update.useMutation({
    onError(error) {
      if (error.data?.code === 'CONFLICT') {
        form.setError('slug', { message: t('messages.slugError') })
      }

      toast({
        title: t('messages.updateError'),
      })
    },
    onSuccess() {
      toast({
        title: t('messages.updateSuccess'),
      })
    },
  })

  function onSubmit(data: UpdateProfileSchema) {
    mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('input.name.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('input.name.placeholder')} {...field} />
              </FormControl>
              <FormDescription>{t('input.name.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('input.bio.label')}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t('input.bio.placeholder')}
                  value={field.value ?? ''}
                  onChange={(ev) =>
                    field.onChange(
                      ev.target.value !== '' ? ev.target.value : null
                    )
                  }
                />
              </FormControl>
              <FormDescription>{t('input.bio.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('input.slug.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('input.slug.placeholder')} {...field} />
              </FormControl>
              <FormDescription>{t('input.slug.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t('button')}</Button>
      </form>
    </Form>
  )
}
