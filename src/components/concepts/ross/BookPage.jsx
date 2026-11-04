'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import Book3D from './Book3D'
import { Newsletter, SplitHeading, reduce, useRise } from './shared'
import { book as b } from './data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* Hero: the book, tilting toward the cursor */
function Hero() {
  const ref = useRef(null)
  const { contextSafe } = useGSAP(
    () => {
      if (reduce()) return
      gsap.from('.rs-b-book', { rotateY: -70, y: 60, opacity: 0, duration: 1.6, ease: 'expo.out', delay: 0.3 })
      gsap.from('.rs-b-fade', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.6 })
      // Only the ring of text turns; the #1 stays upright
      gsap.to('.rs-b-ring', { rotation: 360, svgOrigin: '60 60', duration: 24, ease: 'none', repeat: -1 })
    },
    { scope: ref }
  )
  const tilt = useRef(null)
  const onMove = contextSafe((e) => {
    if (reduce()) return
    if (!tilt.current) {
      const el = ref.current.querySelector('.rs-b-tilt')
      tilt.current = { y: gsap.quickTo(el, 'rotateY', { duration: 0.8, ease: 'power3' }), x: gsap.quickTo(el, 'rotateX', { duration: 0.8, ease: 'power3' }) }
    }
    const r = ref.current.getBoundingClientRect()
    tilt.current.y(((e.clientX - r.left) / r.width - 0.5) * 50 - 18)
    tilt.current.x(-((e.clientY - r.top) / r.height - 0.5) * 22)
  })

  return (
    <section ref={ref} onPointerMove={onMove} className="relative overflow-hidden px-5 pb-20 pt-16 md:px-8 md:pt-20">
      <div className="pointer-events-none absolute right-[10%] top-[20%] h-[50vw] w-[50vw] rounded-full bg-rs-accent opacity-[0.1] blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="rs-label rs-b-fade mb-8">The book · by Ross Simmonds</p>
          {/* Preserves the live page's H1 */}
          <SplitHeading as="h1" immediate className="rs-display text-[clamp(3.4rem,8.6vw,8.4rem)] leading-[0.88]">
            Create Once, <span className="rs-serif text-rs-accent">Distribute Forever</span>
          </SplitHeading>
          <p className="rs-b-fade mt-8 max-w-lg text-[19px] leading-relaxed text-white/70">
            How great creators spread their ideas, and the playbook you can use to make every piece of your work travel further.
          </p>
          <div className="rs-b-fade mt-10 flex flex-wrap gap-3">
            <RLink path="/buy-book/" className="rs-btn rs-btn-orange">
              Buy the book ↗
            </RLink>
            <a href="#chapter" className="rs-btn rs-btn-ghost">
              Get a free chapter
            </a>
          </div>
        </div>
        <div className="relative flex justify-center py-10 [perspective:1400px]">
          <div className="rs-b-book [transform-style:preserve-3d]">
            <div className="rs-b-tilt [transform-style:preserve-3d]" style={{ transform: 'rotateY(-18deg)' }}>
              <Book3D />
            </div>
          </div>
          {/* Rotating badge */}
          <svg className="rs-b-badge absolute right-[8%] top-0 h-32 w-32 md:h-36 md:w-36" viewBox="0 0 120 120" aria-label="Number 1 Amazon bestseller">
            <defs>
              <path id="rs-badge-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
            </defs>
            <circle cx="60" cy="60" r="58" fill="rgb(var(--rs-accent-rgb))" />
            {/* Sized to fit once around the circle (circumference ≈ 289) */}
            <g className="rs-b-ring">
              <text className="rs-mono" fontSize="9" letterSpacing="2" fill="#0a0a0a">
                <textPath href="#rs-badge-circle">#1 AMAZON BESTSELLER · CREATE ONCE ·</textPath>
              </text>
            </g>
            <text x="60" y="70" textAnchor="middle" className="rs-display" fontSize="30" fill="#0a0a0a">
              #1
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}

function Pitch() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_1.2fr]">
        <SplitHeading className="rs-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">The secret to sustainable marketing.</SplitHeading>
        <div className="space-y-6 text-[19px] leading-relaxed text-white/70">
          <p>Most teams treat publishing as the finish line. This book treats it as the starting gun.</p>
          <p>
            It shows how the best creators and companies squeeze every ounce of value from what they make, by taking one idea and getting it in front of every audience that matters, on every channel that counts.
          </p>
        </div>
      </div>
    </section>
  )
}

