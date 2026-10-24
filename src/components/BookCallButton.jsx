'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(useGSAP)

/**
 * Retro-styled CTA button with a bottom-left 3D offset shadow.
 * Letters wave every 5 seconds for an eye-catching idle animation.
 * Colours and hover come from `.btn-retro` (stage/brand tokens).
 *
 * @param {'sm' | 'md'} size  — 'sm' for navbar, 'md' for hero (default)
 * @param {string}       className — extra classes merged onto the wrapper <a>
 * @param {object}       style — extra inline styles merged onto the wrapper <a>
 * @param {function}     onClick — optional click handler
 */
export default function BookCallButton({ size = 'md', className = '', style = {}, onClick }) {
  const { t } = useTranslation()
  const LABEL = t('bookCallButton.label')
  const isSmall = size === 'sm'
  const lettersRef = useRef([])

  const basePadding = isSmall ? 'px-5 py-2.5' : 'px-8 py-4'
  const fontSize = isSmall ? 'text-xs' : 'text-sm'
  const iconSize = isSmall ? 18 : 22

  useGSAP((context, contextSafe) => {
    // contextSafe: tweens created later from timers are still reverted on unmount
    const playWave = contextSafe(() => {
      const letters = lettersRef.current.filter(Boolean)
      if (!letters.length) return

      // Each letter exits upward, then re-enters from below
      letters.forEach((letter, i) => {
        const delay = i * 0.03

        const tl = gsap.timeline({ delay })
        // Exit: slide up and out
        tl.to(letter, {
          y: '-110%',
          duration: 0.2,
          ease: 'power2.in',
        })
        // Snap to below
        .set(letter, { y: '110%' })
        // Re-enter: slide up into place
        .to(letter, {
          y: '0%',
          duration: 0.2,
          ease: 'power2.out',
        })
      })
    })

    // Play once after a short delay, then every 5 seconds — never for
    // reduced-motion users (an endlessly repeating animation)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const initialTimeout = setTimeout(playWave, 2000)
    const interval = setInterval(playWave, 5000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  })

  return (
    <a
      href="#contact"
      onClick={onClick}
      className={`btn-retro group inline-flex items-center gap-2.5 ${basePadding} ${fontSize} font-bold uppercase tracking-[0.15em] ${className}`}
      style={style}
    >
      <span className="relative z-10 inline-flex overflow-hidden">
        {LABEL.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => { lettersRef.current[i] = el }}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
          >
            {char}
          </span>
        ))}
      </span>
      <svg
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  )
}
