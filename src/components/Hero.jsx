'use client'

import { useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { isIntroDone, onIntroDone } from '@/lib/intro'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Dynamic import — Three.js cannot run during SSR
const OrbitScene = dynamic(
  () => import('@/components/three/OrbitScene'),
  { ssr: false }
)

/**
 * Hero section — cinematic entry with the Three.js orbital scene.
 *
 * On scroll the text enlarges (flying toward the viewer), the camera
 * zooms into the central planet until it fills the screen, handing over to
 * the accent-toned Manifesto. Reduced motion: a static hero, no pin or zoom.
 */
export default function Hero() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const subtextOuterRef = useRef(null)
  const subtextInnerRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const stageOverlayRef = useRef(null)
  const glowRef = useRef(null)

  const runTextEntranceRef = useRef(() => {})
  const textEntranceCompleteRef = useRef(false)

  // Shared ref: GSAP tweens `.value` from 0→1, Three.js reads it every frame
  const zoomProgressRef = useRef({ value: 0 })

  const { t } = useTranslation()

  const onNodesIntroComplete = useCallback(() => {
    runTextEntranceRef.current?.()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => setupHero(context, context.conditions.reduce)
      )
    },
    { scope: sectionRef }
  )

  function setupHero(context, reduceMotion) {
    const section = sectionRef.current
    const headline = headlineRef.current
    const subtextOuter = subtextOuterRef.current
    const subtextInner = subtextInnerRef.current
    const scrollIndicator = scrollIndicatorRef.current
    const letters = headline.querySelectorAll('.hero-letter')

    if (reduceMotion) {
      // Static hero: everything visible, no entrance, no pin or zoom
      gsap.set([subtextInner, scrollIndicator, glowRef.current], { opacity: 1 })
      gsap.set(letters, { y: '0%' })
      return
    }

    // Pre-entrance state. CSS (.hero-pre / .hero-letter) already applies it
    // from first paint; this makes GSAP the owner of those properties.
    gsap.set(subtextOuter, { y: 30 })
    gsap.set(subtextInner, { opacity: 0 })
    gsap.set(scrollIndicator, { opacity: 0 })
    gsap.set(glowRef.current, { opacity: 0 })
    gsap.set(letters, { y: '110%' })

    // Soft accent aura fades in once the page is revealed (behind the WebGL layer)
    const glowTween = gsap.to(glowRef.current, {
      opacity: 1,
      duration: 1.6,
      delay: 0.7,
      ease: 'power2.out',
      paused: true,
    })

    const easePower2In = gsap.parseEase('power2.in')
    let zoomTl

    // Subtext opacity is driven manually so it doesn't fight the entrance tween
    const updateHeroSubtextOpacity = () => {
      if (!zoomTl || !textEntranceCompleteRef.current) return

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
      gsap.set(subtextInner, { opacity })
    }

    // Text entrance — built paused, played once the 3D intro finishes
    // (or by the fallback timer). Finishing it builds the scroll zoom.
    const entranceTl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        textEntranceCompleteRef.current = true
        buildZoom()
      },
    })
    entranceTl
      .to(letters, { y: '0%', duration: 0.7, stagger: 0.025 })
      .to(subtextOuter, { y: 0, duration: 0.8 }, '-=0.4')
      .to(subtextInner, { opacity: 1, duration: 0.8 }, '<')
      .to(scrollIndicator, { opacity: 1, duration: 1 }, '-=0.2')

    let pinProgress = 0

    // Declared before the pin: creating the pin can call this synchronously
    // (page loaded already scrolled into the hero → onUpdate → entrance
    // fast-forward → onComplete → buildZoom).
    // context.add → anything created inside is reverted with this context,
    // even though it runs later from the entrance's onComplete
    const buildZoom = context.add(null, () => {
      if (zoomTl) return
      zoomTl = gsap.timeline({ paused: true, onUpdate: updateHeroSubtextOpacity })

      // fromTo with explicit start values = the entrance's end state
      zoomTl
        // The headline doesn't zoom — it just fades out in place
        .fromTo(
          headline,
          { opacity: 1 },
          { opacity: 0, duration: 0.6, ease: 'power2.in', immediateRender: false },
          0.05
        )
        // The subtitle fades in place too (see updateHeroSubtextOpacity), as does the scroll cue
        .fromTo(
          scrollIndicator,
          { opacity: 1 },
          { opacity: 0, duration: 0.4, ease: 'power2.in', immediateRender: false },
          0.05
        )

      zoomTl.to('.hero-gradient-overlay', { opacity: 0, duration: 0.4, immediateRender: false }, 0)
      zoomTl.to(zoomProgressRef.current, { value: 1, duration: 1, ease: 'none', immediateRender: false }, 0)
      zoomTl.to(
        stageOverlayRef.current,
        { opacity: 1, duration: 0.3, ease: 'power2.in', immediateRender: false },
        0.6
      )

      // Built mid-scroll (entrance force-finished)? Jump straight to the right spot
      zoomTl.progress(pinProgress)
      updateHeroSubtextOpacity()
    })

    // The pin exists from the start (layout needs its spacer), but the zoom
    // timeline is only built once the entrance has finished. Otherwise a
    // ScrollTrigger.refresh (e.g. when fonts load) renders the zoom at time 0
    // and applies its start values — showing the text behind the preloader.
    //
    // The zoom is driven from this pin's progress rather than its own
    // ScrollTrigger: a trigger created later on an already-pinned element is
    // offset by the pin's whole distance (it would start where the pin ends).
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=120%',
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        pinProgress = self.progress
        // Scrolling before the entrance finishes would leave the two
        // timelines fighting over the same props — finish the entrance now
        // (which builds the zoom). Checks the real scroll position: a refresh
        // can report a spurious progress at scrollY 0.
        if (!textEntranceCompleteRef.current && isIntroDone() && self.scroll() > self.start + 1) {
          entranceTl.progress(1)
        }
        // Smoothed follow — the equivalent of `scrub: 1`
        if (zoomTl) {
          gsap.to(zoomTl, { progress: self.progress, duration: 1, ease: 'power3.out', overwrite: true })
        }
      },
    })

    // The 3D scene calls this when its node intro finishes. Never play
    // behind the preloader — wait for the intro signal.
    runTextEntranceRef.current = () => onIntroDone(() => entranceTl.play())

    // Once revealed: start the aura, and a fallback in case the 3D intro
    // never reports in (slow GPU, WebGL failure)
    let fallbackId
    const stopWaiting = onIntroDone(() => {
      glowTween.play()
      fallbackId = window.setTimeout(() => entranceTl.play(), 4500)
    })

    return () => {
      stopWaiting()
      window.clearTimeout(fallbackId)
      runTextEntranceRef.current = () => {}
      textEntranceCompleteRef.current = false
    }
  }

  return (
    <>
      {/* "#home" target (logo, back to top). Not the section itself: once
          scrolled past, the pin pushes the section down by its whole distance,
          so an anchor on it would land at the end of the zoom. */}
      <span id="home" aria-hidden="true" className="absolute left-0 top-0" />
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-end overflow-hidden"
      >
        {/* Backdrop — black base + delayed purple glow (visible through canvas alpha) */}
        <div
          className="hero-atmosphere absolute inset-0 z-0 pointer-events-none"
          aria-hidden
        />
        <div
          ref={glowRef}
          className="hero-glow hero-pre absolute inset-0 z-0 pointer-events-none"
          aria-hidden
        />

        {/* Three.js scene — above backdrop; nodes/lines render on top of the atmosphere */}
        <div className="absolute inset-0 z-[1]">
          <OrbitScene
            zoomProgress={zoomProgressRef}
            onNodesIntroComplete={onNodesIntroComplete}
          />
        </div>

        {/* Soft edge vignette only — keep the purple aura readable in the center */}
        <div className="hero-gradient-overlay absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55 z-[1]" />
        <div className="hero-gradient-overlay absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 z-[1]" />

        {/* Stage overlay — fades in as we enter the planet, handing off to the
            accent stage colour of the active brand */}
        <div
          ref={stageOverlayRef}
          className="absolute inset-0 z-[2]"
          style={{ backgroundColor: 'rgb(var(--c-stage))', opacity: 0 }}
        />

        {/* Content — bottom left, lined up with the nav */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-10 text-left md:px-10 md:pb-14">
          {/* Headline — each letter wrapped for staggered bottom-up entrance */}
          <h1
            ref={headlineRef}
            className="heading-hero mb-4 md:mb-6"
          >
            {/* "\n" in the copy = a deliberate line break */}
            {t('hero.headline').split('\n').map((line, lineIdx) => (
              <span key={lineIdx} className="block">
                {line.split(' ').map((word, wordIdx) => {
                  const isAccent = t('hero.accentWords').includes(word)
                  return (
                    // Mask per word for the rising letters; the extra bottom room keeps
                    // descenders (the "y") from being clipped, the negative margin
                    // keeps the line spacing as set
                    <span
                      key={wordIdx}
                      className="inline-block overflow-hidden mr-[0.3em] align-bottom pb-[0.2em] -mb-[0.1em]"
                    >
                      {word.split('').map((char, charIdx) => (
                        <span
                          key={charIdx}
                          className={`hero-letter inline-block ${isAccent ? 'text-brand-soft' : ''}`}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>

          <div ref={subtextOuterRef}>
            <p
              ref={subtextInnerRef}
              className="hero-pre section-subtitle text-base md:text-lg"
            >
              {t('hero.subtext')}
            </p>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="hero-pre absolute bottom-14 right-10 z-10 hidden flex-col items-center gap-2 md:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--fg-subtle)' }}>
            {t('hero.scrollLabel')}
          </span>
          <div
            className="w-5 h-8 rounded-full border flex items-start justify-center p-1"
            style={{ borderColor: 'var(--hairline)' }}
          >
            <div
              className="w-1 h-2 rounded-full motion-safe:animate-bounce"
              style={{ background: 'var(--accent)' }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
