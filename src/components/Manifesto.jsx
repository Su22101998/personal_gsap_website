'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { toneProps } from '@/lib/tone'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/**
 * Manifesto — picks up exactly where the hero's planet zoom ends (the
 * accent fill). Pinned: the statement's words light up one by one as you
 * scroll, then the background bleeds to ink to hand over to Services.
 * Text stays readable throughout: paper on accent and on ink.
 */
export default function Manifesto() {
  const sectionRef = useRef(null)
  const statementRef = useRef(null)
  const { t } = useTranslation()

  useGSAP(
    () => {
      const section = sectionRef.current
      const mm = gsap.matchMedia()

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          // Background: accent → ink, driven by a 0→1 mix factor
          section.style.setProperty('--mix', '0')
          section.style.backgroundColor =
            'color-mix(in srgb, rgb(var(--c-ink)) calc(var(--mix) * 100%), rgb(var(--c-stage)))'

          if (context.conditions.reduce) {
            // No pin, no word reveal — just the colour hand-off near the end
            gsap.to(section, {
              '--mix': 1,
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'bottom bottom', end: 'bottom top', scrub: true },
            })
            return
          }

          // Words only (not lines), so a resize never needs a re-split
          const split = SplitText.create(statementRef.current, { type: 'words' })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=160%',
              pin: true,
              scrub: 0.6,
            },
          })

          tl.fromTo(
            split.words,
            { opacity: 0.14 },
            { opacity: 1, ease: 'none', stagger: 0.08, duration: 0.6 }
          )
            .from('.manifesto-label', { opacity: 0, y: 12, duration: 0.3 }, 0)
            .to(section, { '--mix': 1, ease: 'none', duration: 1.2 }, '+=0.4')
            // Hold at full ink so the scrub lag settles before the pin
            // releases — otherwise a purple/ink seam can show at the bottom
            .to({}, { duration: 0.5 })
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      {...toneProps('accent')}
      className="relative flex min-h-screen items-center px-6 md:px-12 lg:px-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="manifesto-label eyebrow mb-10">{t('manifesto.label')}</p>
        <p
          ref={statementRef}
          // Breakpoint leading is needed too: text-5xl/6xl carry their own line-height
          className="heading-display text-[2.1rem] leading-[1.12] sm:text-5xl sm:leading-[1.1] md:text-6xl md:leading-[1.08] lg:text-[4.6rem]"
        >
          {t('manifesto.statement')}
        </p>
      </div>
    </section>
  )
}
