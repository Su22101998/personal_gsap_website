'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { onIntroDone } from '@/lib/intro'
import { BookCallPill } from './ui'
import { toChars } from './motion'
import { hero } from './content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
 * Hero — after the "add personality to your animations" moment on gsap.com.
 * The headline is one huge line that travels sideways as you scroll (pinned,
 * desktop); every word arrives with its own character as it enters:
 *   Grow     grows up from the baseline
 *   organic. bounces in letter by letter, underline draws
 *   Spend    skids in from the right
 *   less     shrinks down from giant
 *   on       swings up into place
 *   paid.    drops in — then gets struck through and dimmed
 * A giant outlined "organic" drifts behind at its own pace. When the line
 * has passed, the orange juice rises and hands over to the results.
 *
 * Smaller screens: the headline wraps and the same entrances play once on load.
 */
const WORD_KEYS = ['grow', 'organic', 'spend', 'less', 'on', 'paid']

// Each word's arrival: [from, to] for its characters
const ARRIVALS = {
  grow: [{ scaleY: 0.05, yPercent: 30, opacity: 0, transformOrigin: '50% 100%' }, { scaleY: 1, yPercent: 0, opacity: 1, ease: 'elastic.out(1, 0.45)', stagger: 0.06 }],
  organic: [
    { yPercent: (i) => (i % 2 ? -130 : 130), rotate: (i) => (i % 2 ? 24 : -24), opacity: 0 },
    { yPercent: 0, rotate: 0, opacity: 1, ease: 'back.out(2.2)', stagger: 0.05 },
  ],
  spend: [{ xPercent: 260, skewX: -35, opacity: 0 }, { xPercent: 0, skewX: 0, opacity: 1, ease: 'power4.out', stagger: 0.05 }],
  less: [{ scale: 3.2, opacity: 0, transformOrigin: '50% 60%' }, { scale: 1, opacity: 1, ease: 'expo.out', stagger: 0.05 }],
  on: [{ rotate: -100, yPercent: 60, opacity: 0, transformOrigin: '0% 100%' }, { rotate: 0, yPercent: 0, opacity: 1, ease: 'back.out(1.8)', stagger: 0.06 }],
  paid: [{ yPercent: -160, rotate: (i) => (i - 2) * 12, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, ease: 'bounce.out', stagger: 0.07 }],
}

// One wave period is 360 units; the path is two screen-widths long so it can loop at -50%
const wave = (amp) => {
  let d = `M0 40 Q 90 ${40 - amp} 180 40`
  for (let x = 180; x < 2880; x += 180) d += ` T ${x + 180} 40`
  return `${d} V 80 H 0 Z`
}

