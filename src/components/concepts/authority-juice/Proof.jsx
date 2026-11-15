'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowIcon, EXTERNAL } from './ui'
import { press, stats, statsLink } from './content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Drips hanging off the bottom of the orange section: x (0–1440), neck width, length
// Kept short enough that the longest bulb clears the next section's heading
const DRIPS = [
  [60, 22, 44],
  [210, 32, 80],
  [330, 18, 38],
  [520, 28, 66],
  [700, 38, 100],
  [880, 20, 50],
  [1010, 30, 86],
  [1180, 22, 56],
  [1330, 34, 74],
]
// The longest drips let go of a drop now and then
const FALLS = 74

/**
 * One drip as a single liquid outline: it leaves the section's edge through a
 * rounded joint, thins as it pulls down, and gathers into a heavy bulb at the
 * end. `length` is where the bulb's centre sits. The outline starts a little
 * above the edge so it fuses with the section.
 */
function dripPath(x, w, length) {
  const r = w * 0.75 // bulb
  const f = w * 0.6 // the joint's curve
  const n = w * 0.42 // half the neck, at its thinnest
  const L = Math.max(length, minLength(w))
  const neck = L - r * 1.6
  return [
    `M${x - w / 2 - f},-10 L${x - w / 2 - f},0`,
    `C${x - w / 2},0 ${x - w / 2},${f * 0.6} ${x - w / 2},${f}`,
    `L${x - n},${neck}`,
    `C${x - n},${L - r * 0.9} ${x - r},${L - r * 0.9} ${x - r},${L}`,
    `A${r} ${r} 0 0 0 ${x + r},${L}`,
    `C${x + r},${L - r * 0.9} ${x + n},${L - r * 0.9} ${x + n},${neck}`,
    `L${x + w / 2},${f}`,
    `C${x + w / 2},${f * 0.6} ${x + w / 2},0 ${x + w / 2 + f},0`,
    `L${x + w / 2 + f},-10 Z`,
  ].join(' ')
}
// Shortest a drip can be: a bead just forming under the edge
const minLength = (w) => w * 0.6 + w * 0.75 * 1.6 + 2

/**
 * Results on orange — the juice from the hero. Each giant numeral fills up
 * from the bottom like a glass as it scrolls in, counting as it goes. Then
 * the press logos run along two crossing tapes, and the section drips into
 * the next one.
 */
