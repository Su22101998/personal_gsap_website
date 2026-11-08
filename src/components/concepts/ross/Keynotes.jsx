'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import { Endorsers, Logo, Newsletter, SplitHeading, reduce, useRise } from './shared'
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
              <div key={s.label} className="flex flex-col-reverse items-center justify-end text-center">
                <dt className="rs-label mt-1">{s.label}</dt>
                <dd className="rs-display text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rs-k-fade mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
          <p className="rs-label">Recent stages</p>
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
            {k.stages.map((s) => (
              <li key={s}>
                <Logo id={s} size={26} className="opacity-70" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const YouTubeLogo = ({ className = '' }) => (
  <Image src="/work/ross-simmonds/logos/youtube.svg" alt="YouTube" width={90} height={20} unoptimized className={`h-5 w-auto ${className}`} />
)

/* A talk's photo with a YouTube tag; it links to the recording once a talk has a `video` URL */
function TalkImage({ talk }) {
  const Frame = talk.video ? 'a' : 'div'
  const link = talk.video ? { href: talk.video, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Watch “${talk.title}” on YouTube` } : {}
  return (
    <Frame {...link} className="group relative block min-h-[260px]">
      <Image src={`${IMG}${talk.img}`} alt={`Ross Simmonds speaking: ${talk.title}`} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
      <span className="absolute left-5 top-5 flex items-center gap-3 rounded-full bg-black/75 py-2.5 pl-3.5 pr-4 backdrop-blur">
        <YouTubeLogo />
        <span className="rs-mono text-[10px] uppercase tracking-[0.14em] text-white/75">{talk.video ? 'Watch the talk ↗' : 'Recording coming soon'}</span>
      </span>
    </Frame>
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
              <TalkImage talk={t} />
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

/* Talks from his YouTube channel: a thumbnail grid; a click swaps in the player */
/* The three most-watched videos, side by side at one size; each plays in place */
function Videos() {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(null)
  useRise(ref, '.rs-video', { y: 50 })

  // A render function, not a component: the cards keep their DOM when one starts playing
  const card = (v) => {
    const on = playing === v.id
    return (
      <li key={v.id} className="rs-video">
        <div className="relative aspect-video overflow-hidden rounded-[10px] bg-[#111]">
          {on ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
              title={v.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(v.id)} aria-label={`Play “${v.title}”`} className="focus-ring group absolute inset-0 block text-left">
              <Image src={`${IMG}videos/${v.id}.jpg`} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rs-accent text-[#0a0a0a] transition-transform duration-300 group-hover:scale-110">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
            </button>
          )}
        </div>
        <p className="rs-display mt-4 text-[1.15rem] leading-[1.15]">{v.title}</p>
        <p className="rs-mono mt-2 text-[11px] uppercase tracking-[0.14em] text-white/45">{v.views} views</p>
      </li>
    )
  }
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rs-label mb-6 flex items-center gap-3">
              <YouTubeLogo className="opacity-90" /> Most watched
            </p>
            <SplitHeading className="rs-display rs-to-baseline text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Watch Ross before you book him.</SplitHeading>
          </div>
          <a href={k.channel} target="_blank" rel="noopener noreferrer" className="rs-btn rs-btn-ghost">
            All videos on YouTube ↗
          </a>
        </div>
        <ul className="grid gap-x-5 gap-y-10 md:grid-cols-3">{k.videos.map(card)}</ul>
      </div>
    </section>
  )
}

function Booking() {
  return (
    <section className="border-t border-white/10 px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-10">
        <SplitHeading className="rs-display rs-to-baseline max-w-3xl text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.95]">
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
      <Videos />
      <Gallery />
      <Formats />
      <Booking />
      <Endorsers />
      <Newsletter />
    </>
  )
}
