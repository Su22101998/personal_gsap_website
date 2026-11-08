'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { LOGOS, endorsers } from './data'
import { hasFastGPU } from '@/lib/gpu'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A heading whose words rise in from masks the first time it's scrolled to. */
export function SplitHeading({ as: Tag = 'h2', className = '', start = 'top 85%', immediate = false, children }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reduce()) return
      SplitText.create(ref.current, {
        type: 'words',
        mask: 'words',
        // Masks get "rs-word-mask": room below for descenders (globals.css)
        wordsClass: 'rs-word',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 130,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.05,
            ...(immediate ? { delay: 0.2 } : { scrollTrigger: { trigger: ref.current, start, once: true } }),
          }),
      })
    },
    { scope: ref }
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/** Elements matching `selector` rise in as their container scrolls in. */
export function useRise(scope, selector, extra = {}) {
  useGSAP(
    () => {
      if (reduce()) return
      gsap.utils.toArray(selector, scope.current).forEach((el) => {
        gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true }, ...extra })
      })
    },
    { scope }
  )
}

/** Count up to `value` when scrolled into view. */
export function Count({ value, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const el = ref.current
      if (reduce()) return
      const obj = { v: 0 }
      gsap.to(obj, {
        v: value,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => (el.textContent = prefix + Math.round(obj.v).toLocaleString('en-US') + suffix),
      })
    },
    { scope: ref }
  )
  // Server-rendered with the final number, so crawlers and no-JS see it
  return (
    <span ref={ref} className={className}>
      {prefix + value.toLocaleString('en-US') + suffix}
    </span>
  )
}

/**
 * A brand's full wordmark, in white. Wide marks are set shorter and compact
 * ones taller, so a row of them reads at one visual weight; `size` is the
 * height of a typical (3.6:1) mark.
 */
export function Logo({ id, size = 30, className = '' }) {
  const logo = LOGOS[id]
  const aspect = logo.w / 120
  const height = Math.round(size * Math.min(1.5, Math.max(0.62, Math.sqrt(3.6 / aspect))))
  return (
    <Image
      src={`/work/ross-simmonds/logos/${id}.png`}
      alt={logo.name}
      width={logo.w}
      height={120}
      className={className}
      style={{ height, width: 'auto' }}
    />
  )
}

const LinkedInMark = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.3 21 14.7V21h-4v-5.6c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95V21H9z" />
  </svg>
)

/**
 * Endorsers as a typographic wall. Each name links to the person's LinkedIn
 * (the "LinkedIn ↗" tag says so). On desktop, hovering a name brings their
 * photo up just above it, its right edge lined up with the end of the
 * LinkedIn tag; on phones the photo sits beside the name.
 */
