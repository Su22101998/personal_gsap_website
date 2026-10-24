'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onIntroDone } from '@/lib/intro'

gsap.registerPlugin(ScrollTrigger)

/**
 * Initializes Lenis smooth scrolling and integrates it with GSAP ScrollTrigger.
 * Wraps children without adding extra DOM elements.
 *
 * - In-page anchor links (href="#id") scroll through Lenis, so they never
 *   fight it the way native smooth scrolling would.
 * - Scrolling is paused until the intro is done (preloader lifted).
 * - Skipped entirely for users who prefer reduced motion — native scroll
 *   and instant anchor jumps are used.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      anchors: true,
    })

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Keep a stable reference so cleanup removes the exact same callback
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    lenis.stop()
    const stopWaiting = onIntroDone(() => lenis.start())

    return () => {
      stopWaiting()
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])

  return children
}
