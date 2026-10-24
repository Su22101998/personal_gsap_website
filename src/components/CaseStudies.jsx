'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { toneProps } from '@/lib/tone'
import { bleedBackground } from '@/lib/animation'
import RevealText from '@/components/RevealText'
import PlaceholderArt from '@/components/PlaceholderArt'
import AnimatedCounter from '@/components/AnimatedCounter'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Artwork per case (indexes into PlaceholderArt compositions)
const CASE_ART = [0, 1, 4]

/**
 * Featured case studies — stacked sticky panels. Each panel pins near the
 * top while the next one slides over it; the covered panel recedes
 * (scales down, a shade fades over it). Pinning is plain CSS sticky; GSAP
 * only scrubs transform/opacity (compositor-only, so no repaints while
 * scrolling), and the same on mobile. The section bleeds from the
 * accent tone to ink at the end, handing over to Process.
 */
export default function CaseStudies() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()
  const cases = t('caseStudies.cases')

  useGSAP(
    () => {
      const section = sectionRef.current
      const mm = gsap.matchMedia()

      // Colour hand-off to Process (ink). Must be complete before the
      // section's bottom edge scrolls into view, or the seam shows.
      // Runs for reduced motion too.
      bleedBackground(section, {
        from: 'stage',
        to: 'ink',
        trigger: section,
        start: 'bottom 190%',
        end: 'bottom 100%',
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const panels = gsap.utils.toArray('.case-panel', section)

        panels.forEach((panel, i) => {
          const next = panels[i + 1]
          if (next) {
            // Recede while the next panel slides over: scale + a shade that
            // dims it without hiding it
            const recede = {
              trigger: next,
              start: 'top bottom',
              end: 'top 12%',
              scrub: true,
            }
            gsap.to(panel.querySelector('.case-card'), { scale: 0.94, ease: 'none', scrollTrigger: recede })
            gsap.to(panel.querySelector('.case-shade'), { opacity: 0.3, ease: 'none', scrollTrigger: recede })
          }

          // Artwork opens with the scroll as the panel rises, fully open
          // well before the panel settles — never blank while readable
          gsap.fromTo(
            panel.querySelector('.case-art'),
            { clipPath: 'inset(16% 6% 16% 6% round 18px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 18px)',
              ease: 'none',
              scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 45%', scrub: true },
            }
          )
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="cases"
      {...toneProps('accent')}
      className="relative px-4 pb-[30vh] pt-28 md:px-12 md:pt-36 lg:px-24"
    >
      <div className="mx-auto mb-16 max-w-6xl md:mb-24">
        <p className="eyebrow mb-6">{t('caseStudies.label')}</p>
        <RevealText as="h2" className="heading-section">
          {t('caseStudies.heading')}
        </RevealText>
      </div>

      <div className="mx-auto max-w-6xl">
        {cases.map((study, i) => (
          <div
            key={study.client}
            className="case-panel sticky mb-[12vh]"
            style={{ top: `calc(12vh + ${i * 14}px)` }}
          >
            <article
              className="case-card relative grid origin-top gap-8 overflow-hidden rounded-[28px] p-6 will-change-transform md:min-h-[70vh] md:grid-cols-2 md:gap-12 md:p-12"
              data-tone="ink"
            >
              {/* Dims the card as the next one covers it (see the recede tween) */}
              <div aria-hidden="true" className="case-shade pointer-events-none absolute inset-0 z-10 bg-black opacity-0" />
              <div className="flex flex-col">
                <p className="mb-4 text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--fg-subtle)' }}>
                  <span style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="mx-3">—</span>
                  {study.client} · {study.category}
                </p>
                <h3 className="heading-display mb-6 text-3xl md:text-5xl">{study.title}</h3>
                <p className="mb-10 max-w-md" style={{ color: 'var(--fg-muted)' }}>
                  {study.description}
                </p>

                <dl className="mt-auto grid grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: 'var(--hairline)' }}>
                  {study.stats.map((stat) => (
                    // dt must precede dd; flex-col-reverse shows the number first
                    <div key={stat.label} className="flex flex-col-reverse">
                      <dt className="mt-1 text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--fg-subtle)' }}>
                        {stat.label}
                      </dt>
                      <dd className="heading-dot text-3xl md:text-4xl">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <PlaceholderArt
                seed={CASE_ART[i % CASE_ART.length]}
                className="case-art min-h-[260px] rounded-[18px] md:min-h-0"
              />
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
