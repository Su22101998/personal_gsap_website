'use client'

import { useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { useTranslation } from '@/i18n'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Dynamic import — Three.js cannot run during SSR
const FinancialNetwork = dynamic(
  () => import('@/components/three/FinancialNetwork'),
  { ssr: false }
)

/**
 * Hero section — cinematic entry with Three.js financial network.
 *
 * On scroll the text enlarges (flying toward the viewer), the camera
 * zooms into the central purple node until it fills the screen, then the
 * background transitions to purple for the rest of the site.
 */
export default function Hero() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const subtextOuterRef = useRef(null)
  const subtextInnerRef = useRef(null)
  const badgeRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const purpleOverlayRef = useRef(null)

  const runTextEntranceRef = useRef(() => {})
  const textEntranceStartedRef = useRef(false)
  const textEntranceCompleteRef = useRef(false)
  const syncHeroSubtextOpacityRef = useRef(null)

  // Shared ref: GSAP tweens `.value` from 0→1, Three.js reads it every frame
  const zoomProgressRef = useRef({ value: 0 })

  const { t } = useTranslation()

  const onNodesIntroComplete = useCallback(() => {
    runTextEntranceRef.current?.()
  }, [])

  useLayoutEffect(() => {
    if (!badgeRef.current) return
    gsap.set(badgeRef.current, { opacity: 0, y: 20 })
    gsap.set(subtextOuterRef.current, { y: 30 })
    gsap.set(subtextInnerRef.current, { opacity: 0 })
    gsap.set(scrollIndicatorRef.current, { opacity: 0 })
    const letters = headlineRef.current?.querySelectorAll('.hero-letter')
    if (letters?.length) gsap.set(letters, { y: '110%' })
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const easePower2In = gsap.parseEase('power2.in')
      let zoomTl

      const updateHeroSubtextOpacity = () => {
        const inner = subtextInnerRef.current
        if (!inner || !zoomTl || !textEntranceCompleteRef.current) return

        const d = zoomTl.totalDuration() || 1
        const subT0 = 0.08 / d
        const subT1 = (0.08 + 0.2) / d
        const p = zoomTl.progress()

        let opacity
        if (p <= subT0) opacity = 1
        else if (p >= subT1) opacity = 0
        else {
          const t = (p - subT0) / (subT1 - subT0)
          opacity = 1 - easePower2In(t)
        }
        gsap.set(inner, { opacity })
      }

      syncHeroSubtextOpacityRef.current = updateHeroSubtextOpacity

      zoomTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: updateHeroSubtextOpacity,
          onLeave: () => {
            document.documentElement.classList.add('purple-active')
          },
          onEnterBack: () => {
            document.documentElement.classList.remove('purple-active')
          },
        },
      })

      zoomTl.set(headlineRef.current, { overflow: 'visible' }, 0)

      zoomTl
        .to(badgeRef.current, {
          scale: 6,
          opacity: 0,
          y: -200,
          duration: 0.5,
          ease: 'power2.in',
          immediateRender: false,
        }, 0)
        .to(headlineRef.current, {
          scale: 8,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
          immediateRender: false,
        }, 0.05)
        .to(subtextOuterRef.current, {
          scale: 5,
          y: 100,
          duration: 0.5,
          ease: 'power2.in',
          immediateRender: false,
        }, 0.08)
        .to(scrollIndicatorRef.current, {
          scale: 3,
          opacity: 0,
          y: 200,
          duration: 0.4,
          ease: 'power2.in',
          immediateRender: false,
        }, 0.05)

      zoomTl.to('.hero-gradient-overlay', {
        opacity: 0,
        duration: 0.4,
        immediateRender: false,
      }, 0)

      zoomTl.to(
        zoomProgressRef.current,
        { value: 1, duration: 1, ease: 'power2.in', immediateRender: false },
        0
      )

      zoomTl.to(
        purpleOverlayRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.in',
          immediateRender: false,
        },
        0.6
      )
    }, section)

    const tryRunEntrance = () => {
      if (textEntranceStartedRef.current) return
      if (
        !badgeRef.current ||
        !headlineRef.current ||
        !subtextOuterRef.current ||
        !subtextInnerRef.current ||
        !scrollIndicatorRef.current
      ) {
        return
      }
      const letters = headlineRef.current.querySelectorAll('.hero-letter')
      if (!letters.length) return

      textEntranceStartedRef.current = true

      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      entranceTl.eventCallback('onComplete', () => {
        textEntranceCompleteRef.current = true
        syncHeroSubtextOpacityRef.current?.()
      })
      entranceTl
        .to(badgeRef.current, { y: 0, opacity: 1, duration: 0.8 })
        .to(
          letters,
          { y: '0%', duration: 0.7, stagger: 0.025, ease: 'power3.out' },
          '-=0.35'
        )
        .to(subtextOuterRef.current, { y: 0, duration: 0.8 }, '-=0.4')
        .to(subtextInnerRef.current, { opacity: 1, duration: 0.8 }, '<')
        .to(scrollIndicatorRef.current, { opacity: 1, duration: 1 }, '-=0.2')
    }

    runTextEntranceRef.current = tryRunEntrance

    const fallbackId = window.setTimeout(() => {
      tryRunEntrance()
    }, 4500)

    return () => {
      window.clearTimeout(fallbackId)
      runTextEntranceRef.current = () => {}
      syncHeroSubtextOpacityRef.current = null
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Backdrop — sits under the WebGL layer (canvas alpha shows this through empty pixels) */}
      <div
        className="hero-atmosphere absolute inset-0 z-0 pointer-events-none"
        aria-hidden
      />

      {/* Three.js scene — above backdrop; nodes/lines render on top of the atmosphere */}
      <div className="absolute inset-0 z-[1]">
        <FinancialNetwork
          zoomProgress={zoomProgressRef}
          onNodesIntroComplete={onNodesIntroComplete}
        />
      </div>

      {/* Gradient washes — optional depth on scroll; faded via GSAP */}
      <div className="hero-gradient-overlay absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/50 via-transparent to-[var(--bg-primary)] z-[1]" />
      <div className="hero-gradient-overlay absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/35 via-transparent to-[var(--bg-primary)]/35 z-[1]" />

      {/* Purple overlay — fades in as we enter the purple dot */}
      <div
        ref={purpleOverlayRef}
        className="absolute inset-0 z-[2]"
        style={{ backgroundColor: '#8b5cf6', opacity: 0 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div ref={badgeRef} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase glass">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--accent-teal)' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>
              {t('hero.badge')}
            </span>
          </span>
        </div>

        {/* Headline — each letter wrapped for staggered bottom-up entrance */}
        <h1
          ref={headlineRef}
          className="heading-hero mb-6"
        >
          {t('hero.headline')
            .split(' ')
            .map((word, wordIdx) => {
              const isAccent = t('hero.accentWords').includes(word)
              return (
                <span key={wordIdx} className="inline-block overflow-hidden mr-[0.3em] align-bottom pb-[0.12em]">
                  {word.split('').map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className={`hero-letter inline-block ${
                        isAccent
                          ? 'bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] bg-clip-text text-transparent'
                          : ''
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              )
            })}
        </h1>

        <div ref={subtextOuterRef} className="origin-center">
          <p
            ref={subtextInnerRef}
            className="section-subtitle mx-auto mb-10 text-base md:text-lg"
          >
            {t('hero.subtext')}
          </p>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
          {t('hero.scrollLabel')}
        </span>
        <div
          className="w-5 h-8 rounded-full border flex items-start justify-center p-1"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div
            className="w-1 h-2 rounded-full animate-bounce"
            style={{ background: 'var(--accent-teal)' }}
          />
        </div>
      </div>
    </section>
  )
}
