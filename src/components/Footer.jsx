'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const NAV = [
  { key: 'work', href: '#work' },
  { key: 'services', href: '#services' },
  { key: 'process', href: '#process' },
  { key: 'studio', href: '#studio' },
]

/**
 * Footer — "curtain" reveal. The footer is sticky at the bottom of the
 * page, underneath the content (which sits above it, see page.jsx); the
 * last section scrolls away to uncover it, and the oversized wordmark rises
 * letter by letter as it's uncovered.
 *
 * A sticky element's position can't drive a ScrollTrigger (it measures as
 * if it were stuck), so a zero-height sentinel in normal flow, right where
 * the reveal starts, is the trigger. It also flips the page stage to ink.
 */
export default function Footer() {
  const sentinelRef = useRef(null)
  const footerRef = useRef(null)
  const wordmarkRef = useRef(null)
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(wordmarkRef.current, { type: 'chars', mask: 'chars' })
        const reveal = {
          trigger: sentinelRef.current,
          start: 'top bottom',
          end: () => `+=${footerRef.current.offsetHeight}`,
          scrub: true,
        }

        gsap.from(split.chars, { yPercent: 105, ease: 'none', stagger: 0.04, scrollTrigger: reveal })
        gsap.from('.footer-top', { y: 60, opacity: 0, ease: 'none', scrollTrigger: reveal })
      })
    },
    { scope: footerRef }
  )

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" data-stage="ink" data-stage-start="top 48px" />
      <footer ref={footerRef} data-tone="ink" className="sticky bottom-0 z-0 overflow-hidden px-6 pt-20 md:px-12 lg:px-24">
        <div className="footer-top mx-auto grid max-w-6xl gap-12 pb-16 md:grid-cols-12">
          <p className="heading-display max-w-sm text-3xl md:col-span-6 md:text-4xl">{t('footer.tagline')}</p>

          <nav aria-label={t('footer.navLabel')} className="md:col-span-3">
            <p className="eyebrow mb-5">{t('footer.navLabel')}</p>
            <ul className="space-y-2">
              {NAV.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="focus-ring transition-colors hover:[color:var(--accent)]">
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="focus-ring transition-colors hover:[color:var(--accent)]">
                  {t('nav.bookCall')}
                </a>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">{t('footer.socialLabel')}</p>
            <ul className="space-y-2">
              {t('footer.socials').map((social) => (
                <li key={social.label}>
                  <a href={social.href} className="focus-ring transition-colors hover:[color:var(--accent)]">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          ref={wordmarkRef}
          aria-hidden="true"
          // Line-height ≥ 1: each character is masked to its line box, so a
          // tighter leading would clip descenders (the "y")
          className="heading-dot whitespace-nowrap pb-[1vw] text-center text-[12.5vw] leading-[1.05]"
        >
          {t('footer.wordmark')}
        </p>

        <div
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t py-6 text-xs"
          style={{ borderColor: 'var(--hairline)', color: 'var(--fg-subtle)' }}
        >
          <p>
            © {year} {t('nav.brand')}. {t('footer.rights')}
          </p>
          <a href="#home" className="focus-ring uppercase tracking-[0.18em] transition-colors hover:[color:var(--fg)]">
            {t('footer.backToTop')} ↑
          </a>
        </div>
      </footer>
    </>
  )
}