export default function Hero() {
  const ref = useRef(null)
  const lineRef = useRef(null)

  useGSAP(
    () => {
      const words = WORD_KEYS.map((key) => ref.current.querySelector(`[data-word="${key}"]`))
      const chars = (word) => word.querySelectorAll('.aj-hc')
      const underline = ref.current.querySelector('.aj-underline')
      const strike = ref.current.querySelector('.aj-strike')
      const length = underline.getTotalLength()

      const arrive = (word, extra = {}) => {
        const key = word.dataset.word
        const [from, to] = ARRIVALS[key]
        const tl = gsap.timeline(extra)
        tl.fromTo(chars(word), from, { ...to, duration: 1 })
        if (key === 'organic') tl.fromTo(underline, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.4)
        return tl
      }
      const strikePaid = () =>
        gsap
          .timeline()
          .fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' })
          .to(words[5], { color: 'rgb(255 255 255 / 0.35)', duration: 0.4 }, 0.15)

      gsap.set(underline, { strokeDasharray: length })

      const mm = gsap.matchMedia()
      mm.add(
        { desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)', mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
        (context, contextSafe) => {
          const { desktop, mobile } = context.conditions
          const line = lineRef.current

          if (!desktop && !mobile) {
            // Reduced motion: final state
            gsap.set(['.hero-pre', line], { opacity: 1 })
            gsap.set(underline, { strokeDashoffset: 0 })
            gsap.set(strike, { scaleX: 1 })
            gsap.set(words[5], { color: 'rgb(255 255 255 / 0.35)' })
            return
          }

          gsap.to('.aj-wave-a', { xPercent: -50, duration: 7, ease: 'none', repeat: -1 })
          gsap.to('.aj-wave-b', { xPercent: -50, duration: 12, ease: 'none', repeat: -1 })
          gsap.set(strike, { scaleX: 0 })

          if (mobile) {
            gsap.set(words.map(chars), { opacity: 0 })
            return onIntroDone(
              contextSafe(() => {
                gsap.set(line, { opacity: 1 })
                const intro = gsap.timeline()
                words.forEach((word, i) => intro.add(arrive(word), i * 0.22))
                intro.add(strikePaid(), '-=0.2').fromTo('.hero-pre', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.4)
              })
            )
          }

          // Desktop: pinned sideways journey
          // The line starts out on the right (only "Grow" in view) and travels in
          const startX = () => window.innerWidth * 0.58
          const travel = () => Math.max(0, line.scrollWidth - window.innerWidth * 0.9)
          const H = () => window.innerHeight * 3 // scroll length of the sideways travel
          const J = () => window.innerHeight * 0.9 // scroll length of the juice rising

          // The punchline, then the juice — driven from the pin's own progress
          // (a second trigger on the pinned section would be offset by the pin)
          const finale = gsap
            .timeline({ paused: true })
            .add(strikePaid(), 0)
            .to('.aj-hero-chrome', { opacity: 0, y: -30, duration: 0.4 }, 0.2)
            .fromTo('.aj-juice', { y: 0, yPercent: 100 }, { yPercent: 0, ease: 'power2.inOut', duration: 1 }, 0.25)

          ScrollTrigger.create({
            trigger: ref.current,
            start: 'top top',
            end: () => `+=${H() + J()}`,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const total = H() + J()
              const local = gsap.utils.clamp(0, 1, (self.progress * total - H()) / J())
              gsap.to(finale, { progress: local, duration: 0.6, ease: 'power2.out', overwrite: true })
            },
          })
          const sideways = gsap.fromTo(line, { x: () => startX() }, {
            x: () => -travel(),
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${H()}`, scrub: 1, invalidateOnRefresh: true },
          })
          gsap.fromTo('.aj-ghost-word', { xPercent: 10 }, { xPercent: -45, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${H()}`, scrub: 1.5 } })

          // Words already on screen at rest arrive with the intro; the rest as they slide in
          const onScreen = words.filter((w) => w.offsetLeft + startX() < window.innerWidth * 0.9)
          words
            .filter((w) => !onScreen.includes(w))
            .forEach((word) => {
              arrive(word, { scrollTrigger: { trigger: word, containerAnimation: sideways, start: 'left 96%', end: 'left 66%', scrub: 0.6 } })
            })

          gsap.set(onScreen.map(chars), { opacity: 0 })
          const stopWaiting = onIntroDone(
            contextSafe(() => {
              gsap.set(line, { opacity: 1 })
              const intro = gsap.timeline()
              onScreen.forEach((word, i) => intro.add(arrive(word), i * 0.25))
              intro.fromTo('.hero-pre', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 0.5)
            })
          )

          return stopWaiting
        }
      )
    },
    { scope: ref }
  )

  return (
    <section ref={ref} id="aj-top" className="relative flex min-h-[calc(100svh-76px)] flex-col justify-center overflow-hidden px-5 pb-28 pt-16 lg:h-[100svh] lg:p-0">
      {/* Soft glow */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[140px]" style={{ background: 'radial-gradient(closest-side, rgb(255 102 18 / 0.35), transparent)' }} />

      {/* The "huge" moment: a giant outlined word drifting behind */}
      <p
        aria-hidden="true"
        className="aj-ghost-word pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 whitespace-nowrap font-display text-[42vw] leading-none lg:block"
        style={{ color: 'transparent', WebkitTextStroke: '1px rgb(255 255 255 / 0.07)' }}
      >
        organic
      </p>

      {/* Frame chrome: badge, then description + CTA */}
      <div className="aj-hero-chrome relative z-10 lg:absolute lg:inset-x-0 lg:top-[9vh] lg:px-[6vw]">
        <p className="hero-pre inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[12px]" style={{ borderColor: 'var(--aj-line)', background: 'rgb(255 255 255 / 0.04)', color: 'var(--aj-muted)' }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6612] opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-[#ff6612]" />
          </span>
          {hero.badge}
        </p>
      </div>

      {/* The line */}
      <h1
        ref={lineRef}
        className="hero-pre relative z-10 my-10 font-display text-[19vw] leading-[0.95] tracking-[-0.03em] sm:text-[15vw] lg:absolute lg:inset-y-0 lg:left-0 lg:my-0 lg:flex lg:items-center lg:whitespace-nowrap lg:pl-[6vw] lg:pr-[4vw] lg:text-[15vw]"
        aria-label={hero.headline.map((w) => w.text).join(' ')}
      >
        {hero.headline.map((word, i) => (
          <span
            key={word.text}
            data-word={WORD_KEYS[i]}
            aria-hidden="true"
            className={`relative mr-[0.22em] inline-block whitespace-nowrap last:mr-0 ${word.accent ? 'text-[#ff6612]' : ''}`}
          >
            {toChars(word.text).map((char, j) => (
              <span key={j} className="aj-hc inline-block will-change-transform">
                {char}
              </span>
            ))}
            {word.accent && (
              <svg aria-hidden="true" viewBox="0 0 300 24" preserveAspectRatio="none" className="absolute -bottom-[0.04em] left-0 h-[0.12em] w-[96%] overflow-visible">
                <path className="aj-underline" d="M4 16 C 70 6, 160 4, 296 12" fill="none" stroke="#ff6612" strokeWidth="5" strokeLinecap="round" />
              </svg>
            )}
            {WORD_KEYS[i] === 'paid' && <span aria-hidden="true" className="aj-strike absolute left-[-4%] top-[52%] h-[0.07em] w-[100%] origin-left rounded-full bg-[#ff6612]" />}
          </span>
        ))}
      </h1>

      <div className="aj-hero-chrome relative z-10 flex flex-col items-start gap-6 lg:absolute lg:inset-x-0 lg:bottom-[9vh] lg:flex-row lg:items-end lg:justify-between lg:px-[6vw]">
        <p className="hero-pre max-w-md text-base leading-relaxed md:text-lg" style={{ color: 'var(--aj-muted)' }}>
          {hero.description}
        </p>
        <div className="hero-pre flex items-center gap-6">
          <span aria-hidden="true" className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.24em] lg:flex" style={{ color: 'var(--aj-subtle)' }}>
            Scroll
            <span className="block h-px w-10 bg-current" />
          </span>
          <BookCallPill />
        </div>
      </div>

      {/* The juice — rises at the end and hands over to the results */}
      <div aria-hidden="true" className="aj-juice pointer-events-none absolute inset-x-0 bottom-0 z-20 h-full" style={{ transform: 'translateY(92%)' }}>
        <svg viewBox="0 0 2880 80" preserveAspectRatio="none" className="aj-wave-b absolute bottom-[calc(100%-2px)] left-0 h-12 w-[200%]">
          <path d={wave(24)} fill="#ff8a47" />
        </svg>
        <svg viewBox="0 0 2880 80" preserveAspectRatio="none" className="aj-wave-a absolute bottom-[calc(100%-2px)] left-0 h-8 w-[200%]">
          <path d={wave(16)} fill="#ff6612" />
        </svg>
        <div className="h-full w-full bg-[#ff6612]" />
      </div>
    </section>
  )
}
