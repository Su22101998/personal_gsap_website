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
 * Services — full-width rows with hairline dividers; each row's title
 * slides and takes the accent colour on hover.
 */
export default function Services() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()
  const items = t('services.items')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Rows: divider draws across, then the content fades up
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.service-row').forEach((row) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: 'top 88%', once: true },
          })
          tl.from(row.querySelector('.service-rule'), {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.2,
            ease: 'expo.out',
          }).from(
            row.querySelectorAll('.service-fade'),
            { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
            0.15
          )
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="services" {...toneProps('ink')} className="section-padding relative">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-6">{t('services.label')}</p>
        <RevealText as="h2" className="heading-section mb-16 md:mb-24 max-w-3xl">
          {t('services.heading')}
        </RevealText>

        <div className="relative">
          <ol>
            {items.map((item, i) => (
              <li key={item.title} className="service-row group relative">
                <div className="service-rule h-px w-full" style={{ background: 'var(--hairline)' }} />
                <div className="grid grid-cols-12 items-center gap-4 py-8 md:py-12">
                  <span
                    className="service-fade col-span-2 text-sm md:col-span-1"
                    style={{ color: 'var(--fg-subtle)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="service-fade col-span-10 md:col-span-5">
                    <span className="heading-display inline-block text-4xl transition-[translate,color] duration-500 ease-out group-hover:translate-x-4 md:text-6xl group-hover:[color:var(--accent)]">
                      {item.title}
                    </span>
                  </h3>
                  <div className="service-fade col-span-12 md:col-span-6 md:pl-8">
                    <p className="mb-4 max-w-md" style={{ color: 'var(--fg-muted)' }}>
                      {item.description}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
                          style={{ border: '1px solid var(--hairline)', color: 'var(--fg-muted)' }}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="h-px w-full" style={{ background: 'var(--hairline)' }} />
        </div>
      </div>
    </section>
  )
}
