'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { toneProps } from '@/lib/tone'
import { clipReveal } from '@/lib/animation'
import RevealText from '@/components/RevealText'
import Link from 'next/link'
import PlaceholderArt from '@/components/PlaceholderArt'
import AuthorityJuiceArt from '@/components/concepts/authority-juice/PreviewArt'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* =====================================================
   Project card — shared by desktop and mobile
   A project with an `href` (e.g. a concept page) becomes a link; `art`
   swaps the placeholder for its own preview artwork.
   ===================================================== */
const PROJECT_ART = {
  'authority-juice': AuthorityJuiceArt,
}

function ProjectCard({ project, index, artRef }) {
  const { t } = useTranslation()
  const Art = PROJECT_ART[project.art]
  const Wrapper = project.href ? Link : 'div'
  const linkProps = project.href ? { href: project.href, 'data-cursor-label': t('selectedWork.viewProject') } : {}
  const artClass = 'h-full w-full transition-[scale] duration-700 ease-out group-hover:scale-[1.04]'

  return (
    <article className="group flex flex-col">
      <Wrapper {...linkProps} className="focus-ring flex flex-col">
        <div className="relative overflow-hidden rounded-[22px]" style={{ height: 'min(52vh, 560px)' }}>
          {/* Oversized art layer, shifted for parallax on desktop */}
          <div ref={artRef} className="absolute inset-y-0 -left-[8%] -right-[8%]">
            {Art ? <Art className={artClass} /> : <PlaceholderArt seed={index} className={artClass} />}
          </div>
          <span
            className="absolute left-5 top-5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em]"
            style={{ background: 'rgb(var(--c-paper) / 0.14)', color: 'rgb(var(--c-paper))', backdropFilter: 'blur(8px)' }}
          >
            {project.concept ? `${t('selectedWork.concept')} · ${project.year}` : project.year}
          </span>
        </div>
        <div className="flex items-start justify-between gap-6 pt-5">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--fg-subtle)' }}>
              {project.client}
            </p>
            <h3 className="heading-display text-2xl md:text-3xl">{project.title}</h3>
          </div>
          <p className="shrink-0 pt-1 text-right text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {project.services.join(' · ')}
          </p>
        </div>
      </Wrapper>
    </article>
  )
}

/* =====================================================
   Desktop — sticky stage + scrubbed horizontal track
   The outer element is sized in JS to (track overflow + 2 × viewport):
   one viewport for the sticky stage, one for the closing radial wipe.
   ===================================================== */
function DesktopWork({ projects }) {
  const outerRef = useRef(null)
  const trackRef = useRef(null)
  const cardsRef = useRef([])
  const artsRef = useRef([])
  const wipeRef = useRef(null)
  const markerRef = useRef(null)
  const counterRef = useRef(null)
  const { t } = useTranslation()
  const total = String(projects.length).padStart(2, '0')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions
          if (!isDesktop) return

          const outer = outerRef.current
          const track = trackRef.current
          const wipe = wipeRef.current
          const cards = cardsRef.current.filter(Boolean)
          const arts = artsRef.current.filter(Boolean)

          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

          // Size the scroll runway + place the stage marker from live layout.
          // Runs before every refresh measures, so resizes stay correct.
          const layout = () => {
            outer.style.height = `${distance() + window.innerHeight * 2}px`
            // 50% through the wipe ('top center' start → distance + 100vh)
            markerRef.current.style.top = `${distance() + window.innerHeight}px`
          }
          layout()
          ScrollTrigger.addEventListener('refreshInit', layout)

          const skewTo = gsap.quickTo(cards, 'skewX', { duration: 0.4, ease: 'power3.out' })
          const settleSkew = gsap.delayedCall(0.12, () => skewTo(0)).pause()

          ScrollTrigger.create({
            trigger: outer,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
              const d = distance()
              const carouselRatio = d / (self.end - self.start)
              const progress = self.progress

              // --- Carousel phase ---
              const carouselProgress = Math.min(progress / carouselRatio, 1) || 0
              gsap.set(track, { x: -d * carouselProgress })

              const active = Math.round(carouselProgress * (projects.length - 1)) + 1
              counterRef.current.textContent = String(active).padStart(2, '0')

              if (!reduceMotion) {
                skewTo(gsap.utils.clamp(-6, 6, self.getVelocity() * 0.002))
                settleSkew.restart(true)

                // Art drifts against the track for depth
                const vw = window.innerWidth
                cards.forEach((card, i) => {
                  const box = card.getBoundingClientRect()
                  const offset = (box.left + box.width / 2 - vw / 2) / vw
                  gsap.set(arts[i], { xPercent: offset * -10 })
                })
              }

              // --- Radial wipe phase (theme switch is the marker's job) ---
              const wipeProgress = Math.max(0, (progress - carouselRatio) / (1 - carouselRatio))
              wipe.style.clipPath = `circle(${wipeProgress * 150}% at 100% 0%)`
              wipe.style.opacity = wipeProgress > 0 ? '1' : '0'
            },
          })

          return () => ScrollTrigger.removeEventListener('refreshInit', layout)
        }
      )
    },
    { scope: outerRef }
  )

  return (
    <div ref={outerRef} className="relative hidden md:block" style={{ height: '300vh' }}>
      {/* Stage marker — positioned in JS (see layout()) */}
      <div
        ref={markerRef}
        aria-hidden="true"
        data-stage="accent"
        className="pointer-events-none absolute left-0 h-0 w-px"
      />

      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-10 flex items-end justify-between gap-10 px-12 lg:px-24">
          <div>
            <p className="eyebrow mb-5">{t('selectedWork.label')}</p>
            <RevealText as="h2" className="heading-section">
              {t('selectedWork.heading')}
            </RevealText>
          </div>
          <div className="flex shrink-0 items-end gap-10">
            <p className="hidden max-w-xs text-sm lg:block" style={{ color: 'var(--fg-muted)' }}>
              {t('selectedWork.description')}
            </p>
            <p className="heading-dot text-3xl" aria-hidden="true">
              <span ref={counterRef}>01</span>
              <span style={{ color: 'var(--fg-subtle)' }}> / {total}</span>
            </p>
          </div>
        </div>

        <div ref={trackRef} className="flex w-max gap-8 px-12 will-change-transform lg:px-24">
          {projects.map((project, i) => (
            <div
              key={project.client}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              className="shrink-0"
              style={{ width: 'clamp(320px, 30vw, 480px)' }}
            >
              <ProjectCard
                project={project}
                index={i}
                artRef={(el) => {
                  artsRef.current[i] = el
                }}
              />
            </div>
          ))}
        </div>

        {/* Accent radial wipe — expands from top-right after the carousel ends */}
        <div
          ref={wipeRef}
          className="pointer-events-none absolute inset-0 z-20"
          style={{ background: 'rgb(var(--c-stage))', clipPath: 'circle(0% at 100% 0%)', opacity: 0 }}
        />
      </div>
    </div>
  )
}

