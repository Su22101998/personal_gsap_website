'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import Book3D from './Book3D'
import { CarouselDots, Count, Endorsers, Logo, Newsletter, SplitHeading, reduce, useCarousel, useRise } from './shared'
import { channels, featuredIn, formatDate, keynotes, podcast, posts, proof, shoutouts, waysIn } from './data'

gsap.registerPlugin(Draggable, ScrollTrigger, useGSAP)

const IMG = '/work/ross-simmonds/'

/* ---------- Hero ---------- */

function Hero() {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reduce()) return
      gsap.fromTo('.rs-hero-photo', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', delay: 0.15 })
      gsap.from('.rs-hero-photo img', { scale: 1.25, duration: 2, ease: 'expo.out', delay: 0.15 })
      gsap.from('.rs-hero-fade', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.7 })
      gsap.to('.rs-hero-photo img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} className="relative overflow-hidden px-5 pb-10 pt-14 md:px-8 md:pb-12 md:pt-20">
      <div className="mx-auto grid max-w-[1400px] items-end gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="rs-label rs-hero-fade mb-8">Founder · Marketer · Speaker · Author · Investor</p>
          {/* Preserves the live homepage H1 */}
          <SplitHeading as="h1" immediate className="rs-display text-[clamp(3rem,8.2vw,8.4rem)] leading-[0.9]">
            New school technology. <span className="rs-serif text-rs-accent">Old school storytelling.</span>
          </SplitHeading>
          <p className="rs-hero-fade mt-8 max-w-xl text-[19px] leading-relaxed text-white/70">
            Most content dies in obscurity. Ross makes sure yours doesn&rsquo;t, with distribution that gets B2B brands found in search, on social and inside AI answers.
          </p>
          <div className="rs-hero-fade mt-10 flex flex-wrap gap-3">
            <RLink path="/consulting/" label="Consulting" className="rs-btn rs-btn-orange">
              Work with me →
            </RLink>
            <RLink path="/keynotes/" label="Keynotes" className="rs-btn rs-btn-ghost">
              Book a keynote
            </RLink>
          </div>
        </div>
        <div className="rs-hero-photo relative aspect-[4/5] overflow-hidden rounded-[6px] lg:aspect-[4/5]">
          <Image src={`${IMG}keynote-black-stage.jpg`} alt="Ross Simmonds speaking on a dark stage" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[45%_center]" />
          <span className="rs-mono absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/80 backdrop-blur">
            On stage · AI search keynote
          </span>
        </div>
      </div>

      {/* Equal space above and below (the section's bottom padding), so the stats sit centred between the rules */}
      <dl className="mx-auto mt-16 grid max-w-[1400px] grid-cols-2 gap-y-8 border-t border-white/10 pt-10 md:grid-cols-4 md:pt-12">
        {proof.map((p) => (
          <div key={p.label} className="rs-hero-fade flex flex-col-reverse items-center justify-end text-center">
            <dt className="rs-label mt-2">{p.label}</dt>
            <dd className="rs-display text-5xl md:text-6xl">
              <Count value={p.value} prefix={p.prefix} suffix={p.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ---------- Signature: one idea → every channel ---------- */

const COLS = 7
const ROWS = 5

function Distribution() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const stage = ref.current.querySelector('.rs-dist-stage')
        const tiles = gsap.utils.toArray('.rs-tile', stage)
        const card = stage.querySelector('.rs-idea')
        const counter = ref.current.querySelector('.rs-dist-count')
        const count = { n: 1 }

        // Grid targets around the centre (a 3 × 3 block in the middle stays
        // clear for the idea card): 26 slots for the 24 tiles
        const slots = []
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++) {
            const centre = c >= 2 && c <= 4 && r >= 1 && r <= 3
            if (!centre) slots.push([c, r])
          }
        const target = (i, axis) => {
          const [c, r] = slots[i % slots.length]
          const w = stage.clientWidth
          const h = stage.clientHeight
          return axis === 'x' ? ((c + 0.5) / COLS - 0.5) * w * 0.94 : ((r + 0.5) / ROWS - 0.5) * h * 0.86
        }

        gsap.set(tiles, { x: 0, y: 0, scale: 0.4, opacity: 0, rotation: 0 })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: '+=220%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        tl.to(card, { scale: 1.08, rotation: -2, duration: 0.15 })
          .to(card, { rotation: 2, duration: 0.05 })
          .to(card, { rotation: 0, scale: 1, duration: 0.05 })
          .to(
            tiles,
            {
              x: (i) => target(i, 'x'),
              y: (i) => target(i, 'y'),
              scale: 1,
              opacity: 1,
              rotation: (i) => ((i * 37) % 11) - 5,
              duration: 0.55,
              stagger: { each: 0.015, from: 'center' },
            },
            0.2
          )
          .to('.rs-dist-a', { yPercent: -110, duration: 0.15 }, 0.42)
          .from('.rs-dist-b', { yPercent: 110, duration: 0.15 }, 0.47)
          .to(count, { n: channels.length, duration: 0.55, ease: 'none', onUpdate: () => (counter.textContent = Math.round(count.n)) }, 0.2)
          .to(card, { scale: 0.82, duration: 0.25 }, 0.75)
      })

      // Phones and tablets: every channel bursts out of the idea card and
      // lands in the cloud below it as you scroll; the count climbs with them
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const box = ref.current.querySelector('.rs-dist-m')
        const card = box.querySelector('.rs-idea-m')
        const chips = gsap.utils.toArray('.rs-chip', box)
        const counter = box.querySelector('.rs-dist-count-m')
        const count = { n: 1 }
        // Offset from each chip's resting place to the card's centre. Layout
        // offsets ignore transforms, so this holds on every refresh
        const list = chips[0].parentNode
        const from = (el, axis) =>
          axis === 'x'
            ? card.offsetLeft + card.offsetWidth / 2 - (list.offsetLeft + el.offsetLeft + el.offsetWidth / 2)
            : card.offsetTop + card.offsetHeight / 2 - (list.offsetTop + el.offsetTop + el.offsetHeight / 2)
        gsap
          .timeline({ scrollTrigger: { trigger: box, start: 'top 65%', end: 'bottom 75%', scrub: 0.8, invalidateOnRefresh: true } })
          .fromTo(card, { scale: 0.9, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.2, ease: 'back.out(3)' })
          .fromTo(
            chips,
            {
              x: (i, el) => from(el, 'x'),
              y: (i, el) => from(el, 'y'),
              scale: 0.2,
              opacity: 0,
              rotation: (i) => ((i * 53) % 40) - 20,
            },
            { x: 0, y: 0, scale: 1, opacity: 1, rotation: (i) => ((i * 37) % 7) - 3, ease: 'power3.out', duration: 0.5, stagger: 0.025 },
            0.1
          )
          .fromTo(count, { n: 1 }, { n: channels.length, ease: 'none', duration: 0.5 + 0.025 * channels.length, onUpdate: () => (counter.textContent = Math.round(count.n)) }, 0.1)
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 bg-black">
      {/* Desktop: pinned scene */}
      <div className="hidden h-[100svh] flex-col px-8 pb-6 pt-24 lg:flex">
        <div className="flex items-start justify-between">
          <h2 className="rs-display overflow-hidden text-[clamp(3rem,6vw,6rem)] leading-[1]">
            <span className="rs-dist-a block">Create once.</span>
            <span className="rs-dist-b -mt-[1em] block text-rs-accent">Distribute forever.</span>
          </h2>
          <p className="rs-mono text-right text-[13px] uppercase tracking-[0.14em] text-white/50">
            1 idea →{' '}
            <span className="rs-dist-count rs-display text-5xl text-[#f2f0eb]">{channels.length}</span> assets
          </p>
        </div>
        <div className="rs-dist-stage relative flex-1">
          {channels.map((c, i) => (
            <span
              key={c}
              className="rs-tile rs-mono absolute flex h-[56px] w-[156px] items-center gap-2 rounded-[10px] border border-white/15 bg-[#151515] px-4 text-[11px] uppercase tracking-[0.1em] text-white/80"
              style={{ left: 'calc(50% - 78px)', top: 'calc(50% - 28px)' }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: i % 4 === 0 ? 'rgb(var(--rs-accent-rgb))' : 'rgb(255 255 255 / 0.4)' }} />
              {c}
            </span>
          ))}
          <div
            className="rs-idea absolute flex w-[300px] flex-col gap-4 rounded-[14px] bg-[#f2f0eb] p-6 text-[#0a0a0a] shadow-[0_40px_80px_-30px_rgb(var(--rs-accent-rgb)/0.45)]"
            style={{ left: 'calc(50% - 150px)', top: 'calc(50% - 110px)' }}
          >
            <span className="rs-mono text-[11px] uppercase tracking-[0.16em] text-rs-accent">One idea</span>
            <span className="rs-display text-[28px] leading-[1.05]">A single, great piece of content</span>
            <span className="rs-mono text-[11px] uppercase tracking-[0.14em] text-black/50">Blog post · 2,400 words</span>
          </div>
        </div>
      </div>

      {/* Phones and tablets: one card bursts into every channel as you scroll */}
      <div className="rs-dist-m relative px-5 py-20 md:px-8 lg:hidden">
        <div className="pointer-events-none absolute left-1/2 top-[45%] h-[90vw] w-[90vw] -translate-x-1/2 rounded-full bg-rs-accent opacity-[0.1] blur-[90px]" aria-hidden="true" />
        <h2 className="rs-display relative text-[clamp(2.6rem,11vw,4.4rem)] leading-[0.95]">
          Create once. <span className="text-rs-accent">Distribute forever.</span>
        </h2>
        <div className="rs-idea-m relative z-10 mx-auto mt-12 flex max-w-[320px] flex-col gap-3 rounded-[14px] bg-[#f2f0eb] p-6 text-[#0a0a0a] shadow-[0_40px_80px_-30px_rgb(var(--rs-accent-rgb)/0.6)]">
          <span className="rs-mono text-[11px] uppercase tracking-[0.16em] text-rs-accent">One idea</span>
          <span className="rs-display text-[26px] leading-[1.05]">A single, great piece of content</span>
          <span className="rs-mono text-[11px] uppercase tracking-[0.14em] text-black/50">Blog post · 2,400 words</span>
        </div>
        <ul className="relative mt-10 flex flex-wrap justify-center gap-2" aria-label="Channels one piece of content can reach">
          {channels.map((c, i) => (
            <li
              key={c}
              className={`rs-chip rs-mono flex items-center gap-2 rounded-full px-3.5 py-2 text-[10.5px] uppercase tracking-[0.1em] ${
                i % 5 === 0 ? 'bg-rs-accent text-[#0a0a0a]' : 'border border-white/15 bg-[#151515] text-white/80'
              }`}
            >
              {c}
            </li>
          ))}
        </ul>
        <p className="rs-mono relative mt-10 text-center text-[12px] uppercase tracking-[0.14em] text-white/50">
          1 idea → <span className="rs-dist-count-m rs-display align-middle text-[3rem] text-[#f2f0eb]">{channels.length}</span> assets
        </p>
      </div>
    </section>
  )
}

