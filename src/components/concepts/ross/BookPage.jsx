'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import Book3D from './Book3D'
import { Endorsers, Newsletter, SplitHeading, reduce, useRise } from './shared'
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
  // Hovering the book swings it round to show the spine and pages, the same
  // turn the home page gives it on scroll
  const lift = contextSafe((on) => {
    gsap.to('.rs-b-lift', { rotateY: on ? 46 : 0, rotateX: on ? -4 : 0, y: on ? -12 : 0, scale: on ? 1.03 : 1, duration: reduce() ? 0 : 1.1, ease: 'power3.inOut', overwrite: 'auto' })
  })
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
              <div className="rs-b-lift [transform-style:preserve-3d]" onPointerEnter={() => lift(true)} onPointerLeave={() => lift(false)}>
                <Book3D />
              </div>
            </div>
          </div>
          {/* Rotating badge */}
          <svg className="rs-b-badge absolute right-[8%] top-0 h-32 w-32 md:h-36 md:w-36" viewBox="0 0 120 120" aria-label="Number 1 Amazon bestseller, in print, Kindle and audio">
            <defs>
              <path id="rs-badge-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
            </defs>
            <circle cx="60" cy="60" r="58" fill="rgb(var(--rs-accent-rgb))" />
            {/* Sized to fit once around the circle (circumference ≈ 289) */}
            <g className="rs-b-ring">
              <text className="rs-mono" fontSize="7.6" letterSpacing="1.15" fill="#0a0a0a">
                <textPath href="#rs-badge-circle">#1 AMAZON BESTSELLER · PRINT · KINDLE · AUDIO ·</textPath>
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

/*
 * The eight lessons as an open book. The first leaf says how to turn the
 * pages; after it, each leaf carries a lesson on its front (the right-hand
 * page) and the next chapter's number on its back (the left-hand page), and
 * turns over its spine. Pages turn only on purpose:
 * click a page, drag it, use the arrows or the keyboard, so a fast scroll
 * can't skip past them.
 */
const PAGE = 'absolute inset-0 overflow-hidden bg-[#f2f0eb] text-[#0a0a0a] [backface-visibility:hidden]'
const pad = (n) => String(n).padStart(2, '0')

