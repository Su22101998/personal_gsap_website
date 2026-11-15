'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { useGSAP } from '@gsap/react'
import AnimatedCounter from '@/components/AnimatedCounter'
import { BookCallPill, Card, SectionHeading } from './ui'
import { testimonials as t } from './content'

gsap.registerPlugin(ScrollTrigger, Draggable, useGSAP)

const AUTOPLAY_MS = 7000
const THROW_AT = 110 // px of drag that sends a card away
const count = t.quotes.length

const Star = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M12 2l3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.7l1.8-7.3L1.5 9.5 9 8.9z" />
  </svg>
)

const Chevron = ({ dir }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
)

// Resting pose of a card `slot` places from the top of the stack
const pose = (slot) => ({
  x: 0,
  y: slot * 18,
  scale: 1 - slot * 0.05,
  rotate: slot === 0 ? 0 : (slot % 2 ? 1 : -1) * (1.5 + slot),
  opacity: slot > 3 ? 0 : 1,
  zIndex: count - slot,
})

/**
 * "When strategy meets execution" — stats column + a stack of quote cards.
 * Drag (or flick) the top card away to see the next; the arrows and dots
 * do the same. Autoplays until the visitor interacts.
 */
export default function Testimonials() {
  const ref = useRef(null)
  const cardsRef = useRef([])
  const dragRef = useRef(null)
  const busy = useRef(false)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Send the top card off-screen, then advance
  const throwCard = (dir = 1) => {
    if (busy.current) return
    busy.current = true
    const top = cardsRef.current[index]
    gsap.to(top, {
      x: dir * 760,
      rotate: dir * 28,
      opacity: 0,
      duration: reduce() ? 0 : 0.45,
      ease: 'power2.in',
      onComplete: () => {
        busy.current = false
        setIndex((i) => (i + 1) % count)
      },
    })
  }

  const back = () => {
    if (busy.current) return
    const prev = (index - 1 + count) % count
    // The previous card swoops back in from the left
    gsap.set(cardsRef.current[prev], { x: -600, rotate: -24, opacity: 0, zIndex: count + 1 })
    setIndex(prev)
  }

  const goTo = (i) => {
    if (i !== index && !busy.current) setIndex(i)
  }

  // Re-stack around the current card; make the top one draggable
  useGSAP(
    () => {
      cardsRef.current.forEach((card, i) => {
        const slot = (i - index + count) % count
        gsap.to(card, { ...pose(slot), duration: reduce() ? 0 : 0.7, ease: 'power3.out', overwrite: true })
      })

      dragRef.current?.kill()
      const top = cardsRef.current[index]
      dragRef.current = Draggable.create(top, {
        type: 'x',
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress: () => setPaused(true),
        onDrag() {
          gsap.set(top, { rotate: this.x / 18 })
        },
        onRelease() {
          if (Math.abs(this.x) > THROW_AT) throwCard(this.x > 0 ? 1 : -1)
          else gsap.to(top, { x: 0, rotate: 0, duration: 0.6, ease: 'back.out(2)' })
        },
      })[0]
    },
    { scope: ref, dependencies: [index] }
  )

  useEffect(() => () => dragRef.current?.kill(), [])

  // Autoplay
  useEffect(() => {
    if (paused || reduce()) return
    const id = setTimeout(() => throwCard(1), AUTOPLAY_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.aj-proof-col > *', { x: -50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.aj-proof-grid', start: 'top 80%', once: true } })
        gsap.from('.aj-stack', { y: 120, rotate: 6, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.aj-proof-grid', start: 'top 80%', once: true } })
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} id="aj-results" className="overflow-hidden px-5 py-24 md:px-8 md:py-32">
      <SectionHeading title={t.heading} sub={t.sub} />

      <div className="aj-proof-grid mx-auto grid max-w-[980px] items-start gap-6 md:grid-cols-[0.62fr_1.38fr] md:gap-8">
        <div className="aj-proof-col grid gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-aj-tight text-5xl font-bold tracking-[-0.04em]">
                <AnimatedCounter value={t.clients.value} suffix={t.clients.suffix} />
              </p>
              <span className="flex -space-x-2">
                {t.clients.avatars.map((src) => (
                  <span key={src} className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#212121]">
                    <Image src={src} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                ))}
              </span>
            </div>
            <p className="mt-1 text-sm" style={{ color: 'var(--aj-muted)' }}>
              {t.clients.label}
            </p>
          </Card>

          <Card className="p-5" style={{ background: 'linear-gradient(200deg, #212121 35%, #a2400a 120%)' }}>
            <p className="text-[15px] font-medium leading-snug">{t.roi.lead}</p>
            <p className="mt-8 font-aj-tight text-6xl font-bold tracking-[-0.04em]">
              <AnimatedCounter value={t.roi.value} suffix={t.roi.suffix} />
            </p>
            <p className="mt-1 text-sm">{t.roi.label}</p>
          </Card>

          <Card className="flex items-center gap-3 p-5" glow={false}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6612]" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#ff6612]" />
            </span>
            <p className="text-sm">{t.booking}</p>
          </Card>
        </div>

        <div onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}>
          <div className="aj-stack relative h-[500px] select-none sm:h-[440px]" aria-live="polite">
            {t.quotes.map((q, i) => {
              const slot = (i - index + count) % count
              const isTop = slot === 0
              return (
                <figure
                  key={q.name}
                  ref={(el) => {
                    cardsRef.current[i] = el
                  }}
                  aria-hidden={!isTop}
                  className="absolute inset-0 flex origin-bottom flex-col overflow-hidden rounded-[26px] p-7 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] md:p-9"
                  style={{
                    background: `linear-gradient(150deg, hsl(${22 + i * 2} 100% 59%), #ff6612 50%, hsl(${18 - i} 100% 45%))`,
                    // Initial stack only (index 0) — never changes, so React won't fight GSAP's transforms
                    transform: `translateY(${i * 18}px) scale(${1 - i * 0.05})`,
                    zIndex: count - i,
                  }}
                >
                  <svg aria-hidden="true" viewBox="0 0 100 200" className="pointer-events-none absolute -right-10 top-0 h-full opacity-[0.12]" fill="#fff">
                    <path d="M0 0h40l60 100-60 100H0l60-100z" />
                  </svg>
                  <span aria-hidden="true" className="font-display text-7xl leading-none text-white/40">
                    “
                  </span>
                  <blockquote className="relative -mt-4 flex-1 text-[1.15rem] font-medium leading-[1.42] md:text-[1.35rem]">{q.quote}</blockquote>
                  <figcaption className="relative mt-6 flex items-center gap-4">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/40">
                      <Image src={q.img} alt="" fill sizes="56px" className="object-cover" draggable={false} />
                    </span>
                    <span>
                      <span className="block font-semibold">{q.name}</span>
                      <span className="block max-w-[30ch] text-[13px] text-white/80">{q.role}</span>
                      <span className="mt-1 flex gap-0.5" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star key={k} />
                        ))}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>

          <div className="mt-14 flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--aj-subtle)' }}>
              Drag the card ↔
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={back} aria-label="Previous testimonial" className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:border-[#ff6612] hover:bg-[#ff6612]" style={{ borderColor: 'var(--aj-line)' }}>
                <Chevron dir="prev" />
              </button>
              <div className="flex gap-1.5">
                {t.quotes.map((q, i) => (
                  <button
                    key={q.name}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                    className="focus-ring h-2 rounded-full transition-all duration-500"
                    style={{ width: i === index ? 22 : 8, background: i === index ? '#ff6612' : 'rgb(255 255 255 / 0.3)' }}
                  />
                ))}
              </div>
              <button type="button" onClick={() => throwCard(1)} aria-label="Next testimonial" className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:border-[#ff6612] hover:bg-[#ff6612]" style={{ borderColor: 'var(--aj-line)' }}>
                <Chevron dir="next" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 text-center">
        <BookCallPill />
      </div>
    </section>
  )
}
