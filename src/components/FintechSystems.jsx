'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

const SYSTEM_NODES = [
  { id: 'banks', icon: '🏦', color: 'var(--accent-teal)' },
  { id: 'aggregator', icon: '🔗', color: 'var(--accent-blue)' },
  { id: 'credit', icon: '💳', color: 'var(--accent-purple)' },
  { id: 'investment', icon: '📈', color: 'var(--accent-teal)' },
  { id: 'brokerage', icon: '📊', color: 'var(--accent-blue)' },
  { id: 'user', icon: '📱', color: 'var(--accent-purple)' },
]

export default function FintechSystems() {
  const { t } = useTranslation()
  const nodeTexts = t('fintechSystems.nodes')
  const systemNodes = SYSTEM_NODES.map((node, i) => ({ ...node, ...nodeTexts[i] }))

  const sectionRef = useRef(null)
  const nodesRef = useRef([])
  const [expandedNode, setExpandedNode] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.systems-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      // Stagger-animate each node
      gsap.from(nodesRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })

      // Animate connector lines
      gsap.from('.connector-line', {
        scaleX: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 50%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="systems"
      className="section-padding relative overflow-hidden"
    >
      {/* Background grid — darker purple with blurred edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(91,33,182,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(91,33,182,0.35) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="systems-title text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
            style={{ color: 'var(--accent-teal)', background: 'var(--glow-color)' }}
          >
            {t('fintechSystems.sectionLabel')}
          </span>
          <h2 className="heading-section mb-4">
            {t('fintechSystems.heading')}{' '}
            <span className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-blue)] bg-clip-text text-transparent">
              {t('fintechSystems.headingAccent')}
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            {t('fintechSystems.description')}
          </p>
        </div>

        {/* System Flow Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {systemNodes.map((node, idx) => (
            <div key={node.id} className="flex items-center">
              {/* Node Card */}
              <div
                ref={(el) => (nodesRef.current[idx] = el)}
                className="fintech-card p-4 cursor-pointer w-full text-center group relative"
                onClick={() =>
                  setExpandedNode(expandedNode === node.id ? null : node.id)
                }
              >
                {/* Glow dot */}
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse-slow"
                  style={{ background: node.color, boxShadow: `0 0 10px ${node.color}` }}
                />

                <div className="text-2xl mb-2">{node.icon}</div>
                <div
                  className="text-xs font-semibold tracking-wide"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {node.label}
                </div>

                {/* Pulse ring on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 20px ${node.color}20, 0 0 20px ${node.color}15`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Connector lines (visible on larger screens) */}
        <div className="hidden lg:flex justify-center items-center gap-0 -mt-4 mb-8 px-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div
                className="connector-line h-[2px] w-full origin-left"
                style={{
                  background: `linear-gradient(90deg, var(--accent-teal), var(--accent-blue))`,
                  opacity: 0.3,
                }}
              />
              <svg width="8" height="8" viewBox="0 0 8 8" className="flex-shrink-0 -ml-1">
                <polygon
                  points="0,0 8,4 0,8"
                  fill="var(--accent-teal)"
                  opacity="0.5"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Expanded Detail Panel */}
        {expandedNode && (
          <div className="fintech-card p-6 md:p-8 mt-4 animate-[scaleIn_0.3s_ease-out]">
            {(() => {
              const node = systemNodes.find((n) => n.id === expandedNode)
              return (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{node.icon}</span>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {node.label}
                      </h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {node.description}
                    </p>
                  </div>
                  <div>
                    <h4
                      className="text-sm font-semibold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--accent-teal)' }}
                    >
                      {t('fintechSystems.challengesTitle')}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {node.challenges}
                    </p>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </section>
  )
}
