'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { toneProps } from '@/lib/tone'

gsap.registerPlugin(SplitText, useGSAP)

const AUTO_ADVANCE_MS = 7000

/**
 * Testimonials — one quote at a time. Each new quote's words rise in
 * through masks. Auto-advances while on screen; pauses on hover/focus and
 * never auto-advances for reduced-motion users.
 */
export default function Testimonials() {
  const sectionRef = useRef(null)
  const quoteRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const { t } = useTranslation()
  const items = t('testimonials.items')
  const item = items[index]

  const go = useCallback((delta) => setIndex((i) => (i + delta + items.length) % items.length), [items.length])

  // Only run the auto-advance while the section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || isPaused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => go(1), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(id)
  }, [index, isInView, isPaused, go])

  // Animate each quote in. The quote element is keyed by index, so React
  // replaces it outright and never touches DOM that SplitText rewrote.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(quoteRef.current, { type: 'words', mask: 'words' })
        gsap.from(split.words, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.025 })
        gsap.from('.testimonial-meta', { opacity: 0, y: 10, duration: 0.6, delay: 0.3, ease: 'power2.out' })
      })
    },
    { scope: sectionRef, dependencies: [index], revertOnUpdate: true }
  )

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      {...toneProps('paper')}
      className="section-padding relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-12">{t('testimonials.label')}</p>

        {/* Clicking the quote advances too — a pointer convenience; the buttons
            below are the keyboard-accessible controls */}
        <figure
          aria-live="polite"
          className="min-h-[18rem] md:min-h-[20rem]"
          data-cursor-label={t('testimonials.cursorNext')}
          onClick={() => go(1)}
        >
          <blockquote key={index} ref={quoteRef} className="heading-display text-3xl leading-[1.15] md:text-5xl lg:text-6xl">
            “{item.quote}”
          </blockquote>
          <figcaption className="testimonial-meta mt-10 flex items-center gap-4">
            <span className="h-px w-10" style={{ background: 'var(--fg-subtle)' }} aria-hidden="true" />
            <span>
              <span className="font-medium">{item.name}</span>
              <span style={{ color: 'var(--fg-muted)' }}> — {item.role}</span>
            </span>
          </figcaption>
        </figure>

        <div className="mt-12 flex items-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:[background:var(--surface)]"
            style={{ border: '1px solid var(--hairline)' }}
            aria-label={t('testimonials.prev')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:[background:var(--surface)]"
            style={{ border: '1px solid var(--hairline)' }}
            aria-label={t('testimonials.next')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="ml-2 flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className="focus-ring h-[3px] rounded-full transition-all duration-500"
                style={{ width: i === index ? 40 : 16, background: i === index ? 'var(--fg)' : 'var(--hairline)' }}
                aria-label={`${t('testimonials.goTo')} ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