function Lessons() {
  const ref = useRef(null)
  const leaves = useRef([])
  const [page, setPage] = useState(0) // leaves turned so far, 0…9
  const pageRef = useRef(0) // the same, current even between quick clicks
  const lessons = b.lessons.length
  const total = lessons + 1 // the intro leaf, then one per lesson
  const drag = useRef(null)

  // Leaves stack by turn order: unturned ones on the right with the next on
  // top, turned ones on the left with the latest on top
  const zFor = (i, turned) => (turned ? i + 1 : total - i)
  useGSAP(
    () => {
      leaves.current.forEach((leaf, i) => gsap.set(leaf, { rotateY: i < page ? -180 : 0, zIndex: zFor(i, i < page) }))
    },
    { scope: ref, dependencies: [] }
  )

  const { contextSafe } = useGSAP({ scope: ref })
  const turn = contextSafe((dir) => {
    const now = pageRef.current
    const next = now + dir
    if (next < 0 || next > total) return
    const i = dir > 0 ? now : now - 1
    const leaf = leaves.current[i]
    pageRef.current = next
    setPage(next)
    gsap
      .timeline()
      .set(leaf, { zIndex: total + 2 })
      .to(leaf, { rotateY: dir > 0 ? -180 : 0, duration: reduce() ? 0 : 0.9, ease: 'power2.inOut' })
      .set(leaf, { zIndex: zFor(i, dir > 0) })
  })

  const onKey = (e) => {
    if (e.key === 'ArrowRight') (e.preventDefault(), turn(1))
    if (e.key === 'ArrowLeft') (e.preventDefault(), turn(-1))
  }
  const onDown = (e) => (drag.current = e.clientX)
  const onUp = (e) => {
    if (drag.current == null) return
    const dx = e.clientX - drag.current
    drag.current = null
    if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1)
    else {
      // A click: the right half turns forward, the left half back
      const r = e.currentTarget.getBoundingClientRect()
      turn(e.clientX > r.left + r.width / 2 ? 1 : -1)
    }
  }

  const arrow = (dir, disabled) => (
    <button
      type="button"
      onClick={() => turn(dir)}
      disabled={disabled}
      aria-label={dir > 0 ? 'Next page' : 'Previous page'}
      className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#f2f0eb] transition-colors hover:border-rs-accent hover:text-rs-accent disabled:pointer-events-none disabled:opacity-30"
    >
      {dir > 0 ? '→' : '←'}
    </button>
  )

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rs-label mb-6">8 things this book will teach you</p>
            <SplitHeading className="rs-display rs-to-baseline text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Turn the pages.</SplitHeading>
          </div>
          {/* Arrows and the counter's numerals sit on the heading's baseline */}
          <div className="flex items-end gap-4">
            <p className="rs-display rs-to-baseline text-[clamp(2rem,4vw,3.4rem)] leading-none [--rs-lh:1]" aria-live="polite">
              <span className="text-rs-accent">{pad(Math.min(Math.max(page, 1), lessons))}</span>
              <span className="text-white/25"> / {pad(lessons)}</span>
            </p>
            {arrow(-1, page === 0)}
            {arrow(1, page === total)}
          </div>
        </div>

        {/* The open book */}
        <div
          tabIndex={0}
          role="group"
          aria-roledescription="book"
          aria-label="8 things this book will teach you. Click, swipe or use the arrow keys to turn the pages."
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (drag.current = null)}
          className="focus-ring relative mx-auto mt-14 aspect-[4/3] max-w-[1100px] cursor-pointer touch-pan-y select-none rounded-[6px] [perspective:2400px] sm:aspect-[2/1.15]"
        >
          {/* Shadow under the spread */}
          <div className="absolute inset-x-[3%] -bottom-6 h-10 rounded-[50%] bg-rs-accent opacity-20 blur-2xl" aria-hidden="true" />

          {/* Left base page: the opening */}
          <div className={`${PAGE} right-1/2 flex flex-col justify-between rounded-l-[6px] p-[6%]`}>
            <span className="rs-mono text-[10px] uppercase tracking-[0.18em] text-black/45">Create Once, Distribute Forever</span>
            <span className="rs-display text-[clamp(1.4rem,3.6vw,3.4rem)] leading-[0.95]">
              Eight lessons, <span className="text-rs-accent">one page at a time.</span>
            </span>
            <span className="rs-mono text-[10px] uppercase tracking-[0.18em] text-black/45">By Ross Simmonds</span>
          </div>

          {/* Right base page: the end */}
          <div className={`${PAGE} left-1/2 flex flex-col justify-between rounded-r-[6px] p-[6%]`}>
            <span className="rs-mono text-[10px] uppercase tracking-[0.18em] text-black/45">The rest is in the book</span>
            <span className="rs-display text-[clamp(1.3rem,3.2vw,3rem)] leading-[0.98]">Ready for the whole playbook?</span>
            <span className="flex flex-wrap gap-2" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
              <RLink path="/buy-book/" className="rs-btn rs-btn-orange">
                Buy the book ↗
              </RLink>
            </span>
          </div>

          {/* Leaves */}
          {['intro', ...b.lessons].map((l, i) => (
            <div
              key={l}
              ref={(el) => (leaves.current[i] = el)}
              className="absolute inset-y-0 left-1/2 right-0 origin-left [transform-style:preserve-3d]"
              aria-hidden={i !== page}
            >
              {/* Front: how to turn, then the lessons */}
              <div className={`${PAGE} flex flex-col justify-between rounded-r-[6px] border-l border-black/10 p-[6%] shadow-[inset_24px_0_30px_-24px_rgb(0_0_0/0.35)]`}>
                <span className="rs-mono flex justify-between text-[10px] uppercase tracking-[0.18em] text-black/45">
                  <span>{i ? `Lesson ${pad(i)}` : 'Contents'}</span>
                  <span>{i * 2 + 2}</span>
                </span>
                {i ? (
                  <span className="rs-display text-[clamp(1.15rem,2.7vw,2.6rem)] leading-[1.05]">{l}</span>
                ) : (
                  <span className="rs-display text-[clamp(1.5rem,3.6vw,3.4rem)] leading-[0.95]">
                    Click or swipe <span className="text-rs-accent">to turn the page →</span>
                  </span>
                )}
                <span className="h-[3px] w-12 bg-rs-accent" />
              </div>
              {/* Back: the next chapter's number */}
              <div className={`${PAGE} flex flex-col justify-between rounded-l-[6px] p-[6%] shadow-[inset_-24px_0_30px_-24px_rgb(0_0_0/0.35)] [transform:rotateY(180deg)]`}>
                <span className="rs-mono text-[10px] uppercase tracking-[0.18em] text-black/45">{i < lessons ? 'Chapter' : 'That’s all eight'}</span>
                <span className="rs-display text-[clamp(4rem,14vw,13rem)] leading-[0.8] text-rs-accent">{i < lessons ? pad(i + 1) : '✓'}</span>
                <span className="rs-mono text-[10px] uppercase tracking-[0.18em] text-black/45">{i * 2 + 3}</span>
              </div>
            </div>
          ))}

          {/* Spine */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-[20] w-px -translate-x-1/2 bg-black/20" aria-hidden="true" />
        </div>

        {/* Progress */}
        <div className="mx-auto mt-12 h-[2px] max-w-[1100px] bg-white/10">
          <div className="h-full origin-left bg-rs-accent transition-transform duration-700" style={{ transform: `scaleX(${page / total})` }} />
        </div>
      </div>
    </section>
  )
}

