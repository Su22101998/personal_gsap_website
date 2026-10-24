'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { toneProps } from '@/lib/tone'
import RevealText from '@/components/RevealText'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Process — four numbered steps joined by a line.
 * Desktop: the section pins and the line draws across; each step lights up
 * as the line reaches it. Mobile: a vertical line scrubs down beside the
 * steps, no pin. Reduced motion: everything shown, nothing moves.
 */
export default function Process() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()
  const steps = t('process.steps')

  useGSAP(
    () => {
      const section = sectionRef.current
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          isMobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { isDesktop, isMobile } = context.conditions
          const stepEls = gsap.utils.toArray('.process-step', section)
          const dots = gsap.utils.toArray('.process-dot', section)

          if (isDesktop) {
            const tl = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=150%',
                pin: true,
                scrub: 0.6,
              },
            })
            tl.fromTo('.process-line-x', { scaleX: 0 }, { scaleX: 1, duration: stepEls.length }, 0)
            stepEls.forEach((step, i) => {
              tl.fromTo(step, { opacity: 0.2 }, { opacity: 1, duration: 0.5 }, i + 0.1)
              tl.fromTo(dots[i], { scale: 0.4 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, i + 0.1)
            })
          }

          if (isMobile) {
            gsap.fromTo(
              '.process-line-y',
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: '.process-list', start: 'top 70%', end: 'bottom 70%', scrub: true },
              }
            )
            stepEls.forEach((step) => {
              gsap.from(step, {
                opacity: 0.2,
                x: 16,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: step, start: 'top 70%', once: true },
              })
            })
          }
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="process"
      {...toneProps('ink')}
      className="section-padding relative flex min-h-screen flex-col justify-center"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="eyebrow mb-6">{t('process.label')}</p>
        <RevealText as="h2" className="heading-section mb-16 max-w-3xl md:mb-24">
          {t('process.heading')}
        </RevealText>

        <div className="process-list relative">
          {/* Desktop connector: hairline + drawn accent line through the dots */}
          <div className="absolute left-0 right-0 top-[7px] hidden h-px md:block" style={{ background: 'var(--hairline)' }}>
            <div className="process-line-x h-full origin-left" style={{ background: 'var(--accent)' }} />
          </div>
          {/* Mobile connector: vertical */}
          <div className="absolute bottom-2 left-[7px] top-2 w-px md:hidden" style={{ background: 'var(--hairline)' }}>
            <div className="process-line-y h-full w-full origin-top" style={{ background: 'var(--accent)' }} />
          </div>

          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="process-step relative pl-10 md:pl-0 md:pt-12">
                <span
                  className="process-dot absolute left-0 top-0 block h-[15px] w-[15px] rounded-full"
                  style={{ background: 'var(--accent)', boxShadow: '0 0 0 4px var(--bg)' }}
                  aria-hidden="true"
                />
                <span className="heading-dot mb-4 block text-6xl md:text-7xl" style={{ color: 'var(--fg-subtle)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-3 text-lg font-medium">{step.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