export function Endorsers() {
  const ref = useRef(null)
  const card = useRef(null)
  const [active, setActive] = useState(0)
  useRise(ref, '.rs-endorser', { y: 30 })

  const { contextSafe } = useGSAP({ scope: ref })
  const photoCard = () => {
    if (!card.current) {
      const el = ref.current.querySelector('.rs-e-card')
      card.current = { el, on: false, x: gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' }) }
    }
    return card.current
  }
  // Sit the photo just above the name, right edges aligned. It appears in
  // place the first time, then glides from one name to the next.
  const show = contextSafe((link) => {
    const c = photoCard()
    if (link) {
      const r = ref.current.getBoundingClientRect()
      const a = link.getBoundingClientRect()
      const x = a.right - r.left - c.el.offsetWidth
      const y = a.top - r.top - c.el.offsetHeight - 12
      if (!c.on || reduce()) gsap.set(c.el, { x, y })
      else (c.x(x), c.y(y))
    }
    c.on = !!link
    gsap.to(c.el, { opacity: link ? 1 : 0, scale: link ? 1 : 0.9, duration: reduce() ? 0 : 0.3, ease: 'power3.out', overwrite: 'auto' })
  })

  return (
    <section ref={ref} className="relative border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-10">Endorsed by</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-5">
          {endorsers.map((e, i) => (
            <li key={e.name} className="rs-endorser">
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${e.name}, ${e.role}: LinkedIn profile (opens in a new tab)`}
                onPointerEnter={(ev) => (setActive(i), show(ev.currentTarget))}
                onPointerLeave={() => show(null)}
                onFocus={(ev) => (setActive(i), show(ev.currentTarget))}
                onBlur={() => show(null)}
                className="focus-ring group inline-flex items-center gap-3 rounded-[6px]"
              >
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full md:hidden">
                  <Image src={`/work/ross-simmonds/people/${e.photo}.jpg`} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span className="rs-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] text-white/25 transition-colors duration-300 group-hover:text-rs-accent group-focus-visible:text-rs-accent">
                  {e.name}
                </span>
                <span className="flex flex-col items-start gap-1.5 self-start pt-2">
                  <span className="rs-mono text-[11px] uppercase tracking-[0.14em] text-white/40">{e.role}</span>
                  <span className="rs-mono inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/45 transition-colors duration-300 group-hover:border-rs-accent group-hover:text-rs-accent">
                    <LinkedInMark />
                    LinkedIn
                    <span className="transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-0.5">↗</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-xl text-[14px] text-white/40">
          Full endorsements from these marketers and authors appear on the live site and would flow into each card from the CMS.
        </p>
      </div>

      {/* Photo card above the hovered name (desktop) */}
      <div className="rs-e-card pointer-events-none absolute left-0 top-0 z-10 hidden w-[184px] origin-bottom-right rounded-[12px] border border-white/10 bg-[#151515] p-2 opacity-0 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] md:block" aria-hidden="true">
        <div className="relative aspect-square overflow-hidden rounded-[8px]">
          {/* All photos stay loaded; the active one shows at once, with no fade, so the last person's never flashes first */}
          {endorsers.map((e, i) => (
            <Image
              key={e.photo}
              src={`/work/ross-simmonds/people/${e.photo}.jpg`}
              alt=""
              fill
              sizes="184px"
              className={`object-cover ${i === active ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>
        <p className="mt-2 px-1 text-[13px] font-medium text-[#f2f0eb]">{endorsers[active].name}</p>
        <p className="rs-mono flex items-center gap-1.5 px-1 pb-1 text-[10px] uppercase tracking-[0.12em] text-rs-accent">
          <LinkedInMark /> View profile ↗
        </p>
      </div>
    </section>
  )
}

/**
 * The newsletter's backdrop: a globe of 7,500 dots (one for every ten
 * readers) that gathers as the section scrolls in, with new readers flying in
 * and lighting up; the cursor raises the dots under it. three.js loads only
 * when the section comes near, and a device without a real GPU gets a single
 * still frame instead of the animation.
 */
function ReaderGlobe() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    let dispose
    let cancelled = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        import('./readerGlobe').then(({ createReaderGlobe }) => {
          if (cancelled) return
          try {
            dispose = createReaderGlobe(el, { animate: hasFastGPU() && !reduce() })
          } catch {
            // No WebGL: the section reads fine without its backdrop
          }
        })
      },
      { rootMargin: '400px 0px' }
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
      dispose?.()
    }
  }, [])
  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />
}

/** Closing newsletter call to action (demo: the concept doesn't collect emails). */
export function Newsletter() {
  const [sent, setSent] = useState(false)
  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-28 md:px-8 md:py-40">
      <div className="rs-grain pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      {/* Globe on the right; on phones it sits behind the text, dimmed */}
      <div className="absolute inset-y-0 right-0 w-full opacity-40 [mask-image:linear-gradient(to_right,transparent,black_30%)] lg:w-[58%] lg:opacity-100">
        <ReaderGlobe />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">The newsletter</p>
        <SplitHeading className="rs-display max-w-4xl text-[clamp(2.6rem,6.5vw,6rem)] leading-[0.95]">
          Join 75,000+ marketers who get the research first.
        </SplitHeading>
        <form
          className="mt-12 flex max-w-2xl flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          <label className="sr-only" htmlFor="rs-name">First name</label>
          <input id="rs-name" placeholder="First name" className="rs-input sm:w-44" />
          <label className="sr-only" htmlFor="rs-email">Email address</label>
          <input id="rs-email" type="email" placeholder="Email address" className="rs-input sm:flex-1" />
          <button type="submit" className="rs-btn rs-btn-orange">Sign me up</button>
        </form>
        <p className="mt-4 text-[13px] text-white/45" aria-live="polite">
          {sent ? 'Concept only: nothing was sent. The live form signs you up on rosssimmonds.com.' : 'One email a week: what Ross is building, testing and researching.'}
        </p>
      </div>
    </section>
  )
}
