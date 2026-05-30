'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

/* =====================================================
   Skills Section — Interactive System Architecture Map
   
   Floating skill nodes connected like a neural network.
   Hovering highlights related skills and connections.
   ===================================================== */

const SKILLS = [
  { id: 'uiux', x: 50, y: 20, size: 'lg', related: ['systems', 'dataviz', 'mobile', 'design'] },
  { id: 'systems', x: 25, y: 35, size: 'lg', related: ['uiux', 'api', 'analytics'] },
  { id: 'api', x: 75, y: 35, size: 'md', related: ['systems', 'dataviz', 'mobile'] },
  { id: 'dataviz', x: 40, y: 55, size: 'md', related: ['uiux', 'api', 'analytics'] },
  { id: 'mobile', x: 65, y: 60, size: 'md', related: ['uiux', 'api', 'design'] },
  { id: 'analytics', x: 20, y: 70, size: 'sm', related: ['systems', 'dataviz'] },
  { id: 'design', x: 80, y: 75, size: 'sm', related: ['uiux', 'mobile'] },
]

// Build all connections from the skills data
const CONNECTIONS = []
SKILLS.forEach((skill) => {
  skill.related.forEach((relatedId) => {
    const existingConnection = CONNECTIONS.find(
      (c) =>
        (c.from === skill.id && c.to === relatedId) ||
        (c.from === relatedId && c.to === skill.id)
    )
    if (!existingConnection) {
      CONNECTIONS.push({ from: skill.id, to: relatedId })
    }
  })
})

const sizeMap = { lg: 'w-28 h-28 md:w-36 md:h-36', md: 'w-24 h-24 md:w-28 md:h-28', sm: 'w-20 h-20 md:w-24 md:h-24' }
const textSizeMap = { lg: 'text-xs md:text-sm', md: 'text-[10px] md:text-xs', sm: 'text-[9px] md:text-[10px]' }

export default function Skills() {
  const { t } = useTranslation()
  const skillLabels = t('skills.labels')
  const skillsData = SKILLS.map((skill, i) => ({ ...skill, label: skillLabels[i] }))

  const sectionRef = useRef(null)
  const mapRef = useRef(null)
  const [hoveredSkill, setHoveredSkill] = useState(null)

  const isRelated = (skillId) => {
    if (!hoveredSkill) return false
    const hovered = SKILLS.find((s) => s.id === hoveredSkill)
    return hovered?.related.includes(skillId) || skillId === hoveredSkill
  }

  const isConnectionHighlighted = (conn) => {
    if (!hoveredSkill) return false
    return conn.from === hoveredSkill || conn.to === hoveredSkill
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      gsap.from('.skill-node', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: mapRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-fintech-grid opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="skills-title text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
            style={{ color: 'var(--accent-teal)', background: 'var(--glow-color)' }}
          >
            {t('skills.sectionLabel')}
          </span>
          <h2 className="heading-section mb-4">
            {t('skills.heading')}{' '}
            <span className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-blue)] bg-clip-text text-transparent">
              {t('skills.headingAccent')}
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            {t('skills.description')}
          </p>
        </div>

        {/* Interactive Node Map */}
        <div
          ref={mapRef}
          className="relative w-full h-[400px] md:h-[500px] lg:h-[550px]"
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {CONNECTIONS.map((conn, i) => {
              const fromSkill = SKILLS.find((s) => s.id === conn.from)
              const toSkill = SKILLS.find((s) => s.id === conn.to)
              if (!fromSkill || !toSkill) return null

              const highlighted = isConnectionHighlighted(conn)

              return (
                <line
                  key={i}
                  x1={`${fromSkill.x}%`}
                  y1={`${fromSkill.y}%`}
                  x2={`${toSkill.x}%`}
                  y2={`${toSkill.y}%`}
                  stroke={highlighted ? 'var(--accent-teal)' : 'var(--border-color)'}
                  strokeWidth={highlighted ? 2 : 1}
                  opacity={hoveredSkill ? (highlighted ? 0.8 : 0.15) : 0.3}
                  style={{ transition: 'all 0.3s ease' }}
                />
              )
            })}
          </svg>

          {/* Skill Nodes */}
          {skillsData.map((skill) => {
            const isActive = isRelated(skill.id)
            const isDimmed = hoveredSkill && !isActive

            return (
              <div
                key={skill.id}
                className={`skill-node absolute ${sizeMap[skill.size]} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300`}
                style={{
                  left: `${skill.x}%`,
                  top: `${skill.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: isActive ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  border: `1px solid ${isActive ? 'var(--accent-teal)' : 'var(--border-color)'}`,
                  opacity: isDimmed ? 0.3 : 1,
                  boxShadow: isActive ? '0 0 30px var(--glow-color)' : 'none',
                  zIndex: 1,
                }}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <span
                  className={`${textSizeMap[skill.size]} font-semibold text-center px-2 leading-tight`}
                  style={{ color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)' }}
                >
                  {skill.label}
                </span>

                {/* Pulse ring when hovered */}
                {skill.id === hoveredSkill && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      border: '1px solid var(--accent-teal)',
                      opacity: 0.3,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
