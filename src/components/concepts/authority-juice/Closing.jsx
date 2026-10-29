'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import RevealText from '@/components/RevealText'
import { EXTERNAL } from './ui'
import { proximityChars, toChars } from './motion'
import { asset, footer, LIVE_SITE, newsletter, outro } from './content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── Newsletter over their meadow video ──────────── */
function Newsletter() {
  const ref = useRef(null)
  const [sent, setSent] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.aj-news-card',
          { clipPath: 'inset(12% 8% 12% 8% round 40px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: '.aj-news-card', start: 'top 95%', end: 'top 35%', scrub: true } }
        )
        gsap.fromTo('.aj-news-video', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.aj-news-card', start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    },
    { scope: ref }
  )

  // This page is a showcase: nothing is collected, sign-ups are pointed to the live site
  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const field = 'w-full rounded-full border border-white/15 bg-black/35 px-5 py-3.5 text-sm text-white outline-none backdrop-blur-md placeholder:text-white/50 focus:border-[#ff6612]'

  return (
    <section ref={ref} className="px-5 pb-24 md:px-8">
      <div className="aj-news-card relative mx-auto max-w-[1100px] overflow-hidden rounded-[28px]">
        <video className="aj-news-video absolute inset-0 h-full w-full object-cover" src={newsletter.video} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/60" />
        <div className="relative px-6 py-24 text-center md:py-32">
          <RevealText as="h2" className="mb-4 text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
            {newsletter.heading}
          </RevealText>
          <p className="mx-auto mb-10 max-w-md text-white/80">{newsletter.text}</p>
          {sent ? (
            <p role="status" className="mx-auto max-w-md rounded-2xl bg-black/40 px-5 py-4 text-sm backdrop-blur-md">
              {newsletter.demoNote}{' '}
              <a href={LIVE_SITE} {...EXTERNAL} className="text-[#ff8a47] underline underline-offset-4">
                Go to authorityjuice.com ↗
              </a>
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto grid max-w-md gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input aria-label={newsletter.fields.first} placeholder={newsletter.fields.first} className={field} autoComplete="off" />
                <input aria-label={newsletter.fields.last} placeholder={newsletter.fields.last} className={field} autoComplete="off" />
              </div>
              <div className="relative">
                <input type="email" aria-label="Email" placeholder={newsletter.fields.email} className={`${field} pr-32`} autoComplete="off" />
                <button type="submit" className="focus-ring absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[#ff6612] px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-[#ff7a2e]">
                  {newsletter.button}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Their footer: a giant wordmark whose letters rise as you reach it and
      jump toward the cursor ── */
function Footer() {
  const ref = useRef(null)
  const word = footer.marquee.replace('*', '').trim() // "AUTHORITY JUICE"

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.aj-mark-letter', {
          yPercent: 110,
          rotate: (i) => (i % 2 ? 8 : -8),
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: '.aj-mark', start: 'top bottom', end: 'bottom 85%', scrub: 0.6 },
        })
        gsap.to('.aj-mark-star', { rotate: 360, duration: 8, ease: 'none', repeat: -1 })
      })
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => proximityChars(gsap.utils.toArray('.aj-mark-char'), { radius: 220, lift: 40 }))
    },
    { scope: ref }
  )

  return (
    <footer ref={ref} className="overflow-hidden border-t pt-16" style={{ borderColor: 'var(--aj-line)' }}>
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div className="relative h-14 w-[130px]">
          <Image src={asset('logo.png')} alt="Authority Juice" fill sizes="130px" className="object-contain object-left" />
        </div>
        {footer.columns.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-sm font-semibold">{col.title}</p>
            <ul className="space-y-2.5 text-sm" style={{ color: 'var(--aj-muted)' }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} {...(link.external ? EXTERNAL : {})} className="focus-ring transition-colors hover:text-[#ff6612]">
                    {link.label}
                    {link.external && ' ↗'}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p aria-hidden="true" className="aj-mark mt-20 flex items-start justify-center whitespace-nowrap px-4 font-aj-tight text-[9.4vw] font-bold leading-[0.9] tracking-[-0.04em]">
        {toChars(word).map((char, i) =>
          char === ' ' ? (
            <span key={i} className="inline-block w-[0.28em]" />
          ) : (
            // char (proximity) › mask › letter (scroll reveal)
            <span
              key={i}
              className="aj-mark-char inline-block"
              style={{ color: 'color-mix(in srgb, #ff6612 calc(var(--heat, 0) * 100%), #8a93a6)' }}
            >
              <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                <span className="aj-mark-letter inline-block">{char}</span>
              </span>
            </span>
          )
        )}
        <span className="aj-mark-star ml-[0.08em] inline-block text-[0.5em] leading-none text-[#ff6612]">*</span>
      </p>
      <p className="py-8 text-center text-xs tracking-[0.18em]" style={{ color: 'var(--aj-subtle)' }}>
        {footer.rights}
      </p>
    </footer>
  )
}

/* ── Cyber Pears outro ───────────────────────────── */
function Outro() {
  return (
    <section data-tone="accent" className="section-padding">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow mb-6">{outro.label}</p>
          <RevealText as="h2" className="heading-section mb-8">
            {outro.heading}
          </RevealText>
          <p className="max-w-lg text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {outro.text}
          </p>
        </div>
        <div className="flex flex-col items-start justify-end gap-5 md:col-span-5 md:items-end">
          <Link href="/#contact" className="btn-retro focus-ring inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em]">
            {outro.primary} ↗
          </Link>
          <Link href="/#work" className="focus-ring text-sm uppercase tracking-[0.18em] underline-offset-8 hover:underline">
            ← {outro.secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}

export { Newsletter, Footer, Outro }
