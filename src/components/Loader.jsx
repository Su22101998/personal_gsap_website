'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useTranslation } from '@/i18n'

/* =====================================================
   Fintech-themed loader shown while the app hydrates.
   
   All content starts at opacity: 0 in JSX and is revealed
   via gsap.to() — this prevents the server-rendered HTML
   from flashing visible before GSAP takes control.
   ===================================================== */

const LOADER_NODES = [
  { cx: 30, cy: 25 },
  { cx: 70, cy: 20 },
  { cx: 50, cy: 50 },
  { cx: 20, cy: 60 },
  { cx: 80, cy: 55 },
  { cx: 45, cy: 80 },
  { cx: 65, cy: 78 },
]

const LOADER_LINES = [
  [0, 2], [1, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 5], [4, 6], [0, 3], [1, 4],
]

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const progressRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const { t } = useTranslation()

  // Stable callback ref so GSAP doesn't re-run when parent re-renders
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const runLoader = useCallback(() => {
    const loader = loaderRef.current
    if (!loader) return

    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline()

      // Reveal logo (starts at opacity 0 in JSX)
      entranceTl.to('.loader-logo', {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
      })

      // Draw network lines
      entranceTl.to(
        '.loader-line',
        {
          opacity: 0.25,
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power2.out',
        },
        '-=0.4'
      )

      // Show nodes — opacity only (no scale to avoid SVG transform-origin issues)
      entranceTl.to(
        '.loader-node',
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
        },
        '-=0.6'
      )

      // Show brand text
      entranceTl.to(
        '.loader-brand',
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      )

      // Show progress area
      entranceTl.to(
        '.loader-progress-area',
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      )

      // Animate progress counter after entrance completes
      const counter = { val: 0 }
      entranceTl.to(counter, {
        val: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: () => {
          setProgress(Math.round(counter.val))
        },
        onComplete: () => {
          // Exit animation
          const exitTl = gsap.timeline({
            onComplete: () => onCompleteRef.current?.(),
          })

          exitTl
            .to('.loader-progress-bar-fill', {
              scaleX: 1.02,
              duration: 0.15,
              ease: 'power2.in',
            })
            .to('.loader-content', {
              y: -20,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.in',
            })
            .to(
              loader,
              {
                clipPath: 'inset(0 0 100% 0)',
                duration: 0.6,
                ease: 'power3.inOut',
              },
              '-=0.2'
            )
        },
      })
    }, loader)

    return ctx
  }, [])

  useEffect(() => {
    const ctx = runLoader()
    return () => ctx?.revert()
  }, [runLoader])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'var(--bg-primary)',
        clipPath: 'inset(0 0 0 0)',
      }}
    >
      <div className="loader-content flex flex-col items-center gap-8">
        {/* Animated network graphic — starts invisible */}
        <div className="loader-logo relative" style={{ opacity: 0, transform: 'scale(0.5)' }}>
          <svg
            width="140"
            height="100"
            viewBox="0 0 100 100"
            className="overflow-visible"
          >
            {/* Connection lines — start with dash offset so they "draw in" */}
            {LOADER_LINES.map(([from, to], i) => (
              <line
                key={`line-${i}`}
                className="loader-line"
                x1={LOADER_NODES[from].cx}
                y1={LOADER_NODES[from].cy}
                x2={LOADER_NODES[to].cx}
                y2={LOADER_NODES[to].cy}
                stroke="var(--accent-teal)"
                strokeWidth="0.5"
                opacity="0"
                strokeDasharray="100"
                strokeDashoffset="100"
              />
            ))}

            {/* Nodes — start invisible (opacity only, no CSS scale on SVG) */}
            {LOADER_NODES.map((node, i) => (
              <g
                key={`node-${i}`}
                className="loader-node"
                style={{ opacity: 0 }}
              >
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={i === 2 ? 6 : 3.5}
                  fill="var(--accent-teal)"
                  opacity="0.1"
                />
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={i === 2 ? 3 : 1.8}
                  fill={i === 2 ? 'var(--accent-teal)' : 'var(--accent-blue)'}
                  opacity="0.9"
                >
                  <animate
                    attributeName="opacity"
                    values="0.9;0.4;0.9"
                    dur={`${1.5 + i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}

            {/* Traveling particle */}
            <circle r="1.2" fill="var(--accent-teal)" opacity="0.8">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M30,25 L50,50 L80,55 L65,78 L50,50 L20,60 L30,25"
              />
            </circle>
          </svg>
        </div>

        {/* Logo text — starts invisible */}
        <div className="loader-brand flex items-center gap-2.5" style={{ opacity: 0, transform: 'translateY(10px)' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
            }}
          >
            {t('loader.logo')}
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('loader.brand')}
          </span>
        </div>

        {/* Progress bar — starts invisible */}
        <div className="loader-progress-area w-48 flex flex-col items-center gap-3" style={{ opacity: 0, transform: 'translateY(10px)' }}>
          <div
            className="w-full h-[2px] rounded-full overflow-hidden"
            style={{ background: 'var(--border-color)' }}
          >
            <div
              ref={progressRef}
              className="loader-progress-bar-fill h-full rounded-full origin-left transition-none"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-blue))',
              }}
            />
          </div>

          <div className="flex items-center justify-between w-full">
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              {progress < 30
                ? t('loader.initializing')
                : progress < 60
                  ? t('loader.loading')
                  : progress < 90
                    ? t('loader.connecting')
                    : t('loader.online')}
            </span>
            <span
              className="text-[10px] font-mono font-bold"
              style={{ color: 'var(--accent-teal)' }}
            >
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
