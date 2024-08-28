import 'dayjs/locale/pt-br'

import lib from 'dayjs'
import dayjsTimezone from 'dayjs/plugin/timezone'
import dayjsUtc from 'dayjs/plugin/utc'
import { useLocale } from 'next-intl'

lib.extend(dayjsUtc)
lib.extend(dayjsTimezone)

export function useDayjs() {
  const locale = useLocale()

  if (locale === 'pt') {
    lib.locale('pt-br')
  }

  return lib
}
