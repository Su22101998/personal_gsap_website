'use client'

import { BRANDS, setBrand } from '@/lib/brand'
import { useBrand } from '@/hooks/useBrand'
import { useTranslation } from '@/i18n'

// Fixed swatches (not stage tokens) so each option always previews its own brand
const SWATCHES = {
  violet: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
  noir: 'linear-gradient(135deg, #0a0908 50%, #c9a96e 50%)',
}

/** Segmented control that switches the site between brand themes. */
export default function BrandSwitch({ className = '' }) {
  const brand = useBrand()
  const { t } = useTranslation()

  return (
    <div
      role="radiogroup"
      aria-label={t('brandSwitch.label')}
      className={`inline-flex items-center gap-0.5 rounded-full p-0.5 ${className}`}
      style={{ border: '1px solid var(--hairline)' }}
    >
      {BRANDS.map((name) => {
        const isActive = brand === name
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setBrand(name)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors duration-300"
            style={{
              color: isActive ? 'var(--fg)' : 'var(--fg-subtle)',
              background: isActive ? 'var(--surface-hover)' : 'transparent',
            }}
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: SWATCHES[name], boxShadow: '0 0 0 1px var(--hairline)' }}
            />
            {t(`brandSwitch.${name}`)}
          </button>
        )
      })}
    </div>
  )
}
