'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Right-hand progress rail (desktop): section counter "03 / 09", a hairline
 * that fills with page progress, and the current section's name. Hidden on
 * the hero. Decorative — the navbar is the real navigation.
 *
 * Render this AFTER the page content: its ScrollTriggers must be created
 * after the hero's pin, or their positions won't include the pin spacing.
 */
export default function ScrollProgress() {
  const rootRef = useRef(null)
  const fillRef = useRef(null)
  const digitRef = useRef(null)
  const [sections, setSections] = useState([])
  const [active, setActive] = useState(-1) // index into `sections`; -1 = hero
  const { t } = useTranslation()

  // Sections + their triggers
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        // Explicit document scope: inside a scoped useGSAP, selector strings
        // would otherwise only search this component's own root
        const els = gsap.utils.toArray('main section[id]', document).filter((el) => el.id !== 'home')
        setSections(els.map((el) => el.id))

        els.forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => self.isActive && setActive(i),
            // Back above the first section → hero again
            onLeaveBack: () => i === 0 && setActive(-1),
          })
        })

        gsap.fromTo(
          fillRef.current,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }
        )
      })
    },
    { scope: rootRef }
  )

  // Show/hide + roll the counter whenever the section changes
  useGSAP(
    () => {
      gsap.to(rootRef.current, { autoAlpha: active >= 0 ? 1 : 0, duration: 0.4, overwrite: 'auto' })
      if (active >= 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(digitRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' })
      }
    },
    { dependencies: [active], scope: rootRef }
  )

  const pad = (n) => String(n).padStart(2, '0')
  const current = Math.max(active, 0)

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden flex-col items-center gap-3 md:flex"
      style={{ translate: '0 -50%', visibility: 'hidden', color: 'var(--fg)' }}
    >
      <span className="heading-dot block overflow-hidden text-2xl leading-none">
        <span ref={digitRef} className="block">
          {pad(current + 1)}
        </span>
      </span>
      <span className="relative h-28 w-px" style={{ background: 'var(--hairline)' }}>
        <span ref={fillRef} className="absolute inset-0 origin-top" style={{ background: 'var(--accent)' }} />
      </span>
      <span className="heading-dot text-sm leading-none" style={{ color: 'var(--fg-subtle)' }}>
        {pad(sections.length)}
      </span>
      <span
        className="mt-2 text-[10px] uppercase tracking-[0.24em]"
        style={{ writingMode: 'vertical-rl', color: 'var(--fg-muted)' }}
      >
        {sections[current] ? t(`progress.${sections[current]}`) : ''}
      </span>
    </div>
  )
}
