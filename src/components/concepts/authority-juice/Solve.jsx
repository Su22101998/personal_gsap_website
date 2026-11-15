'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Tag } from './ui'
import { gain, pain } from './content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
 * "The hidden costs…" → "…when things just work" as one deck of five cards.
 * Each hidden cost (monochrome) turns over to the outcome that replaces it
 * (colour) — their copy pairs up one to one:
 *   paid ads band-aid → organic that lowers CAC
 *   ghost mode → founders as category leaders
 *   SEO slot machine → strategy you can measure
 *   content factory → content that compounds
 *   lost market share → visibility that wins deals
 *
 * Desktop: pinned; the cards are dealt, the headline swaps, then they flip
 * one by one as you scroll (and tilt toward the cursor). Smaller screens:
 * each card flips as it reaches the middle of the screen, or on tap.
 */
const FLIP_ALWAYS = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

/* ── Fronts ──────────────────────────────────────── */
function GhostPost() {
  const p = pain.ghostPost
  return (
    <div className="w-[150px] rounded-lg bg-white p-2 text-left text-[#1a1a1a] shadow-xl">
      <p className="mb-0.5 text-[6px] uppercase tracking-wider text-black/40">{p.context}</p>
      <p className="mb-1.5 text-[9px] font-semibold leading-tight">{p.heading}</p>
      <p className="mb-1 rounded border border-dashed border-black/20 py-0.5 text-center text-[6px] uppercase text-black/50">{p.coupon}</p>
      <p className="mb-0.5 rounded bg-[#1a1a1a] py-1 text-center text-[6.5px] font-semibold uppercase text-white">{p.button}</p>
      <p className="text-center text-[6px] text-black/40">{p.caption}</p>
    </div>
  )
}

function Front({ card }) {
  return (
    <>
      <Tag>{card.tag}</Tag>
      <p className="mt-3 text-[15px] font-semibold leading-snug">{card.text}</p>
      <div className="relative mt-auto flex h-[46%] w-full items-end justify-center">
        {card.ghost ? (
          <>
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <GhostPost />
            </div>
            <div className="aj-ghost relative ml-[45%] h-[78px] w-[78px]">
              <Image src={card.img} alt="" fill sizes="78px" className="object-contain" />
            </div>
          </>
        ) : (
          <div className="relative h-full w-full">
            <Image src={card.img} alt="" fill sizes="240px" className="object-contain object-bottom" />
          </div>
        )}
      </div>
    </>
  )
}

/* ── Backs ───────────────────────────────────────── */
const CHART = 'M0 150 C 40 140, 70 120, 100 126 S 150 150, 180 112 S 240 60, 270 74 S 330 30, 360 8'

function BackVisual({ kind }) {
  if (kind === 'cac') {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        {[0, 1, 2].map((i) => (
          <span key={i} className="aj-cac-ring absolute h-24 w-24 rounded-full border-2 border-[#ff6612]" />
        ))}
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6612] text-xl font-bold">↓</span>
      </div>
    )
  }
  if (kind === 'leaders') {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex -space-x-2.5">
          {gain.leaders.avatars.map((src) => (
            <span key={src} className="relative h-11 w-11 overflow-hidden rounded-full ring-[3px] ring-[#2a2018]">
              <Image src={src} alt="" fill sizes="44px" className="object-cover" />
            </span>
          ))}
        </div>
        <Image src={gain.leaders.badge} alt="LinkedIn Top Voice" width={96} height={26} className="-mt-2 drop-shadow-lg" />
      </div>
    )
  }
  if (kind === 'strategy') {
    return (
      <div className="relative h-full w-full">
        <div className="absolute bottom-6 left-[8%] h-[70%] w-[46%] rounded-lg border border-dashed border-white/25" />
        <div className="aj-click absolute left-[18%] top-[18%] flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a] text-base shadow-lg">👆</div>
        <div className="absolute bottom-0 right-[6%] w-[60%] rounded-lg bg-[#d9d9d9] p-2 shadow-2xl">
          <div className="mb-1.5 h-2 w-1/2 rounded-full bg-[#1a1a1a]" />
          <div className="mb-2 h-4 rounded bg-white" />
          <div className="flex gap-1.5">
            <div className="h-4 flex-1 rounded bg-white" />
            <div className="aj-cta h-4 flex-1 rounded bg-[#ff6612]" />
          </div>
        </div>
      </div>
    )
  }
  if (kind === 'compounds') {
    const c = gain.compounds
    return (
      <div className="relative h-full w-full">
        <svg aria-hidden="true" viewBox="0 0 360 160" preserveAspectRatio="none" className="absolute inset-x-[-20px] bottom-[-20px] h-[80%] w-[calc(100%+40px)]">
          <defs>
            <linearGradient id="aj-compound-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff6612" stopOpacity="0.85" />
              <stop offset="1" stopColor="#ff6612" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path className="aj-compound-area" d={`${CHART} L 360 160 L 0 160 Z`} fill="url(#aj-compound-fill)" />
          <path className="aj-compound-line" d={CHART} fill="none" stroke="#ff8a47" strokeWidth="3" />
        </svg>
        <div className="relative mx-auto w-fit rounded-lg border border-white/20 bg-[#3c322d]/80 px-3 py-2 text-left backdrop-blur">
          <p className="text-[9px] text-white/60">{c.date}</p>
          <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums">
            <span className="aj-compound-value" data-value={c.value}>
              {c.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="rounded bg-[#1f3a24] px-1 text-[9px] text-[#5ee07a]">{c.change}</span>
          </p>
        </div>
      </div>
    )
  }
  // deals
  return (
    <div className="relative h-full w-full">
      <Image src={gain.deals.img} alt="" fill sizes="140px" className="object-contain object-bottom" />
    </div>
  )
}

