'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import { Endorsers, Newsletter, SplitHeading, reduce, useRise } from './shared'
import { keynotes as k } from './data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const IMG = '/work/ross-simmonds/'

function Hero() {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reduce()) return
      gsap.fromTo('.rs-k-bg', { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'expo.out' })
      gsap.from('.rs-k-fade', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.5 })
      gsap.to('.rs-k-bg', { yPercent: 15, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
    },
    { scope: ref }
  )
  return (
    <section ref={ref} className="relative flex min-h-[88svh] items-end overflow-hidden px-5 pb-16 md:px-8">
      <div className="rs-k-bg absolute inset-0">
        <Image src={`${IMG}keynote-ballroom.jpg`} alt="Ross Simmonds delivering a keynote to a packed ballroom" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/30" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1400px]">
        <p className="rs-label rs-k-fade mb-6">Keynote speaker · AI search · Distribution</p>
        {/* Preserves the live page's H1 */}
        <SplitHeading as="h1" immediate className="rs-display max-w-5xl text-[clamp(2.8rem,7vw,7rem)] leading-[0.92]">
          Book Ross Simmonds as Your Next <span className="rs-serif text-rs-accent">Keynote Speaker</span>
        </SplitHeading>
        <div className="rs-k-fade mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <RLink path="/contact-ross/" className="rs-btn rs-btn-orange">
            Check availability ↗
          </RLink>
          <dl className="flex gap-10">
            {k.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="rs-label mt-1">{s.label}</dt>
                <dd className="rs-display text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="rs-k-fade rs-mono mt-10 text-[12px] uppercase tracking-[0.14em] text-white/45">
          Recent stages: {k.stages.join(' · ')}
        </p>
      </div>
    </section>
  )
}

/* Talks: sticky cards that stack; each recedes as the next one covers it */
function Talks() {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray('.rs-talk')
        cards.forEach((card, i) => {
          const next = cards[i + 1]
          if (!next) return
          // Dim with a shade overlay rather than filter: brightness (cheaper to repaint)
          const st = { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true }
          gsap.to(card.querySelector('.rs-talk-inner'), { scale: 0.92, ease: 'none', scrollTrigger: st })
          gsap.to(card.querySelector('.rs-talk-shade'), { opacity: 0.6, ease: 'none', scrollTrigger: { ...st } })
        })
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} id="talks" className="px-5 pb-24 pt-24 md:px-8 md:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">Signature keynotes</p>
        <SplitHeading className="rs-display mb-16 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Five talks. Every one ends with a plan.</SplitHeading>
        {k.talks.map((t, i) => (
          <article key={t.title} className="rs-talk sticky mb-8" style={{ top: `calc(90px + ${i * 12}px)` }}>
            <div className="rs-talk-inner relative grid origin-top overflow-hidden rounded-[14px] border border-white/10 bg-[#121212] md:min-h-[72vh] md:grid-cols-[1.1fr_1fr]">
              <div className="rs-talk-shade pointer-events-none absolute inset-0 z-10 bg-black opacity-0" aria-hidden="true" />
              <div className="flex flex-col p-8 md:p-12">
                <span className="rs-display text-[5rem] leading-none text-rs-accent">0{i + 1}</span>
                <h2 className="rs-display mt-8 text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.02]">{t.title}</h2>
                <p className="rs-serif mt-3 text-[1.4rem] text-white/60">{t.sub}</p>
                <ul className="mb-10 mt-8 space-y-3 border-t border-white/10 pt-6">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[16px] text-white/75">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-rs-accent" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                <RLink path="/contact-ross/" className="rs-btn rs-btn-ghost mt-auto w-fit">
                  Check availability ↗
                </RLink>
              </div>
              <div className="relative min-h-[260px]">
                <Image src={`${IMG}${t.img}`} alt={`Ross Simmonds speaking: ${t.title}`} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Formats() {
  const ref = useRef(null)
  useRise(ref, '.rs-format', { y: 40 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">Formats</p>
        <SplitHeading className="rs-display mb-14 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Pick the room you need.</SplitHeading>
        <ul className="grid gap-px overflow-hidden rounded-[14px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {k.formats.map((f, i) => (
            <li key={f.title} className="rs-format group bg-[#0a0a0a] p-8 transition-colors duration-500 hover:bg-rs-accent hover:text-[#0a0a0a]">
              <span className="rs-mono text-[12px] text-white/40 group-hover:text-black/60">0{i + 1}</span>
              <h3 className="rs-display mt-10 text-[1.7rem] leading-[1.05]">{f.title}</h3>
              <p className="mt-3 text-[15px] text-white/60 group-hover:text-black/75">{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* A pinned strip of stage photos that scrolls sideways */
function Gallery() {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const track = ref.current.querySelector('.rs-gal-track')
        const distance = () => track.scrollWidth - window.innerWidth + 64
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        })
      })
    },
    { scope: ref }
  )
  return (
    <section ref={ref} className="overflow-hidden border-t border-white/10 bg-black md:flex md:h-[100svh] md:flex-col md:justify-center">
      <div className="px-5 pb-10 pt-24 md:px-8 md:pt-28">
        <p className="rs-label mb-4">From the stage</p>
        <h2 className="rs-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[0.95]">A decade of rooms like these.</h2>
      </div>
      <div className="rs-gal-track flex gap-5 overflow-x-auto px-5 pb-16 md:w-max md:overflow-visible md:px-8">
        {k.gallery.map((g, i) => (
          <figure key={g} className="relative h-[46vh] shrink-0 overflow-hidden rounded-[10px]" style={{ width: i % 2 ? '30vw' : '42vw', minWidth: 260 }}>
            <Image src={`${IMG}${g}`} alt="Ross Simmonds on stage" fill sizes="45vw" className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0" />
          </figure>
        ))}
      </div>
    </section>
  )
}

function Booking() {
  return (
    <section className="border-t border-white/10 px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-10">
        <SplitHeading className="rs-display max-w-3xl text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.95]">
          Tell Ross about your <span className="rs-serif text-rs-accent">event.</span>
        </SplitHeading>
        <div className="max-w-sm">
          <p className="text-white/65">Share the date, audience size and theme. You&rsquo;ll hear back about fit, format and availability.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <RLink path="/contact-ross/" className="rs-btn rs-btn-orange">
              Request availability ↗
            </RLink>
            <RLink path="/consulting/" label="Consulting" className="rs-btn rs-btn-ghost">
              Or run a workshop
            </RLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Keynotes() {
  return (
    <>
      <Hero />
      <Talks />
      <Formats />
      <Gallery />
      <Booking />
      <Endorsers />
      <Newsletter />
    </>
  )
}
