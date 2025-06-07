'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  const otherLanguage = languages.find(lang => lang.code !== locale)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => otherLanguage && switchLanguage(otherLanguage.code)}
        className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-green-200 hover:shadow-md"
      >
        <Languages size={18} />
        <span className="hidden sm:inline">
          {otherLanguage?.nativeName}
        </span>
        <span className="sm:hidden">
          {otherLanguage?.code.toUpperCase()}
        </span>
      </Button>
    </div>
  )
}