const BACKS = [
  { kind: 'cac', tag: gain.cac.tag, text: gain.cac.text },
  { kind: 'leaders', tag: gain.leaders.tag, text: [gain.leaders.text] },
  { kind: 'strategy', tag: gain.strategy.tag, text: [gain.strategy.text] },
  { kind: 'compounds', tag: gain.compounds.tag, text: [gain.compounds.text] },
  { kind: 'deals', tag: gain.deals.tag, text: [gain.deals.text] },
]

function Back({ back }) {
  return (
    <>
      <Tag style={{ borderColor: 'rgb(255 102 18 / 0.7)', color: '#fff' }}>{back.tag}</Tag>
      {back.text.map((t) => (
        <p key={t} className="mt-3 text-[14.5px] font-semibold leading-snug">
          {t}
        </p>
      ))}
      <div className="relative mt-auto h-[42%] w-full">
        <BackVisual kind={back.kind} />
      </div>
    </>
  )
}

/* ── Section ─────────────────────────────────────── */
function Heading({ title, sub, className = '' }) {
  return (
    <div className={`mx-auto max-w-4xl text-center ${className}`}>
      <h2 className="font-display text-[2.5rem] leading-[1] tracking-[-0.02em] md:text-6xl lg:text-[3.6rem]">{title}</h2>
      <p className="mt-4 text-base md:text-lg" style={{ color: 'var(--aj-muted)' }}>
        {sub}
      </p>
    </div>
  )
}

