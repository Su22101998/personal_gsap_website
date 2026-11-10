'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import Book3D from './Book3D'
import { CarouselDots, Count, Endorsers, Logo, Newsletter, SplitHeading, reduce, useCarousel, useRise } from './shared'
import { about as a, consulting, featuredIn } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const IMG = '/work/ross-simmonds/'

/* Hero: the H1, then a framed portrait that opens to full width on scroll */
function Hero() {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reduce()) return
      gsap.from('.rs-a-fade', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.6 })
      gsap.fromTo(
        '.rs-a-portrait',
        { clipPath: 'inset(8% 22% 8% 22% round 14px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: '.rs-a-portrait', start: 'top 85%', end: 'top 15%', scrub: true },
        }
      )
      gsap.fromTo('.rs-a-portrait img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.rs-a-portrait', start: 'top bottom', end: 'bottom top', scrub: true } })
    },
    { scope: ref }
  )
  return (
    <section ref={ref} className="pt-16 md:pt-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <p className="rs-label rs-a-fade mb-8">About Ross</p>
        {/* Preserves the live page's H1 */}
        <SplitHeading as="h1" immediate className="rs-display max-w-6xl text-[clamp(2.4rem,5.4vw,5.4rem)] leading-[0.98]">
          Ross Simmonds boosts B2B & SaaS brands&rsquo; organic growth with <span className="rs-serif text-rs-accent">content marketing, SEO, and technology</span>
        </SplitHeading>
        <div className="rs-a-fade mt-10 flex flex-wrap gap-3">
          <RLink path="/consulting/" label="Consulting" className="rs-btn rs-btn-orange">
            Work with Ross →
          </RLink>
          <RLink path="/keynotes/" label="Keynotes" className="rs-btn rs-btn-ghost">
            Book a keynote
          </RLink>
        </div>
      </div>
      <div className="rs-a-portrait relative mt-16 aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
        <Image src={`${IMG}about-portrait.jpg`} alt="Ross Simmonds speaking on stage" fill priority sizes="100vw" className="object-cover object-[70%_8%]" />
      </div>
    </section>
  )
}

