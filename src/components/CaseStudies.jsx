'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

const CASE_COLORS = [
  'var(--accent-teal)',
  'var(--accent-blue)',
  'var(--accent-purple)',
  'var(--accent-teal)',
]

/**
 * Animated counter that counts up to a target value when in view.
 */
function AnimatedCounter({ value, suffix, triggerRef }) {
  const counterRef = useRef(null)

  useEffect(() => {
    const counter = { val: 0 }

    gsap.to(counter, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top 70%',
      },
      onUpdate: () => {
        if (counterRef.current) {
          // Format: show one decimal if value has decimals, otherwise integer
          const formatted =
            value % 1 !== 0
              ? counter.val.toFixed(1)
              : Math.round(counter.val).toLocaleString()
          counterRef.current.textContent = formatted + suffix
        }
      },
    })
  }, [value, suffix, triggerRef])

  return (
    <span
      ref={counterRef}
      className="counter-value text-2xl md:text-3xl font-bold"
      style={{ color: 'var(--text-primary)' }}
    >
      0{suffix}
    </span>
  )
}

/**
 * Mock dashboard graphic rendered with CSS — represents a financial UI.
 */
function MockDashboard({ color }) {
  return (
    <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
        <div className="flex-1" />
        <div className="w-16 h-1.5 rounded" style={{ background: 'var(--border-color)' }} />
      </div>

      {/* Mock chart area */}
      <div className="p-4 flex gap-3 h-full">
        {/* Sidebar */}
        <div className="w-1/4 flex flex-col gap-2">
          {[85, 72, 60, 90].map((w, i) => (
            <div
              key={i}
              className="h-3 rounded"
              style={{
                background: i === 0 ? color : 'var(--border-color)',
                opacity: i === 0 ? 0.6 : 0.3,
                width: `${w}%`,
              }}
            />
          ))}
        </div>

        {/* Chart bars — deterministic heights avoid hydration mismatch */}
        <div className="flex-1 flex items-end gap-1 pb-4">
          {[65, 40, 30, 80, 55, 25, 72, 38, 50, 88, 45, 60].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-500"
              style={{
                height: `${h}%`,
                background:
                  i % 3 === 0
                    ? color
                    : 'var(--border-color)',
                opacity: i % 3 === 0 ? 0.7 : 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CaseStudies() {
  const { t } = useTranslation()
  const caseStudies = t('caseStudies.cases').map((c, i) => ({ ...c, image: null, color: CASE_COLORS[i] }))

  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cases-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="cases" className="section-padding relative">
      <div className="absolute inset-0 bg-fintech-grid opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="cases-title text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
            style={{ color: 'var(--accent-teal)', background: 'var(--glow-color)' }}
          >
            {t('caseStudies.sectionLabel')}
          </span>
          <h2 className="heading-section mb-4">
            {t('caseStudies.heading')}{' '}
            <span className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-blue)] bg-clip-text text-transparent">
              {t('caseStudies.headingAccent')}
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            {t('caseStudies.description')}
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="fintech-card overflow-hidden group"
            >
              {/* Dashboard Preview */}
              <MockDashboard color={study.color} />

              {/* Content */}
              <div className="p-6 md:p-8">
                <span
                  className="text-xs uppercase tracking-wider font-medium"
                  style={{ color: study.color }}
                >
                  {study.category}
                </span>
                <h3
                  className="text-xl md:text-2xl font-bold mt-1 mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {study.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {study.description}
                </p>

                {/* Animated Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {study.stats.map((stat, sIdx) => (
                    <div key={sIdx}>
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        triggerRef={sectionRef}
                      />
                      <p
                        className="text-[10px] uppercase tracking-wider mt-1"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