/* =====================================================
   Mobile — native snap scroll with dots & arrows
   ===================================================== */
function MobileWork({ projects }) {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useTranslation()
  const lastIndex = projects.length - 1

  // Detect which card is visible
  useEffect(() => {
    const track = trackRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveIndex(Number(entry.target.dataset.index))
        })
      },
      { root: track, threshold: 0.6 }
    )
    track.querySelectorAll('[data-index]').forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const scrollToIndex = useCallback((index) => {
    trackRef.current
      ?.querySelector(`[data-index="${index}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [])

  const arrowStyle = (enabled) => ({
    border: '1px solid var(--hairline)',
    opacity: enabled ? 1 : 0.3,
  })

  return (
    <div className="py-24 md:hidden">
      <div className="mb-10 px-6">
        <p className="eyebrow mb-5">{t('selectedWork.label')}</p>
        <RevealText as="h2" className="heading-section mb-4">
          {t('selectedWork.heading')}
        </RevealText>
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
          {t('selectedWork.description')}
        </p>
      </div>

      <div
        ref={trackRef}
        className="hide-scrollbar flex gap-4 overflow-x-auto px-6 pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {projects.map((project, i) => (
          <div
            key={project.client}
            data-index={i}
            className="w-[82vw] max-w-[360px] shrink-0"
            style={{ scrollSnapAlign: 'center' }}
          >
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 px-6">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full"
          style={arrowStyle(activeIndex > 0)}
          aria-label={t('selectedWork.prev')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          {projects.map((project, i) => (
            <button
              key={project.client}
              type="button"
              onClick={() => scrollToIndex(i)}
              className="focus-ring h-2 rounded-full transition-all duration-300"
              style={{
                width: activeIndex === i ? 24 : 8,
                background: activeIndex === i ? 'var(--fg)' : 'var(--hairline)',
              }}
              aria-label={`${t('selectedWork.goTo')} ${i + 1}`}
              aria-current={activeIndex === i ? 'true' : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(lastIndex, activeIndex + 1))}
          disabled={activeIndex === lastIndex}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full"
          style={arrowStyle(activeIndex < lastIndex)}
          aria-label={t('selectedWork.next')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* =====================================================
   SelectedWork — main export
   Rises in as a rounded card over the ink Services section.
   ===================================================== */
export default function SelectedWork() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()
  const projects = t('selectedWork.projects')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        clipReveal(sectionRef.current)
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="work" {...toneProps('paper')} className="relative">
      <DesktopWork projects={projects} />
      <MobileWork projects={projects} />
    </section>
  )
}
