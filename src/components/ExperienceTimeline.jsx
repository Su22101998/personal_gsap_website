'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

const CARD_ACCENTS = [
  'var(--accent-teal)',
  'var(--accent-blue)',
  'var(--accent-purple)',
  'var(--accent-teal)',
  'var(--accent-blue)',
]

const CARD_WIDTH = 420 // md card width
const CARD_GAP = 24 // gap-6

/* =====================================================
   Timeline Card — shared between desktop and mobile
   ===================================================== */
function TimelineCard({ item, className = '' }) {
  return (
    <div
      className={`timeline-card flex-shrink-0 p-6 md:p-8 relative overflow-hidden flex flex-col rounded-2xl transition-all duration-400 ${className}`}
      style={{
        background: '#f5f0ff',
        border: '1px solid #e9d5ff',
      }}
    >
      {/* Year Badge */}
      <div
        className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold mb-4 self-start"
        style={{ color: item.accent, background: `${item.accent}15` }}
      >
        {item.year}
      </div>

      {/* Company */}
      <p
        className="text-xs uppercase tracking-wider mb-1 font-medium"
        style={{ color: '#94a3b8' }}
      >
        {item.company}
      </p>

      {/* Title */}
      <h3
        className="text-xl font-bold mb-3"
        style={{ color: '#1e1b4b' }}
      >
        {item.title}
      </h3>

      {/* Description — flex-grow pushes tags to the bottom */}
      <p
        className="text-sm leading-relaxed mb-5 flex-grow"
        style={{ color: '#475569' }}
      >
        {item.description}
      </p>

      {/* Metrics */}
      <div className="flex flex-wrap gap-3 mb-5">
        {item.metrics.map((metric, mIdx) => (
          <span
            key={mIdx}
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-md"
            style={{
              color: item.accent,
              background: `${item.accent}10`,
              border: `1px solid ${item.accent}25`,
            }}
          >
            {metric}
          </span>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag, tIdx) => (
          <span
            key={tIdx}
            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              color: '#64748b',
              background: '#ede9fe',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Decorative accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
        }}
      />
    </div>
  )
}

/* =====================================================
   Mobile Carousel — snap-scroll with dots & nav buttons
   ===================================================== */
function MobileCarousel() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useTranslation()
  const timelineData = t('experienceTimeline.cards').map((card, i) => ({ ...card, accent: CARD_ACCENTS[i] }))
  const totalItems = timelineData.length

  // Detect which card is visible via IntersectionObserver
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const cards = track.querySelectorAll('.mobile-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index)
            setActiveIndex(idx)
          }
        })
      },
      { root: track, threshold: 0.6 }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current
    if (!track) return
    const target = track.querySelector(`[data-index="${index}"]`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [])

  const handlePrev = useCallback(() => {
    const nextIdx = Math.max(0, activeIndex - 1)
    scrollToIndex(nextIdx)
  }, [activeIndex, scrollToIndex])

  const handleNext = useCallback(() => {
    const nextIdx = Math.min(totalItems - 1, activeIndex + 1)
    scrollToIndex(nextIdx)
  }, [activeIndex, totalItems, scrollToIndex])

  const canGoPrev = activeIndex > 0
  const canGoNext = activeIndex < totalItems - 1

  return (
    <div className="md:hidden">
      {/* Scrollable track — CSS snap scroll */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto px-6 pb-4 hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
        }}
      >
        {timelineData.map((item, idx) => (
          <div
            key={idx}
            data-index={idx}
            className="mobile-card flex-shrink-0 w-[85vw] max-w-[360px]"
            style={{ scrollSnapAlign: 'center' }}
          >
            <TimelineCard item={item} className="h-full" />
          </div>
        ))}
      </div>

      {/* Navigation: arrows + dots */}
      <div className="flex items-center justify-center gap-4 mt-6 px-6">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: canGoPrev ? 'var(--bg-card)' : 'transparent',
            border: `1px solid ${canGoPrev ? 'var(--accent-teal)' : 'var(--border-color)'}`,
            opacity: canGoPrev ? 1 : 0.3,
            cursor: canGoPrev ? 'pointer' : 'default',
          }}
          aria-label={t('experienceTimeline.prevCard')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8l4-4"
              stroke={canGoPrev ? 'var(--accent-teal)' : 'var(--text-muted)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {timelineData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeIndex === idx ? 24 : 8,
                height: 8,
                background:
                  activeIndex === idx
                    ? 'var(--accent-teal)'
                    : 'var(--border-color)',
              }}
              aria-label={`${t('experienceTimeline.goToCard')} ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: canGoNext ? 'var(--bg-card)' : 'transparent',
            border: `1px solid ${canGoNext ? 'var(--accent-teal)' : 'var(--border-color)'}`,
            opacity: canGoNext ? 1 : 0.3,
            cursor: canGoNext ? 'pointer' : 'default',
          }}
          aria-label={t('experienceTimeline.nextCard')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke={canGoNext ? 'var(--accent-teal)' : 'var(--text-muted)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* =====================================================
   Desktop Horizontal Scroll — CSS sticky + GSAP scrub
   Uses native `position: sticky` for a jank-free pin.
   The outer div is tall enough to create the needed
   scroll distance; the inner sticky div holds the
   visible content (header + carousel + wipe overlay).
   ===================================================== */

// Pre-compute scroll distance (constant — no window needed)
const SCROLL_DISTANCE = (CARD_ACCENTS.length - 1) * (CARD_WIDTH + CARD_GAP)

function DesktopTimeline() {
  const outerRef = useRef(null)
  const trackRef = useRef(null)
  const headerRef = useRef(null)
  const highlightRef = useRef(null)
  const cardsRef = useRef([])
  const purpleWipeRef = useRef(null)
  const { t } = useTranslation()
  const timelineData = t('experienceTimeline.cards').map((card, i) => ({ ...card, accent: CARD_ACCENTS[i] }))

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const track = trackRef.current
        const outer = outerRef.current
        if (!track || !outer) return

        const wipeDistance = window.innerHeight
        const totalScroll = SCROLL_DISTANCE + wipeDistance
        const carouselRatio = SCROLL_DISTANCE / totalScroll

        // Track velocity for skew-warp effect
        let prevX = 0
        let currentSkew = 0

        ScrollTrigger.create({
          trigger: outer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress

            // --- Carousel phase (0 → carouselRatio) ---
            const carouselProgress = Math.min(progress / carouselRatio, 1)
            const xPos = -SCROLL_DISTANCE * carouselProgress
            gsap.set(track, { x: xPos })

            // Skew warp based on scroll velocity
            const currentX = carouselProgress * SCROLL_DISTANCE
            const velocity = currentX - prevX
            prevX = currentX

            const targetSkew = gsap.utils.clamp(-8, 8, velocity * 0.15)
            currentSkew += (targetSkew - currentSkew) * 0.3

            cardsRef.current.filter(Boolean).forEach((card) => {
              gsap.set(card, { skewX: currentSkew })
            })

            // --- Purple radial wipe phase (carouselRatio → 1) ---
            if (purpleWipeRef.current) {
              const wipeProgress = Math.max(
                0,
                (progress - carouselRatio) / (1 - carouselRatio)
              )

              const radius = wipeProgress * 150
              purpleWipeRef.current.style.clipPath = `circle(${radius}% at 100% 0%)`
              purpleWipeRef.current.style.opacity = wipeProgress > 0 ? '1' : '0'

              if (wipeProgress > 0.5) {
                document.documentElement.classList.add('purple-active')
                document.documentElement.classList.remove('white-active')
              } else {
                document.documentElement.classList.remove('purple-active')
                document.documentElement.classList.add('white-active')
              }
            }
          },
        })

        // Animate the purple highlight on "Since 2019"
        if (highlightRef.current && headerRef.current) {
          gsap.to(highlightRef.current, {
            scaleX: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      }, outerRef)

      outerRef._gsapCtx = ctx
    })

    return () => {
      cancelAnimationFrame(rafId)
      outerRef._gsapCtx?.revert()
    }
  }, [])

  // Left padding so the first card is centred in the viewport
  const centeredOffset = `calc(50vw - ${CARD_WIDTH / 2}px)`

  return (
    /* Outer container — tall enough to supply the needed scroll distance.
       height = viewport (for the sticky) + carousel scroll + wipe scroll */
    <div
      ref={outerRef}
      className="hidden md:block relative"
      style={{ height: `calc(200vh + ${SCROLL_DISTANCE}px)` }}
    >
      {/* Sticky inner — stays fixed in the viewport while the outer scrolls */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-12 px-6 flex-shrink-0">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
            style={{ color: 'var(--accent-teal)', background: 'var(--glow-color)' }}
          >
            {t('experienceTimeline.sectionLabel')}
          </span>
          <h2 className="heading-section mb-4">
            {t('experienceTimeline.heading')}{' '}
            <span className="relative inline-block">
              {/* Purple highlight that animates in from left to right */}
              <span
                ref={highlightRef}
                className="absolute inset-0 rounded-md"
                style={{
                  background: '#7c3aed',
                  transformOrigin: 'left center',
                  transform: 'scaleX(0)',
                  zIndex: 0,
                }}
              />
              <span className="relative z-10 text-white px-3 py-1">
                {t('experienceTimeline.headingHighlight')}
              </span>
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-center" style={{ color: '#6b7280' }}>
            {t('experienceTimeline.description')}
          </p>
        </div>

        {/* Carousel track — py-4 prevents hover translateY clipping */}
        <div className="w-full overflow-hidden flex-shrink-0 py-4">
          <div
            ref={trackRef}
            className="flex items-stretch gap-6"
            style={{ paddingLeft: centeredOffset, paddingRight: centeredOffset }}
          >
            {timelineData.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => { cardsRef.current[idx] = el }}
                className="flex-shrink-0"
                style={{ willChange: 'transform' }}
              >
                <TimelineCard
                  item={item}
                  className="w-[420px] h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Purple radial wipe overlay — expands from top-right after carousel ends */}
        <div
          ref={purpleWipeRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: '#8b5cf6',
            clipPath: 'circle(0% at 100% 0%)',
            opacity: 0,
            zIndex: 20,
          }}
        />
      </div>
    </div>
  )
}

/* =====================================================
   ExperienceTimeline — main export
   ===================================================== */
export default function ExperienceTimeline() {
  const sectionRef = useRef(null)
  const mobileTitleRef = useRef(null)
  const mobileHighlightRef = useRef(null)
  const { t } = useTranslation()

  // Animate the mobile-only header on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (mobileTitleRef.current) {
        gsap.from(mobileTitleRef.current, {
          y: 60,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: mobileTitleRef.current,
            start: 'top 80%',
          },
        })
      }

      // Animate the purple highlight on mobile "Since 2019"
      if (mobileHighlightRef.current && mobileTitleRef.current) {
        gsap.to(mobileHighlightRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mobileTitleRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative">
      {/* Desktop: header + horizontal carousel pinned together, vertically centered */}
      <DesktopTimeline />

      {/* Mobile: standard vertical layout with its own header */}
      <div className="md:hidden py-24">
        <div ref={mobileTitleRef} className="text-center mb-12 px-6">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
            style={{ color: 'var(--accent-teal)', background: 'var(--glow-color)' }}
          >
            {t('experienceTimeline.sectionLabel')}
          </span>
          <h2 className="heading-section mb-4">
            {t('experienceTimeline.heading')}{' '}
            <span className="relative inline-block">
              <span
                ref={mobileHighlightRef}
                className="absolute inset-0 rounded-md"
                style={{
                  background: '#7c3aed',
                  transformOrigin: 'left center',
                  transform: 'scaleX(0)',
                  zIndex: 0,
                }}
              />
              <span className="relative z-10 text-white px-3 py-1">
                {t('experienceTimeline.headingHighlight')}
              </span>
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-center" style={{ color: '#6b7280' }}>
            {t('experienceTimeline.description')}
          </p>
        </div>
        <MobileCarousel />
      </div>
    </section>
  )
}
