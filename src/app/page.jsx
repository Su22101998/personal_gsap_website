'use client'

import { useRef } from 'react'
import { usePageTheme } from '@/hooks/usePageTheme'
import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import Services from '@/components/Services'
import SelectedWork from '@/components/SelectedWork'
import CaseStudies from '@/components/CaseStudies'
import Process from '@/components/Process'
import Clients from '@/components/Clients'
import Studio from '@/components/Studio'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

/*
 * Page flow (tone → how it hands over to the next section):
 *   Hero (ink)            planet zoom fills the screen with the accent colour
 *   Manifesto (accent)    pinned word reveal, then bleeds to ink
 *   Services (ink)        Selected Work rises over it as a rounded card
 *   Selected Work (paper) horizontal track, then a radial accent wipe
 *   Case Studies (accent) stacked panels, then bleeds to ink
 *   Process, Clients (ink)
 *   Studio, Testimonials (paper)  Studio rises in as a card
 *   Contact (accent)      rises in as a card
 *   Footer (ink)          revealed underneath, curtain-style
 *
 * Each section colours itself (data-tone) and marks where the page stage
 * changes (data-stage) — see lib/tone.js and hooks/usePageTheme.js.
 */
export default function HomePage() {
  const mainRef = useRef(null)

  // data-stage on <html> is driven only by the data-stage markers in the sections
  usePageTheme(mainRef)

  return (
    <main ref={mainRef}>
      <Navbar />

      {/* Content sits above the sticky footer. Its own background follows the
          page stage, so the corners around the clip-reveal cards show the
          previous section's colour rather than the footer underneath. */}
      <div className="relative z-[1]" style={{ background: 'var(--bg)' }}>
        <Hero />
        <Manifesto />
        <Services />
        <SelectedWork />
        <CaseStudies />
        <Process />
        <Clients />
        <Studio />
        <Testimonials />
        <Contact />
      </div>

      <Footer />

      {/* After the content: its triggers must be created after the hero pin */}
      <ScrollProgress />
    </main>
  )
}