function Numbers() {
  const ref = useRef(null)
  useRise(ref, '.rs-a-num', { y: 40 })
  return (
    <section ref={ref} className="px-5 py-20 md:px-8 md:py-28">
      {/* One size for all three, centred and top-aligned so they line up across the row */}
      <dl className="mx-auto grid max-w-[1400px] gap-x-10 gap-y-12 md:grid-cols-3">
        {a.numbers.map((n, i) => (
          <div key={n.label} className="rs-a-num flex flex-col-reverse items-center justify-end border-t border-white/15 pt-10 text-center">
            <dt className="mt-4 max-w-[26ch] text-[16px] leading-snug text-white/60">{n.label}</dt>
            <dd className={`rs-display text-[clamp(3.4rem,6vw,5.6rem)] leading-[0.9] tracking-[-0.04em] ${i === 0 ? 'text-rs-accent' : ''}`}>
              <Count value={n.value} prefix={n.prefix} suffix={n.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* His phrase, lighting up word by word as you scroll */
function Phrase() {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reduce()) return
      const split = SplitText.create('.rs-phrase', { type: 'words' })
      gsap.fromTo(split.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 55%', scrub: true } })
    },
    { scope: ref }
  )
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-8">The idea he&rsquo;s known for</p>
        <p className="rs-phrase rs-display text-[clamp(3.4rem,10vw,10rem)] leading-[0.92]">
          Create once. <span className="text-rs-accent">Distribute forever.</span>
        </p>
        <p className="mt-10 max-w-xl text-[18px] leading-relaxed text-white/60">
          It&rsquo;s the thread through everything he builds: great work only matters once the right people see it, so distribution deserves as much care as creation.
        </p>
      </div>
    </section>
  )
}

/* Pinned chapters that scroll sideways */
function Chapters() {
  const ref = useRef(null)
  const { track, current, onScroll, goTo } = useCarousel()
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const track = ref.current.querySelector('.rs-ch-track')
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
    <section ref={ref} className="overflow-hidden border-t border-white/10 bg-black lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
      <div className="px-5 pb-10 pt-24 md:px-8">
        <p className="rs-label mb-4">The story so far</p>
        <h2 className="rs-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">Fifteen years, six chapters.</h2>
      </div>
      {/* Below desktop: a swipeable carousel of equal cards. Desktop: the pinned sideways scroll */}
      <ol
        ref={track}
        onScroll={onScroll}
        className="rs-ch-track relative flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-5 [scrollbar-width:none] md:px-8 lg:w-max lg:gap-5 lg:overflow-visible lg:pb-20 [&::-webkit-scrollbar]:hidden"
      >
        {a.chapters.map((c, i) => (
          <li key={c.title} className="flex w-[84%] shrink-0 snap-center flex-col overflow-hidden rounded-[14px] border border-white/10 bg-[#111] sm:w-[60%] lg:h-[58vh] lg:w-[34vw] lg:min-w-[380px]">
            <div className="relative h-[200px] shrink-0 overflow-hidden lg:h-[45%]">
              {c.img ? (
                <Image src={`${IMG}${c.img}`} alt="" fill sizes="(min-width: 1024px) 34vw, 84vw" className="object-cover grayscale" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#0a0a0a] [perspective:900px]">
                  <div style={{ transform: 'scale(0.45) rotateY(-25deg)', transformStyle: 'preserve-3d' }}>
                    <Book3D />
                  </div>
                </div>
              )}
              <span className="rs-mono absolute left-4 top-4 rounded-[4px] bg-black/70 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/80">
                0{i + 1}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <span className="rs-display text-[2.4rem] leading-none text-rs-accent">{c.mark}</span>
              <h3 className="rs-display mt-4 text-[1.6rem] leading-[1.1]">{c.title}</h3>
              <p className="mt-2 text-[15px] text-white/60">{c.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <CarouselDots count={a.chapters.length} current={current} goTo={goTo} noun="chapter" className="mb-20 mt-6 lg:hidden" />
    </section>
  )
}

/* The five roles; the photo swaps with the hovered role */
function Roles() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const { contextSafe } = useGSAP({ scope: ref })
  const pick = contextSafe((i) => {
    if (i === active) return
    setActive(i)
    if (!reduce()) gsap.fromTo('.rs-role-img', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.out' })
  })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="rs-label mb-6">Five hats</p>
          <ul className="border-t border-white/15">
            {a.roles.map((r, i) => (
              <li key={r.title} className="border-b border-white/15">
                <button
                  type="button"
                  onPointerEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                  className="group flex w-full flex-col items-start py-7 text-left"
                >
                  <span className={`rs-display text-[clamp(2rem,4.4vw,4rem)] leading-[1] transition-colors duration-300 ${active === i ? 'text-rs-accent' : 'text-white/35 group-hover:text-white/70'}`}>
                    {r.title}
                  </span>
                  <span className={`mt-2 text-[15px] transition-opacity duration-300 ${active === i ? 'text-white/65 opacity-100' : 'opacity-0'}`}>{r.body}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[10px] lg:sticky lg:top-28 lg:h-[70vh] lg:self-start">
          <div className="rs-role-img absolute inset-0">
            <Image src={`${IMG}${a.roles[active].img}`} alt={`Ross Simmonds as ${a.roles[active].title.toLowerCase()}`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Ventures() {
  const ref = useRef(null)
  useRise(ref, '.rs-a-col', { y: 40 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-3">
        <div className="rs-a-col">
          <p className="rs-label mb-6">Built & backed</p>
          <ul className="space-y-3">
            {a.ventures.map((v) => (
              <li key={v} className="rs-display text-[1.6rem] leading-[1.2]">
                {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="rs-a-col">
          <p className="rs-label mb-6">Recognition</p>
          <ul className="space-y-4">
            {a.recognition.map((r) => (
              <li key={r} className="flex gap-3 text-[17px] text-white/75">
                <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-rs-accent" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="rs-a-col">
          <p className="rs-label mb-6">Featured in</p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-6">
            {featuredIn.map((f) => (
              <li key={f}>
                <Logo id={f} size={24} className="opacity-50" />
              </li>
            ))}
          </ul>
          <p className="rs-label mb-6 mt-12">Clients advised</p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-6">
            {consulting.clients.map((c) => (
              <li key={c}>
                <Logo id={c} size={24} className="opacity-70" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Hero />
      <Numbers />
      <Phrase />
      <Chapters />
      <Roles />
      <Ventures />
      <Endorsers />
      <Newsletter />
    </>
  )
}
