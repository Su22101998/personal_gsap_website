'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { endorsers } from './data'

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

/** Endorsers as a typographic wall: names light up orange on hover. */
export function Endorsers() {
  const ref = useRef(null)
  useRise(ref, '.rs-endorser', { y: 30 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-10">Endorsed by</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-4">
          {endorsers.map((e) => (
            <li key={e.name} className="rs-endorser group">
              <span className="rs-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] text-white/25 transition-colors duration-300 group-hover:text-rs-accent">
                {e.name}
              </span>
              <span className="rs-mono ml-3 align-super text-[11px] uppercase tracking-[0.14em] text-white/40">{e.role}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-xl text-[14px] text-white/40">
          Full endorsements from these marketers and authors appear on the live site and would flow into each card from the CMS.
        </p>
      </div>
    </section>
  )
}

/** Closing newsletter call to action (demo: the concept doesn't collect emails). */
export function Newsletter() {
  const [sent, setSent] = useState(false)
  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-28 md:px-8 md:py-40">
      <div className="rs-grain pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
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
          <input id="rs-email" type="email" placeholder="Email address" className="rs-input flex-1" />
          <button type="submit" className="rs-btn rs-btn-orange">Sign me up</button>
        </form>
        <p className="mt-4 text-[13px] text-white/45" aria-live="polite">
          {sent ? 'Concept only: nothing was sent. The live form signs you up on rosssimmonds.com.' : 'One email a week: what Ross is building, testing and researching.'}
        </p>
      </div>
    </section>
  )
}
