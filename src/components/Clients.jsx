'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { toneProps } from '@/lib/tone'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function NameRow({ names, rowClass = '', ariaHidden = false }) {
  return (
    <ul className={`flex shrink-0 items-center ${rowClass}`} aria-hidden={ariaHidden || undefined}>
      {names.map((name) => (
        <li key={name} className="flex items-center">
          <span className="heading-dot whitespace-nowrap px-6 text-4xl md:px-10 md:text-6xl">{name}</span>
          <span aria-hidden="true" style={{ color: 'var(--accent)' }}>
            ✦
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Clients & recognition — two marquee rows of client names running in
 * opposite directions. Scrolling speeds them up in proportion to scroll
 * velocity, then they ease back to cruising speed. Reduced motion: a static,
 * wrapped list instead.
 */
export default function Clients() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()
  const names = t('clients.names')
  const awards = t('clients.awards')
  // Second row starts halfway through the list so the rows don't mirror
  const offsetNames = [...names.slice(names.length / 2), ...names.slice(0, names.length / 2)]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Each track holds the list twice; moving it by -50% loops seamlessly
        const forward = gsap.fromTo('.marquee-a', { xPercent: 0 }, { xPercent: -50, duration: 45, ease: 'none', repeat: -1 })
        const backward = gsap.fromTo('.marquee-b', { xPercent: -50 }, { xPercent: 0, duration: 45, ease: 'none', repeat: -1 })
        const loops = [forward, backward]

        const cruise = gsap.delayedCall(0.15, () => {
          loops.forEach((loop) => gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out', overwrite: true }))
        }).pause()

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6)
            loops.forEach((loop) => gsap.to(loop, { timeScale: boost, duration: 0.25, overwrite: true }))
            cruise.restart(true)
          },
        })

        gsap.from('.award-row', {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.award-list', start: 'top 85%', once: true },
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="clients" {...toneProps('ink')} className="relative overflow-hidden py-24 md:py-36">
      <p className="eyebrow mb-12 px-6 md:px-12 lg:px-24">{t('clients.label')}</p>

      {/* Motion: looping marquees */}
      <div className="space-y-4 motion-reduce:hidden md:space-y-6">
        <div className="overflow-hidden">
          <div className="marquee-a flex w-max">
            <NameRow names={names} />
            <NameRow names={names} ariaHidden />
          </div>
        </div>
        <div className="overflow-hidden" style={{ color: 'var(--fg-subtle)' }}>
          <div className="marquee-b flex w-max">
            <NameRow names={offsetNames} ariaHidden />
            <NameRow names={offsetNames} ariaHidden />
          </div>
        </div>
      </div>

      {/* Reduced motion: static list */}
      <div className="hidden px-6 motion-reduce:block md:px-12 lg:px-24">
        <NameRow names={names} rowClass="flex-wrap gap-y-4" />
      </div>

      <div className="mx-auto mt-24 max-w-6xl px-6 md:mt-36 md:px-12 lg:px-0">
        <p className="eyebrow mb-8">{t('clients.awardsLabel')}</p>
        <ul className="award-list">
          {awards.map((award) => (
            <li
              key={award.name}
              className="award-row grid grid-cols-12 items-baseline gap-4 border-t py-6"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <span className="heading-display col-span-12 text-2xl md:col-span-6 md:text-3xl">{award.name}</span>
              <span className="col-span-8 text-sm md:col-span-4" style={{ color: 'var(--fg-muted)' }}>
                {award.body}
              </span>
              <span className="col-span-4 text-right text-sm md:col-span-2" style={{ color: 'var(--fg-subtle)' }}>
                {award.year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
