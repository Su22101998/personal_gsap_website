'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Scroll progress as a glass of juice (desktop): it fills as you read the
 * page; click it to go back to the top.
 */
export default function JuiceMeter() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const levels = ref.current.querySelectorAll('.aj-meter-level') // the juice and the wave on top
        // 0% → 100% of the glass; the level rect starts below the glass
        ScrollTrigger.create({
          trigger: ref.current.closest('main'),
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => gsap.to(levels, { attr: { y: 62 - self.progress * 50 }, duration: 0.3, ease: 'power2.out', overwrite: true }),
        })
        gsap.to('.aj-meter-wave', { x: -20, duration: 1.6, ease: 'none', repeat: -1 })
      })
    },
    { scope: ref }
  )

  return (
    <a
      ref={ref}
      href="#aj-top"
      aria-label="Back to top"
      className="focus-ring group fixed bottom-6 right-6 z-40 hidden h-[72px] w-[56px] items-center justify-center rounded-2xl border bg-[#1a1a1a]/80 backdrop-blur transition-transform duration-300 hover:-translate-y-1 lg:flex"
      style={{ borderColor: 'var(--aj-line)' }}
    >
      <svg width="34" height="48" viewBox="0 0 34 64" aria-hidden="true">
        <defs>
          <clipPath id="aj-glass">
            <path d="M3 4h28l-3.5 52a4 4 0 0 1-4 3.7H10.5a4 4 0 0 1-4-3.7z" />
          </clipPath>
        </defs>
        <g clipPath="url(#aj-glass)">
          <rect className="aj-meter-level" x="-10" y="62" width="60" height="64" fill="#ff6612" />
          {/* Wave riding on the level */}
          <svg className="aj-meter-level" x="0" y="62" overflow="visible">
            <path className="aj-meter-wave" d="M-20 0 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 v6 h-70z" fill="#ff8a47" />
          </svg>
        </g>
        <path d="M3 4h28l-3.5 52a4 4 0 0 1-4 3.7H10.5a4 4 0 0 1-4-3.7z" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
        {/* Straw */}
        <path d="M20 -2 L24 30" stroke="#ff6612" strokeWidth="3" strokeLinecap="round" transform="translate(0 4)" />
      </svg>
    </a>
  )
}