/* The eight lessons, one at a time, on a pinned panel */
function Lessons() {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray('.rs-lesson')
        const counter = ref.current.querySelector('.rs-lesson-n')
        const bar = ref.current.querySelector('.rs-lesson-bar')
        gsap.set(items, { yPercent: 40, opacity: 0 })
        gsap.set(items[0], { yPercent: 0, opacity: 1 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: `+=${items.length * 70}%`,
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              const i = Math.min(items.length - 1, Math.floor(self.progress * items.length))
              counter.textContent = String(i + 1).padStart(2, '0')
            },
          },
        })
        items.forEach((item, i) => {
          if (i === 0) return
          tl.to(items[i - 1], { yPercent: -40, opacity: 0, duration: 0.5, ease: 'power2.in' }, i).to(item, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, i + 0.35)
        })
        tl.fromTo(bar, { scaleX: 1 / items.length }, { scaleX: 1, duration: items.length, ease: 'none' }, 0)
      })
    },
    { scope: ref }
  )
  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 bg-black md:flex md:h-[100svh] md:items-center">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-24 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <p className="rs-label">8 things this book will teach you</p>
          <p className="rs-display hidden text-[clamp(3rem,6vw,5rem)] leading-none md:block">
            <span className="rs-lesson-n text-rs-accent">01</span>
            <span className="text-white/25"> / 08</span>
          </p>
        </div>
        <div className="mt-6 hidden h-[2px] bg-white/10 md:block">
          <div className="rs-lesson-bar h-full origin-left bg-rs-accent" />
        </div>
        {/* Desktop: one lesson at a time. Phones: a plain numbered list. */}
        <ol className="relative mt-14 md:h-[38vh]">
          {b.lessons.map((l, i) => (
            <li key={l} className="rs-lesson border-b border-white/10 py-6 md:absolute md:inset-x-0 md:top-0 md:border-0 md:py-0">
              <span className="rs-mono mr-4 text-[13px] text-white/40 md:hidden">0{i + 1}</span>
              <span className="rs-display text-[1.6rem] leading-[1.1] md:block md:max-w-5xl md:text-[clamp(2.6rem,5.6vw,5.4rem)] md:leading-[1]">{l}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Formats() {
  const ref = useRef(null)
  useRise(ref, '.rs-b-format', { y: 40 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">Formats</p>
        <SplitHeading className="rs-display mb-14 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Read it, swipe it or hear it.</SplitHeading>
        <ul className="grid gap-px overflow-hidden rounded-[14px] border border-white/10 bg-white/10 md:grid-cols-3">
          {b.formats.map((f, i) => (
            <li key={f.name} className="rs-b-format">
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col bg-[#0a0a0a] p-8 transition-colors duration-500 hover:bg-rs-accent hover:text-[#0a0a0a] md:p-10">
                <span className="rs-mono text-[12px] text-white/40 group-hover:text-black/60">0{i + 1}</span>
                <span className="rs-display mt-12 text-[2.6rem] leading-none">{f.name}</span>
                <span className="mt-3 text-[15px] text-white/60 group-hover:text-black/70">{f.note}</span>
                <span className="rs-mono mt-10 text-[12px] uppercase tracking-[0.14em]">Get it ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FreeChapter() {
  const [sent, setSent] = useState(false)
  return (
    <section id="chapter" className="border-t border-white/10 bg-rs-accent px-5 py-24 text-[#0a0a0a] md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-end gap-10 lg:grid-cols-2">
        <SplitHeading className="rs-display text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.92]">Read the first chapter free.</SplitHeading>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="rs-ch-name">First name</label>
            <input id="rs-ch-name" placeholder="First name" className="h-10 rounded-[4px] border border-black/25 bg-white/20 px-4 text-[14px] placeholder:text-black/50 sm:w-44" />
            <label className="sr-only" htmlFor="rs-ch-email">Email address</label>
            <input id="rs-ch-email" type="email" placeholder="Email address" className="flex-1 h-10 rounded-[4px] border border-black/25 bg-white/20 px-4 text-[14px] placeholder:text-black/50" />
            <button type="submit" className="rs-btn bg-[#0a0a0a] text-[#f2f0eb] hover:bg-[#f2f0eb] hover:text-[#0a0a0a]">
              Get the chapter
            </button>
          </div>
          <p className="text-[13px] text-black/70" aria-live="polite">
            {sent ? 'Concept only: nothing was sent. The live form delivers the chapter on rosssimmonds.com.' : 'The chapter lands in your inbox in a minute.'}
          </p>
        </form>
      </div>
    </section>
  )
}

function Readers() {
  const ref = useRef(null)
  useRise(ref, '.rs-reader', { y: 30 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-10">What readers say · endorsed by</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-3">
          {b.readers.map((r) => (
            <li key={r} className="rs-reader rs-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] text-white/25 transition-colors duration-300 hover:text-rs-accent">
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-xl text-[14px] text-white/40">Each reader&rsquo;s full endorsement from the live page would sit in a card here, fed from the CMS.</p>
      </div>
    </section>
  )
}

function Author() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[10px]">
          <Image src="/work/ross-simmonds/panel-portrait.jpg" alt="Ross Simmonds" fill sizes="(min-width: 768px) 35vw, 100vw" className="object-cover object-top" />
        </div>
        <div>
          <p className="rs-label mb-6">About the author</p>
          <h2 className="rs-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95]">Ross Simmonds</h2>
          <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-white/65">
            Founder of Foundation, creator of Distribution.ai and a speaker on stages around the world, Ross has spent his career helping brands make great work travel.
          </p>
          <RLink path="/about/" label="About" className="rs-btn rs-btn-ghost mt-8">
            More about Ross →
          </RLink>
        </div>
      </div>
    </section>
  )
}

export default function BookPage() {
  return (
    <>
      <Hero />
      <Pitch />
      <Lessons />
      <Formats />
      <FreeChapter />
      <Readers />
      <Author />
      <Newsletter />
    </>
  )
}
