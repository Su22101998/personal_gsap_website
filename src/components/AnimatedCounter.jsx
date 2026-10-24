'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Number that counts up to `value` the first time it scrolls into view.
 * Shows one decimal if `value` has decimals. Renders the final value on the
 * server and for reduced-motion users, so it's never stuck at 0.
 */
export default function AnimatedCounter({ value, suffix = '', className = '' }) {
  const ref = useRef(null)
  const format = (n) =>
    (value % 1 !== 0 ? n.toFixed(1) : Math.round(n).toLocaleString('en-US')) + suffix

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const counter = { val: 0 }
        ref.current.textContent = format(0)
        gsap.to(counter, {
          val: value,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
          onUpdate: () => {
            ref.current.textContent = format(counter.val)
          },
        })
        // Restore the real value if the animation is reverted mid-way
        return () => {
          if (ref.current) ref.current.textContent = format(value)
        }
      })
    },
    { scope: ref, dependencies: [value, suffix] }
  )

  return (
    <span ref={ref} className={`counter-value ${className}`}>
      {format(value)}
    </span>
  )
}
