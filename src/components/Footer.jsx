'use client'

import { useTranslation } from '@/i18n'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative py-12 px-6"
      style={{ borderTop: '1px solid var(--border-color)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))' }}
            >
              {t('footer.logo')}
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {t('footer.brand')}
            </span>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-4 font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t('footer.status')}
            </span>
            <span>|</span>
            <span>{t('footer.version')}</span>
            <span>|</span>
            <span>{currentYear}</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <a href="#home" className="hover:opacity-80 transition-opacity">{t('footer.home')}</a>
            <a href="#work" className="hover:opacity-80 transition-opacity">{t('footer.work')}</a>
            <a href="#contact" className="hover:opacity-80 transition-opacity">{t('footer.contact')}</a>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {t('footer.credits')}
          </p>
        </div>
      </div>
    </footer>
  )
}
