'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FintechSystems from '@/components/FintechSystems'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import CaseStudies from '@/components/CaseStudies'
import DataPlayground from '@/components/DataPlayground'
import Skills from '@/components/Skills'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const purpleWrapperRef = useRef(null)
  const transitionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-driven background colour transition: purple → white
      gsap.to(purpleWrapperRef.current, {
        backgroundColor: '#ffffff',
        ease: 'none',
        scrollTrigger: {
          trigger: transitionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Switch to white theme variables when transition completes
      ScrollTrigger.create({
        trigger: transitionRef.current,
        start: 'center center',
        onEnter: () => {
          document.documentElement.classList.add('white-active')
          document.documentElement.classList.remove('purple-active')
        },
        onLeaveBack: () => {
          document.documentElement.classList.remove('white-active')
          document.documentElement.classList.add('purple-active')
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      <Navbar />
      <Hero />

      {/* Single continuous wrapper — bg animates purple → white via scrub.
          ExperienceTimeline lives inside so there is no seam at the boundary.
          The radial wipe inside the carousel visually brings purple back,
          and the next div picks up with a real purple bg. */}
      <div ref={purpleWrapperRef} style={{ backgroundColor: '#8b5cf6' }}>
        <FintechSystems />

        {/* Scroll-driven trigger zone for the colour transition */}
        <div
          ref={transitionRef}
          className="relative h-[40vh]"
          aria-hidden="true"
        />

        <ExperienceTimeline />
      </div>

      {/* Post-carousel sections — purple bg revealed once the radial wipe fills */}
      <div style={{ backgroundColor: '#8b5cf6' }}>
        <CaseStudies />
        <DataPlayground />
        <Skills />
        <About />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