export default function Proof() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.aj-stat-row').forEach((row) => {
          const target = Number(row.dataset.value)
          const vals = row.querySelectorAll('.aj-num-val')
          const counter = { v: 0 }
          const render = () => vals.forEach((el) => (el.textContent = Math.round(counter.v)))
          const st = { trigger: row, start: 'top 88%', end: 'top 30%', scrub: 0.6 }
          gsap
            .timeline({ scrollTrigger: st })
            .fromTo(row.querySelector('.aj-num-fill'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
            .fromTo(counter, { v: 0 }, { v: target, ease: 'power1.out', onUpdate: render }, 0)
            .from(row.querySelector('.aj-num'), { xPercent: -8, ease: 'none' }, 0)
          gsap.from(row.querySelectorAll('.aj-stat-copy > *'), {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: row, start: 'top 70%', once: true },
          })
          gsap.from(row.querySelector('.aj-stat-rule'), { scaleX: 0, transformOrigin: '0 50%', ease: 'none', scrollTrigger: { ...st } })
        })

        // Tapes run in opposite directions
        gsap.to('.aj-tape-a', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 })
        gsap.fromTo('.aj-tape-b', { xPercent: -50 }, { xPercent: 0, duration: 36, ease: 'none', repeat: -1 })

        // Drips start as beads under the edge and stretch as the section leaves.
        // Each outline is redrawn from its length; the shine rides the bulb
        gsap.utils.toArray('.aj-drip').forEach((drip) => {
          const [x, w, length] = DRIPS[Number(drip.dataset.i)]
          const body = drip.querySelector('.aj-drip-body')
          const shine = drip.querySelector('.aj-drip-shine')
          const drop = drip.querySelector('.aj-drip-drop')
          const state = { l: minLength(w) }
          const draw = () => {
            body.setAttribute('d', dripPath(x, w, state.l))
            shine.setAttribute('cy', state.l - w * 0.2)
          }
          draw()
          gsap.to(state, {
            l: length,
            ease: 'none',
            onUpdate: draw,
            scrollTrigger: { trigger: ref.current, start: 'bottom 95%', end: 'bottom 20%', scrub: true },
          })
          // A drop swells at the tip, lets go and falls away, from wherever the bulb is now
          if (drop) {
            const r = w * 0.75
            gsap
              .timeline({ repeat: -1, repeatDelay: 1.6 + (x % 7) * 0.4, delay: (x % 5) * 0.7, repeatRefresh: true })
              .fromTo(drop, { attr: { cy: () => state.l + r * 0.55, ry: 0 }, opacity: 1 }, { attr: { ry: w * 0.32 }, duration: 0.5, ease: 'power1.in' })
              // A short fall, gone before it reaches the heading below
              .to(drop, { attr: { cy: () => state.l + r + 22 }, opacity: 0, duration: 0.4, ease: 'power2.in' })
          }
        })
      })
    },
    { scope: ref }
  )

  const logos = [...press.logos, ...press.logos]
  const Tape = ({ className, track }) => (
    <div className={`absolute left-[-10%] w-[120%] overflow-hidden py-5 ${className}`}>
      <ul className={`${track} flex w-max items-center gap-16`}>
        {logos.map((logo, i) => (
          <li key={i} className="relative h-9 w-[140px] shrink-0">
            <Image src={logo.src} alt="" fill sizes="140px" className="object-contain" />
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section ref={ref} className="relative z-10 bg-[#ff6612] text-[#1a1a1a]">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-16 md:px-8 md:pt-24">
        {stats.map((stat) => (
          <article key={stat.title} data-value={stat.value} className="aj-stat-row relative grid items-end gap-6 py-10 md:grid-cols-[1.3fr_1fr] md:gap-12 md:py-14">
            <span aria-hidden="true" className="aj-stat-rule absolute inset-x-0 top-0 h-[2px] bg-[#1a1a1a]/20" />
            {/* Outline numeral with a solid copy on top, clipped from the bottom up */}
            <p className="aj-num relative font-aj-tight text-[28vw] font-bold leading-[0.8] tracking-[-0.06em] md:text-[15vw] lg:text-[13.5rem]">
              <span className="block" style={{ WebkitTextStroke: '2px #1a1a1a', color: 'transparent' }} aria-hidden="true">
                {stat.prefix}
                <span className="aj-num-val">{stat.value}</span>
                {stat.suffix}
              </span>
              <span className="aj-num-fill absolute inset-0 block">
                {stat.prefix}
                <span className="aj-num-val">{stat.value}</span>
                {stat.suffix}
              </span>
            </p>
            <div className="aj-stat-copy pb-2">
              <h3 className="mb-3 font-display text-[2.2rem] leading-none tracking-[-0.01em] md:text-[2.7rem]">{stat.title}</h3>
              <p className="mb-6 max-w-[38ch] text-[15px] font-medium leading-relaxed text-[#1a1a1a]/75">{stat.text}</p>
              <a
                href={stat.href}
                {...EXTERNAL}
                className="focus-ring group inline-flex items-center gap-3 rounded-full bg-[#1a1a1a] py-2 pl-5 pr-2 font-display text-lg text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                {statsLink}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6612] transition-transform duration-300 group-hover:-rotate-45">
                  <ArrowIcon size={15} />
                </span>
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Featured in — two crossing tapes */}
      <div className="px-5 pt-10 md:px-8">
        <h2 className="mx-auto max-w-[1240px] font-display text-[2.6rem] leading-[1] tracking-[-0.02em] md:text-[3.6rem]">
          {press.heading.map((part, i) => (
            <span key={i} className={part.accent ? 'italic text-white' : ''}>
              {part.text}{' '}
            </span>
          ))}
        </h2>
        <p className="sr-only">{press.logos.map((l) => l.name).join(', ')}</p>
      </div>
      <div aria-hidden="true" className="relative h-[260px] overflow-hidden md:h-[300px]">
        <Tape track="aj-tape-b" className="top-[38%] -rotate-[4deg] bg-[#2a2a2a] opacity-80" />
        <Tape track="aj-tape-a" className="top-[34%] rotate-[3deg] bg-[#1a1a1a] shadow-[0_20px_50px_-10px_rgb(0_0_0/0.5)]" />
      </div>

      {/* Drips into the next section. Scaled evenly (cropped at the sides on
          phones) so the bulbs stay round; drops can fall past the box */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 200"
        preserveAspectRatio="xMidYMin slice"
        className="pointer-events-none absolute left-0 top-full w-full overflow-visible"
        style={{ height: 'clamp(120px, 13.9vw, 220px)' }}
      >
        {DRIPS.map(([x, w, length], i) => (
          <g key={x} className="aj-drip" data-i={i}>
            <path className="aj-drip-body" d={dripPath(x, w, length)} fill="#ff6612" />
            {/* Light catching the bulb */}
            <ellipse className="aj-drip-shine" cx={x - w * 0.28} cy={length - w * 0.2} rx={w * 0.13} ry={w * 0.22} fill="#fff" opacity="0.35" />
            {length >= FALLS && <ellipse className="aj-drip-drop" cx={x} cy={length} rx={w * 0.26} ry="0" fill="#ff6612" />}
          </g>
        ))}
      </svg>
    </section>
  )
}
