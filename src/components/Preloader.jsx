'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { INTRO_SEEN_KEY, markIntroDone } from '@/lib/intro'

gsap.registerPlugin(SplitText, useGSAP)

// Never hold visitors longer than this waiting for fonts/images
const MAX_WAIT_MS = 5000

/** Resolves once web fonts and the window load event are done (or after MAX_WAIT_MS). */
function pageReady() {
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
  const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS))
  return Promise.race([Promise.all([document.fonts?.ready, loaded]), timeout])
}

/**
 * Preloader — once per session. Wordmark rises letter by letter while a
 * counter runs to 100 (holding near the end until the page is actually
 * ready), then the panel lifts away over a trailing accent panel and fires
 * the intro signal so the hero entrance plays as it's revealed.
 *
 * Server-rendered so it covers the page from first paint; skipped via
 * <html data-intro="skip"> (see PRELOADER_INIT_SCRIPT) on repeat visits and
 * for reduced motion.
 */
export default function Preloader() {
  const rootRef = useRef(null)
  const wordmarkRef = useRef(null)
  const counterRef = useRef(null)
  const { t } = useTranslation()

  useGSAP(
    (context, contextSafe) => {
      if (document.documentElement.dataset.intro === 'skip') {
        markIntroDone()
        return
      }

      const root = rootRef.current
      const split = SplitText.create(wordmarkRef.current, { type: 'chars', mask: 'chars' })
      const count = { value: 0 }
      const render = () => {
        counterRef.current.textContent = String(Math.round(count.value)).padStart(3, '0')
      }

      const intro = gsap.timeline()
      intro
        .from(split.chars, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.04 })
        .from('.preloader-meta', { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, 0.3)
        .to(count, { value: 88, duration: 1.6, ease: 'power2.inOut', onUpdate: render }, 0.2)
        .to('.preloader-bar', { scaleX: 0.88, duration: 1.6, ease: 'power2.inOut' }, 0.2)

      const exit = contextSafe(() => {
        gsap
          .timeline({
            onComplete: () => {
              root.style.display = 'none'
              try {
                sessionStorage.setItem(INTRO_SEEN_KEY, '1')
              } catch {
                // Storage blocked — the preloader just shows again next visit
              }
            },
          })
          .to(count, { value: 100, duration: 0.5, ease: 'power2.out', onUpdate: render })
          .to('.preloader-bar', { scaleX: 1, duration: 0.5, ease: 'power2.out' }, '<')
          .to([split.chars, '.preloader-meta'], { yPercent: -110, opacity: 0, duration: 0.6, ease: 'power3.in', stagger: 0.015 }, '+=0.15')
          .to('.preloader-panel', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: 0.12 }, '-=0.15')
          // Hand over while the panels are still lifting, so the hero starts as it's revealed
          .add(markIntroDone, '-=0.6')
      })

      // Exit once both the intro has played and the page is ready
      let cancelled = false
      Promise.all([intro.then(), pageReady()]).then(() => {
        if (!cancelled) exit()
      })
      return () => {
        cancelled = true
      }
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="preloader fixed inset-0 z-[10001]" aria-hidden="true">
      {/* Trailing accent panel (revealed briefly as the ink panel lifts) */}
      <div className="preloader-panel absolute inset-0" style={{ background: 'rgb(var(--c-accent))' }} />

      <div
        className="preloader-panel absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-12 md:py-10"
        style={{ background: 'rgb(var(--c-ink))', color: 'rgb(var(--c-paper))' }}
      >
        <p className="preloader-meta text-[11px] uppercase tracking-[0.24em]" style={{ color: 'rgb(var(--c-paper) / 0.5)' }}>
          {t('preloader.tagline')}
        </p>

        {/* Generous leading: each character is masked to its line box, so a
            tight one would clip the descender of the "y" */}
        <p ref={wordmarkRef} className="heading-dot text-center text-[11vw] leading-[1.3] md:text-[8.5vw]">
          {t('preloader.wordmark')}
        </p>

        <div>
          <div className="preloader-meta mb-4 flex items-end justify-between">
            <span className="text-[11px] uppercase tracking-[0.24em]" style={{ color: 'rgb(var(--c-paper) / 0.5)' }}>
              {t('preloader.loading')}
            </span>
            <span ref={counterRef} className="heading-dot counter-value text-5xl md:text-7xl">
              000
            </span>
          </div>
          <div className="h-px w-full" style={{ background: 'rgb(var(--c-paper) / 0.15)' }}>
            <div className="preloader-bar h-full origin-left" style={{ background: 'rgb(var(--c-accent))', transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
