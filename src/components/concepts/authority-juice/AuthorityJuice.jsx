'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setPageStage } from '@/hooks/usePageTheme'
import { onIntroDone } from '@/lib/intro'
import { PALETTE } from './ui'
import { ConceptBar, Nav } from './Header'
import Hero from './Hero'
import Proof from './Proof'
import Solve from './Solve'
import Story from './Story'
import Experience from './Experience'
import Testimonials from './Testimonials'
import Offer from './Offer'
import { Footer, Newsletter, Outro } from './Closing'
import JuiceMeter from './JuiceMeter'

/*
 * Authority Juice — redesign (/work/authority-juice).
 *
 * Their brand, copy and imagery (used with permission), reimagined: the
 * same content and section order as authorityjuice.com, told through
 * interactive, scroll-driven scenes (juice hero, flip deck, path journey,
 * compare slider, card stack…). Only the frame bar at the top and the outro
 * at the bottom belong to Cyber Pears.
 */
export default function AuthorityJuice({ className = '' }) {
  // Fixed UI (cursor, scrollbar) follows the page stage — this page is dark throughout
  useEffect(() => setPageStage('ink'), [])

  // Several sections pin; re-measure once the preloader has lifted and the
  // page's fonts and images have settled
  useEffect(() => onIntroDone(() => ScrollTrigger.refresh()), [])

  return (
    <main className={`min-h-screen font-sans ${className}`} style={{ ...PALETTE, background: 'var(--aj-bg)', color: 'var(--aj-fg)' }}>
      <ConceptBar />
      {/* The redesign itself — its sticky nav is bounded by this wrapper, so it
          scrolls away before the Cyber Pears outro */}
      <div>
        <Nav />
        <Hero />
        <Proof />
        <Solve />
        <Story />
        <Experience />
        <Testimonials />
        <Offer />
        <Newsletter />
        <Footer />
      </div>
      <Outro />
      <JuiceMeter />
    </main>
  )
}
