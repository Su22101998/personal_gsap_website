'use client'

import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import en from './locales/en'

const locales = { en }

const TranslationContext = createContext(null)

/**
 * Wraps the app to provide the current locale's translations via context.
 *
 * Adding a new language:
 *   1. Create `src/i18n/locales/<code>.js` mirroring `en.js`.
 *   2. Import it here and add it to the `locales` map.
 *   3. Call `setLocale('<code>')` from any component to switch.
 */
export function TranslationProvider({ children, defaultLocale = 'en' }) {
  const [locale, setLocale] = useState(defaultLocale)

  const t = useCallback(
    (key) => {
      const translations = locales[locale]
      if (!translations) return key
      const result = key.split('.').reduce((obj, k) => obj?.[k], translations)
      return result ?? key
    },
    [locale],
  )

  const value = useMemo(() => ({ t, locale, setLocale }), [t, locale])

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

/**
 * Hook to access the translation function and current locale.
 *
 * @returns {{ t: (key: string) => any, locale: string, setLocale: (code: string) => void }}
 */
export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