export default function Solve() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const flips = gsap.utils.toArray('.aj-flip')

      // The compounding chart draws and its value ticks up — once, when its card turns
      const makeChart = () => {
        const line = ref.current.querySelector('.aj-compound-line')
        const length = line.getTotalLength()
        const valueEl = ref.current.querySelector('.aj-compound-value')
        const target = Number(valueEl.dataset.value)
        const counter = { v: target * 0.6 }
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
        gsap.set('.aj-compound-area', { clipPath: 'inset(0 100% 0 0)' })
        return gsap
          .timeline({ paused: true })
          .to(line, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' })
          .to('.aj-compound-area', { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'power2.inOut' }, 0)
          .to(counter, {
            v: target,
            duration: 1.4,
            ease: 'power3.out',
            onUpdate: () => {
              valueEl.textContent = counter.v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            },
          }, 0.2)
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.aj-ghost', { y: -8, x: 4, rotate: 5, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true })
        gsap.utils.toArray('.aj-cac-ring').forEach((ring, i) => {
          gsap.fromTo(ring, { scale: 0.6, opacity: 0.9 }, { scale: 2, opacity: 0, duration: 3, ease: 'power1.out', repeat: -1, delay: i })
        })
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.2 })
          .to('.aj-click', { scale: 0.82, duration: 0.15, ease: 'power2.in' })
          .to('.aj-click', { scale: 1, duration: 0.4, ease: 'back.out(3)' })
          .fromTo('.aj-cta', { boxShadow: '0 0 0 0 rgb(255 102 18 / 0.8)' }, { boxShadow: '0 0 0 10px rgb(255 102 18 / 0)', duration: 0.9 }, '<')
      })

      mm.add(FLIP_ALWAYS, () => {
        const chart = makeChart()
        gsap.set('.aj-h-gain-after', { display: 'none' })
        gsap.set('.aj-h-gain', { display: 'block', autoAlpha: 0, y: 40 })
        // Resting fan
        gsap.set('.aj-deal', { y: (i) => Math.abs(i - 2) * 18, rotate: (i) => (i - 2) * 3 })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${window.innerHeight * 3.4}`, pin: true, scrub: 0.7 },
        })
        tl.from('.aj-deal', { x: (i) => (2 - i) * 250, y: 220, rotate: (i) => (2 - i) * 10, opacity: 0, duration: 1, stagger: 0.06, ease: 'power3.out' })
          .to({}, { duration: 0.4 })
          .to('.aj-h-pain', { autoAlpha: 0, y: -40, duration: 0.5 })
          .to('.aj-h-gain', { autoAlpha: 1, y: 0, duration: 0.5 }, '<0.25')
        flips.forEach((flip, i) => {
          tl.to(flip, { rotateY: 180, duration: 1 }, i === 0 ? '<' : '-=0.55')
          // Each card lifts as it turns
          tl.to(flip.closest('.aj-deal'), { y: '-=24', duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<')
          if (i === 3) tl.call(() => chart.play(), null, '<0.6')
        })
        tl.to({}, { duration: 0.5 })

        // Cards tilt toward the cursor
        const cleanups = gsap.utils.toArray('.aj-tilt').map((el) => {
          const rx = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power3.out' })
          const ry = gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power3.out' })
          const move = (e) => {
            const r = el.getBoundingClientRect()
            ry(((e.clientX - r.left) / r.width - 0.5) * 18)
            rx(-((e.clientY - r.top) / r.height - 0.5) * 14)
          }
          const leave = () => {
            rx(0)
            ry(0)
          }
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          return () => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          }
        })
        return () => cleanups.forEach((fn) => fn())
      })

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const chart = makeChart()
        flips.forEach((flip, i) => {
          gsap.to(flip, {
            rotateY: 180,
            duration: 0.9,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: flip, start: 'top 40%', toggleActions: 'play none none reverse', onEnter: i === 3 ? () => chart.play() : undefined },
          })
        })
      })
    },
    { scope: ref }
  )

  // Tap / Enter to turn a card (not while the scroll drives the deck)
  const toggle = (e) => {
    if (window.matchMedia(FLIP_ALWAYS).matches) return
    const flip = e.currentTarget.querySelector('.aj-flip')
    const turned = gsap.getProperty(flip, 'rotateY') > 90
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.to(flip, { rotateY: turned ? 0 : 180, duration: reduce ? 0 : 0.8, ease: 'power2.inOut', overwrite: true })
  }

  return (
    <section ref={ref} id="aj-solve" className="relative overflow-hidden px-5 py-28 md:px-8 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="relative mx-auto mb-14 w-full max-w-4xl lg:mb-10">
        <Heading title={pain.heading} sub={pain.sub} className="aj-h-pain" />
        {/* Desktop: swaps in over the first heading */}
        <Heading title={gain.heading} sub={gain.sub} className="aj-h-gain absolute inset-x-0 top-0 hidden" />
      </div>

      <ul className="mx-auto grid w-full max-w-[1240px] gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        {pain.cards.map((card, i) => (
          <li key={card.tag} className="aj-deal" style={{ perspective: '1200px' }}>
            <div
              className="aj-tilt cursor-pointer [transform-style:preserve-3d]"
              role="button"
              tabIndex={0}
              aria-label={`${card.tag}: ${card.text} — turn to see ${BACKS[i].tag}`}
              onClick={toggle}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(e))}
            >
              <div className="aj-flip relative aspect-[4/5] [transform-style:preserve-3d] lg:aspect-[3/5]">
                <div className="absolute inset-0 flex flex-col items-center overflow-hidden rounded-[22px] border p-5 text-center [backface-visibility:hidden]" style={{ background: '#212121', borderColor: 'var(--aj-line)' }}>
                  <Front card={card} />
                </div>
                <div
                  className="absolute inset-0 flex flex-col items-center overflow-hidden rounded-[22px] border p-5 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  style={{ background: 'radial-gradient(120% 70% at 50% 100%, rgb(255 102 18 / 0.45), transparent 70%), #261d17', borderColor: 'rgb(255 102 18 / 0.45)' }}
                >
                  <Back back={BACKS[i]} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Smaller screens / reduced motion: the second heading closes the deck */}
      <Heading title={gain.heading} sub={gain.sub} className="aj-h-gain-after mt-16" />
    </section>
  )
}
