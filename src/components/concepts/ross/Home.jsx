'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import Book3D from './Book3D'
import { Count, Endorsers, Newsletter, SplitHeading, reduce, useRise } from './shared'
import { channels, featuredIn, formatDate, keynotes, podcast, posts, proof, waysIn } from './data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

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
    <section ref={ref} className="relative overflow-hidden px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
      <div className="mx-auto grid max-w-[1400px] items-end gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="rs-label rs-hero-fade mb-8">Marketer · Speaker · Founder · Author</p>
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

      <dl className="mx-auto mt-16 grid max-w-[1400px] grid-cols-2 gap-y-8 border-t border-white/10 pt-8 md:grid-cols-4">
        {proof.map((p) => (
          <div key={p.label} className="rs-hero-fade flex flex-col-reverse">
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

      {/* Phones and tablets: the result, as a grid */}
      <div className="px-5 py-20 md:px-8 lg:hidden">
        <h2 className="rs-display text-[clamp(2.6rem,9vw,4rem)] leading-[1]">
          Create once. <span className="text-rs-accent">Distribute forever.</span>
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {channels.slice(0, 12).map((c) => (
            <li key={c} className="rs-mono rounded-[10px] border border-white/15 bg-[#151515] px-4 py-4 text-[11px] uppercase tracking-[0.1em] text-white/75">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Press ---------- */

function Press() {
  return (
    <section className="overflow-hidden border-t border-white/10 py-10" aria-label="Featured in">
      <div className="rs-marquee flex w-max gap-20">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-20" aria-hidden={k === 1}>
            {[...featuredIn, ...featuredIn].map((f, i) => (
              <span key={i} className="rs-display text-[clamp(1.8rem,3.4vw,3rem)] text-white/30">
                {f}
              </span>
            ))}
          </div>
        ))}
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
          <p className="rs-label mb-6">The book · #1 Amazon bestseller</p>
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

/* ---------- Keynotes preview (photo follows the cursor) ---------- */

function KeynotesPreview() {
  const ref = useRef(null)
  const [img, setImg] = useState(keynotes.talks[0].img)

  const { contextSafe } = useGSAP({ scope: ref })
  const follow = useRef(null)
  const ensure = () => {
    if (!follow.current) {
      const el = ref.current.querySelector('.rs-follow')
      follow.current = { el, x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' }) }
    }
    return follow.current
  }
  const onMove = contextSafe((e) => {
    if (reduce()) return
    const f = ensure()
    const r = ref.current.getBoundingClientRect()
    f.x(e.clientX - r.left - 160)
    f.y(e.clientY - r.top - 110)
  })
  const show = contextSafe((on) => {
    if (reduce()) return
    gsap.to(ensure().el, { opacity: on ? 1 : 0, scale: on ? 1 : 0.85, duration: 0.4, ease: 'power3.out' })
  })

  return (
    <section ref={ref} onPointerMove={onMove} onPointerLeave={() => show(false)} className="relative border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rs-label mb-6">Keynote speaker</p>
            <SplitHeading className="rs-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Talks that leave rooms with a plan.</SplitHeading>
          </div>
          <RLink path="/keynotes/" label="Keynotes" className="rs-btn rs-btn-ghost">
            See all keynotes →
          </RLink>
        </div>
        <ol className="border-t border-white/15" onPointerEnter={() => show(true)}>
          {keynotes.talks.map((t, i) => (
            <li key={t.title} className="border-b border-white/15" onPointerEnter={() => setImg(t.img)}>
              <RLink path="/keynotes/" label="Keynotes" className="group flex items-baseline gap-6 py-6 md:gap-10">
                <span className="rs-mono text-[13px] text-white/35">0{i + 1}</span>
                <span className="rs-display text-[clamp(1.5rem,3.4vw,3rem)] leading-[1.05] text-white/80 transition-colors duration-300 group-hover:text-rs-accent">
                  {t.title}
                </span>
              </RLink>
            </li>
          ))}
        </ol>
      </div>
      <div className="rs-follow pointer-events-none absolute left-0 top-0 z-10 hidden h-[220px] w-[320px] overflow-hidden rounded-[6px] opacity-0 md:block" aria-hidden="true">
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
              <span className="rs-label">On Apple</span>
            </p>
          </div>
          {/* Waveform */}
          <div className="mt-10 flex h-12 items-end gap-[3px]" aria-hidden="true">
            {Array.from({ length: 48 }).map((_, i) => (
              <span key={i} className="rs-wave w-[4px] rounded-full bg-white/25" style={{ height: `${20 + ((i * 47) % 80)}%`, animationDelay: `${(i % 12) * -0.1}s` }} />
            ))}
          </div>
          <RLink path="/podcast/" className="rs-btn rs-btn-ghost mt-8">
            Listen ↗
          </RLink>
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
      <WaysIn />
      <Book />
      <KeynotesPreview />
      <Latest />
      <Endorsers />
      <Newsletter />
    </>
  )
}