/* ---------- Press ---------- */

function Press() {
  return (
    <section className="overflow-hidden border-t border-white/10 py-12" aria-label="Featured in">
      <div className="rs-marquee flex w-max gap-24">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-24" aria-hidden={k === 1}>
            {[...featuredIn, ...featuredIn].map((f, i) => (
              <Logo key={i} id={f} size={34} className="opacity-45 transition-opacity duration-300 hover:opacity-100" />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Shoutouts: notes stuck to the wall, free to drag around ---------- */

// The resting layout on desktop: three notes across the top, two tucked in
// below and overlapping them. Each has a tilt, a drop from the top of its row
// and a stacking order; the second note is the orange one
const NOTES = [
  { tilt: -3.5, mt: '0px', z: 3 },
  { tilt: 3, mt: '64px', z: 5 },
  { tilt: -2.5, mt: '16px', z: 3 },
  { tilt: 3, mt: '-50px', z: 1 },
  { tilt: -3, mt: '-24px', z: 2 },
]

function Shoutouts() {
  const ref = useRef(null)
  const { track, current, onScroll, goTo } = useCarousel()
  useGSAP(
    () => {
      const notes = gsap.utils.toArray('.rs-note')
      const mm = gsap.matchMedia()
      // Desktop and tablet: the notes drop onto the wall. Phones: they slide
      // into the carousel from the right (a drop would spill out of its scroller)
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(notes, {
          y: 120,
          scale: 0.6,
          opacity: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          stagger: { each: 0.09, from: 'random' },
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        })
      })
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(notes, { x: 160, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } })
      })
      // Drag them around with a mouse; touch keeps its scroll
      mm.add('(pointer: fine) and (min-width: 768px)', () => {
        // The note you pick up comes to the front. Raise its <li>: the rise-in
        // transform makes each one its own stacking context
        let top = 5
        const d = Draggable.create('.rs-note-drag', {
          bounds: ref.current,
          zIndexBoost: false,
          cursor: 'grab',
          activeCursor: 'grabbing',
          onPress() {
            gsap.set(this.target.parentNode, { zIndex: ++top })
          },
        })
        return () => d.forEach((x) => x.kill())
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rs-label mb-6">Voices of approval</p>
            <SplitHeading className="rs-display rs-to-baseline text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">
              What people <span className="rs-serif text-rs-accent">have to say.</span>
            </SplitHeading>
          </div>
          <p className="rs-mono hidden items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/45 md:[@media(pointer:fine)]:flex">
            <span className="text-rs-accent">✦</span> Drag the notes around
          </p>
        </div>
        {/* Phones: a swipeable carousel that snaps note by note. Wider: the wall */}
        <ul
          ref={track}
          onScroll={onScroll}
          className="relative -mx-5 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-5 py-6 [scrollbar-width:none] md:mx-0 md:flex-wrap md:items-start md:justify-center md:gap-8 md:overflow-visible md:px-0 md:py-0 lg:gap-0 [&::-webkit-scrollbar]:hidden"
        >
          {shoutouts.map((q, i) => {
            const hot = i === 1
            return (
              // Three layers so nothing fights: the li rises in, the middle drags, the figure tilts
              <li
                key={q.name}
                style={{ '--mt': NOTES[i].mt, zIndex: NOTES[i].z }}
                className={`rs-note relative w-[84%] shrink-0 snap-center md:w-[calc(50%-16px)] lg:mt-[var(--mt)] lg:w-[30%] ${i % 2 ? 'md:mt-10' : ''}`}
              >
                <div className="rs-note-drag h-full">
                  <figure
                    style={{ '--tilt': `${NOTES[i].tilt}deg` }}
                    className={`flex h-full flex-col gap-6 rounded-[18px] p-7 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] transition-transform duration-500 [transform:rotate(var(--tilt))] [transition-timing-function:cubic-bezier(0.34,1.8,0.64,1)] hover:[transform:rotate(0deg)_scale(1.03)] md:p-8 ${
                      hot ? 'bg-rs-accent text-[#0a0a0a]' : 'border border-white/10 bg-[#161616]'
                    }`}
                  >
                    <span className={`rs-display text-[4.5rem] leading-[0.5] ${hot ? 'text-[#0a0a0a]' : 'text-rs-accent'}`} aria-hidden="true">
                      &ldquo;
                    </span>
                    <blockquote className={`rs-display text-[clamp(1.25rem,1.9vw,1.6rem)] leading-[1.2] ${hot ? '' : 'text-[#f2f0eb]'}`}>{q.quote}</blockquote>
                    <figcaption className="mt-auto flex items-center gap-3">
                      <Image src={`${IMG}people/${q.photo}.jpg`} alt="" width={44} height={44} draggable={false} className="h-11 w-11 rounded-full object-cover" />
                      <span>
                        <span className="block text-[15px] font-medium">{q.name}</span>
                        <span className={`block text-[13px] ${hot ? 'text-black/65' : 'text-white/50'}`}>{q.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </div>
              </li>
            )
          })}
        </ul>
        <CarouselDots count={shoutouts.length} current={current} goTo={goTo} noun="note" className="md:hidden" />
      </div>
    </section>
  )
}

/* ---------- Four ways in ---------- */

function WaysIn() {
  const ref = useRef(null)
  useRise(ref, '.rs-way', { y: 40 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">Work together</p>
        <SplitHeading className="rs-display mb-14 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">
          Four ways in. Pick the one that fits.
        </SplitHeading>
        <ul className="border-t border-white/15">
          {waysIn.map((w, i) => (
            <li key={w.title} className="rs-way border-b border-white/15">
              <RLink
                path={w.path}
                to={w.url}
                label={w.title}
                className="rs-fill-row group grid items-center gap-4 px-2 py-8 transition-colors duration-500 hover:text-[#0a0a0a] focus-visible:outline-none md:grid-cols-[80px_1.1fr_1.4fr_auto] md:px-4"
              >
                <span className="rs-mono text-[13px] text-white/40 transition-colors group-hover:text-black/60">0{i + 1}</span>
                <span className="rs-display text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1]">{w.title}</span>
                <span className="max-w-md text-[16px] text-white/60 transition-colors group-hover:text-black/75">{w.body}</span>
                <span className="rs-mono text-[12px] uppercase tracking-[0.14em]">
                  {w.cta} {w.url ? '↗' : '→'}
                </span>
              </RLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Book (3D, turns with scroll) ---------- */

function Book() {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.rs-book',
          { rotateY: -55, rotateX: 10 },
          {
            rotateY: 28,
            rotateX: -4,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
          }
        )
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-28 md:px-8 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rs-accent opacity-[0.12] blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="rs-label mb-6">#1 Amazon bestseller</p>
          <SplitHeading className="rs-display text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.92]">
            Create once. <span className="rs-serif text-rs-accent">Distribute forever.</span>
          </SplitHeading>
          <p className="mt-8 max-w-md text-[18px] leading-relaxed text-white/65">
            The playbook behind every engine Ross has built: make fewer, better things, then get each one in front of every audience that matters.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <RLink path="/book/" className="rs-btn rs-btn-orange">
              Read the book ↗
            </RLink>
            <a href="https://www.audible.ca/pd/B0HGHP1KZ2" target="_blank" rel="noopener noreferrer" className="rs-btn rs-btn-ghost">
              Listen on Audible ↗
            </a>
          </div>
        </div>
        <div className="flex justify-center [perspective:1400px]">
          <Book3D className="rs-book" />
        </div>
      </div>
    </section>
  )
}

/* ---------- Keynotes preview (photo beside the hovered title) ---------- */

function KeynotesPreview() {
  const ref = useRef(null)
  const [img, setImg] = useState(keynotes.talks[0].img)

  const { contextSafe } = useGSAP({ scope: ref })
  const photo = useRef(null)
  const ensure = () => {
    if (!photo.current) {
      const el = ref.current.querySelector('.rs-follow')
      photo.current = { el, on: false, x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' }) }
    }
    return photo.current
  }
  // Line the photo up with the start of the hovered title, above it when
  // there's room on screen and below it otherwise
  const show = contextSafe((row) => {
    const p = ensure()
    if (row) {
      const r = ref.current.getBoundingClientRect()
      const t = row.querySelector('.rs-k-title').getBoundingClientRect()
      const gap = 14
      const above = t.top - p.el.offsetHeight - gap > 90 // clear of the sticky nav
      const x = t.left - r.left
      const y = (above ? t.top - p.el.offsetHeight - gap : t.bottom + gap) - r.top
      if (!p.on || reduce()) gsap.set(p.el, { x, y })
      else (p.x(x), p.y(y))
    }
    p.on = !!row
    gsap.to(p.el, { opacity: row ? 1 : 0, scale: row ? 1 : 0.9, duration: reduce() ? 0 : 0.35, ease: 'power3.out', overwrite: 'auto' })
  })

  return (
    <section ref={ref} className="relative border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rs-label mb-6">Keynote speaker</p>
            <SplitHeading className="rs-display rs-to-baseline text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Talks that leave rooms with a plan.</SplitHeading>
          </div>
          <RLink path="/keynotes/" label="Keynotes" className="rs-btn rs-btn-ghost">
            See all keynotes →
          </RLink>
        </div>
        <ol className="border-t border-white/15" onPointerLeave={() => show(null)}>
          {keynotes.talks.map((t, i) => (
            <li
              key={t.title}
              className="border-b border-white/15"
              onPointerEnter={(e) => (setImg(t.img), show(e.currentTarget))}
              onFocus={(e) => (setImg(t.img), show(e.currentTarget))}
              onBlur={() => show(null)}
            >
              <RLink path="/keynotes/" label="Keynotes" className="group flex items-baseline gap-6 py-6 md:gap-10">
                <span className="rs-mono text-[13px] text-white/35">0{i + 1}</span>
                <span className="rs-k-title rs-display text-[clamp(1.5rem,3.4vw,3rem)] leading-[1.05] text-white/80 transition-colors duration-300 group-hover:text-rs-accent">
                  {t.title}
                </span>
              </RLink>
            </li>
          ))}
        </ol>
      </div>
      <div className="rs-follow pointer-events-none absolute left-0 top-0 z-10 hidden h-[220px] w-[320px] origin-bottom-left overflow-hidden rounded-[6px] opacity-0 md:block" aria-hidden="true">
        <Image src={`${IMG}${img}`} alt="" fill sizes="320px" className="object-cover" />
      </div>
    </section>
  )
}

/* ---------- Podcast + latest writing ---------- */

function Latest() {
  const ref = useRef(null)
  useRise(ref, '.rs-latest')
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="rs-latest relative overflow-hidden rounded-[10px] border border-white/10 bg-[#111] p-8 md:p-10">
          <p className="rs-label mb-6">The podcast</p>
          <h2 className="rs-display text-4xl leading-[1] md:text-5xl">{podcast.name}</h2>
          <p className="mt-4 max-w-sm text-white/60">Getting found, cited and remembered in the AI era. Part of the {podcast.network}.</p>
          <div className="mt-10 flex gap-10">
            <p>
              <span className="rs-display block text-5xl">{podcast.episodes}</span>
              <span className="rs-label">Episodes</span>
            </p>
            <p>
              <span className="rs-display block text-5xl text-rs-accent">{podcast.rating}</span>
              <span className="rs-label">On Apple Podcasts</span>
            </p>
          </div>
          {/* Waveform */}
          <div className="mt-10 flex h-12 items-end gap-[3px]" aria-hidden="true">
            {Array.from({ length: 48 }).map((_, i) => (
              <span key={i} className="rs-wave w-[4px] rounded-full bg-white/25" style={{ height: `${20 + ((i * 47) % 80)}%`, animationDelay: `${(i % 12) * -0.1}s` }} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Apple's official badge, at button height */}
            <a href={podcast.apple} target="_blank" rel="noopener noreferrer" className="focus-ring rounded-[8px] transition-transform duration-300 hover:-translate-y-px">
              <Image src="/work/ross-simmonds/logos/apple-podcasts.svg" alt="Listen on Apple Podcasts" width={126} height={40} unoptimized className="h-10 w-auto" />
            </a>
            <RLink path="/podcast/" className="rs-btn rs-btn-ghost">
              All episodes ↗
            </RLink>
          </div>
        </div>
        <div className="rs-latest">
          <div className="mb-6 flex items-end justify-between">
            <p className="rs-label">Latest writing</p>
            <RLink path="/blog/" label="The Blog" className="rs-mono text-[12px] uppercase tracking-[0.14em] text-white/60 hover:text-rs-accent">
              All articles →
            </RLink>
          </div>
          <ul className="border-t border-white/15">
            {posts.slice(0, 4).map((p) => (
              <li key={p.slug} className="border-b border-white/15">
                <RLink path={`/blog/${p.slug}/`} label={p.title} className="group block py-6">
                  <span className="rs-label">{p.cats[0]} · {formatDate(p.date)}</span>
                  <span className="rs-display mt-2 block text-[clamp(1.3rem,2.2vw,1.9rem)] leading-[1.15] transition-colors group-hover:text-rs-accent">
                    {p.title}
                  </span>
                </RLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Distribution />
      <Press />
      <Shoutouts />
      <WaysIn />
      <Book />
      <KeynotesPreview />
      <Latest />
      <Endorsers />
      <Newsletter />
    </>
  )
}