/* Small line icons for the three formats */
const FORMAT_ICONS = {
  print: (
    <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5c-.8 0-1.5-.7-1.5-1.5zM13 4h5.5c.8 0 1.5.7 1.5 1.5v13c0 .8-.7 1.5-1.5 1.5H13zM11 4c.6.9 1.2 1.3 2 0M11 20c.6-.9 1.2-1.3 2 0" />
  ),
  kindle: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M8 6.5h8M8 9.5h8M8 12.5h5M10.5 18.5h3" />
    </>
  ),
  audio: (
    <>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4.5" height="6.5" rx="1.5" />
      <rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5" />
    </>
  ),
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
                <span className="flex items-center justify-between">
                  <span className="rs-mono text-[12px] text-white/40 group-hover:text-black/60">0{i + 1}</span>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-rs-accent transition-colors duration-500 group-hover:text-[#0a0a0a]" aria-hidden="true">
                    {FORMAT_ICONS[f.icon]}
                  </svg>
                </span>
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
            <input id="rs-ch-email" type="email" placeholder="Email address" className="h-10 rounded-[4px] sm:flex-1 border border-black/25 bg-white/20 px-4 text-[14px] placeholder:text-black/50" />
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

/* Reader reviews from the live book page, each with its photo and stars */
function Readers() {
  const ref = useRef(null)
  useRise(ref, '.rs-reader', { y: 40 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">What readers say</p>
        <SplitHeading className="rs-display mb-14 max-w-4xl text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">
          Pull out a pen <span className="rs-serif text-rs-accent">and a highlighter.</span>
        </SplitHeading>
        <ul className="gap-5 sm:columns-2 lg:columns-3">
          {b.readers.map((r) => (
            <li key={r.name} className="rs-reader mb-5 break-inside-avoid">
              <figure className="flex flex-col gap-6 rounded-[14px] border border-white/10 bg-white/[0.03] p-7 transition-colors duration-500 hover:border-rs-accent/60 md:p-8">
                <span className="text-[14px] tracking-[0.2em] text-rs-accent" aria-label="Five stars">
                  ★★★★★
                </span>
                <blockquote className="text-[17px] leading-relaxed text-white/80">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="flex items-center gap-4 border-t border-white/10 pt-5">
                  <Image src={`/work/ross-simmonds/people/${r.photo}.jpg`} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                  <span>
                    <span className="block text-[16px] font-medium text-[#f2f0eb]">{r.name}</span>
                    <span className="block text-[13px] leading-snug text-white/50">{r.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
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
      <Endorsers />
      <Author />
      <Newsletter />
    </>
  )
}
