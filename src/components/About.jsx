'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()
  const stats = t('about.stats')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-content', {
        x: -60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })

      gsap.from('.about-visual', {
        x: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })

      gsap.from('.about-stat', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.about-stats-grid',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="section-padding relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
            style={{ color: 'var(--accent-teal)', background: 'var(--glow-color)' }}
          >
            {t('about.sectionLabel')}
          </span>
          <h2 className="heading-section">
            {t('about.heading')}{' '}
            <span className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-blue)] bg-clip-text text-transparent">
              {t('about.headingAccent')}
            </span>
          </h2>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="about-content space-y-6">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('about.bioP1Start')}
              <span style={{ color: 'var(--accent-teal)' }}>{t('about.bioHighlights')[0]}</span>,{' '}
              <span style={{ color: 'var(--accent-blue)' }}>{t('about.bioHighlights')[1]}</span>, and{' '}
              <span style={{ color: 'var(--accent-purple)' }}>{t('about.bioHighlights')[2]}</span>.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('about.bioP2')}
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('about.bioP3')}
            </p>

            {/* Stats Grid */}
            <div className="about-stats-grid grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="about-stat fintech-card p-4"
                >
                  <div
                    className="text-2xl md:text-3xl font-bold font-mono"
                    style={{ color: 'var(--accent-teal)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trading Terminal Visual */}
          <div className="about-visual">
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              {/* Terminal header */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {t('about.terminalTitle')}
                </span>
              </div>

              {/* Terminal grid content — resembling a trading dashboard */}
              <div className="p-4 font-mono text-xs space-y-2 bg-fintech-grid" style={{ minHeight: '300px' }}>
                {/* Status indicators */}
                <div className="flex items-center gap-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: '#22c55e' }}>{t('about.terminalStatus')}</span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span style={{ color: 'var(--accent-teal)' }}>{t('about.terminalLatency')}</span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span style={{ color: 'var(--accent-blue)' }}>{t('about.terminalUptime')}</span>
                </div>

                {/* Mock command lines */}
                {t('about.terminalLines').map((line, i) => {
                  if (line.prefix === '→') return (
                    <div key={i} className={i > 0 && t('about.terminalLines')[i - 1]?.prefix !== '→' ? 'pt-2' : ''} style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--accent-teal)' }}>{line.prefix}</span> {line.text}
                    </div>
                  )
                  if (line.prefix === '✓') return (
                    <div key={i} style={{ color: '#22c55e' }}>{line.prefix} {line.text}</div>
                  )
                  return (
                    <div key={i} style={{ color: 'var(--accent-blue)' }}>
                      {line.prefix} {line.text}
                    </div>
                  )
                })}
                <div className="flex items-center gap-1 pt-1">
                  <span style={{ color: 'var(--accent-teal)' }}>$</span>
                  <span
                    className="inline-block w-2 h-4 animate-pulse"
                    style={{ background: 'var(--accent-teal)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
