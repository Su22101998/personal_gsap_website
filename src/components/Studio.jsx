'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { toneProps } from '@/lib/tone'
import { clipReveal } from '@/lib/animation'
import RevealText from '@/components/RevealText'
import PlaceholderArt from '@/components/PlaceholderArt'
import AnimatedCounter from '@/components/AnimatedCounter'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Studio — rises in as a card over the ink sections, with a parallax
 * "studio" image, the studio story and counters.
 */
export default function Studio() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()
  const stats = t('studio.stats')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        clipReveal(sectionRef.current)

        // Image drifts within its frame as the section passes
        gsap.fromTo(
          '.studio-art',
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: '.studio-frame', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="studio" {...toneProps('paper')} className="section-padding relative">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-12 md:gap-16">
        <div className="studio-frame relative overflow-hidden rounded-[28px] md:col-span-5" style={{ aspectRatio: '4 / 5' }}>
          <div className="studio-art absolute inset-x-0 -inset-y-[10%]">
            <PlaceholderArt seed={3} className="h-full w-full" />
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="eyebrow mb-6">{t('studio.label')}</p>
          <RevealText as="h2" className="heading-section mb-8">
            {t('studio.heading')}
          </RevealText>
          <RevealText className="mb-5 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {t('studio.body')}
          </RevealText>
          <RevealText className="mb-12 max-w-xl leading-relaxed" style={{ color: 'var(--fg-muted)' }} delay={0.1}>
            {t('studio.bodySecondary')}
          </RevealText>

          <dl className="grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: 'var(--hairline)' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--fg-subtle)' }}>
                  {stat.label}
                </dt>
                <dd className="heading-dot text-5xl md:text-6xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
