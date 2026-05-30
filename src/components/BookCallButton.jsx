'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useTranslation } from '@/i18n'

/**
 * Retro-styled "Book a Call" CTA button with a bottom-left 3D offset shadow.
 * Letters wave every 10 seconds for an eye-catching idle animation.
 * Automatically adapts to dark purple text when the page enters .white-active.
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
  const intervalRef = useRef(null)
  const [isLightTheme, setIsLightTheme] = useState(false)

  // Observe theme class changes on <html>
  useEffect(() => {
    const htmlEl = document.documentElement
    const checkTheme = () => setIsLightTheme(htmlEl.classList.contains('white-active'))
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(htmlEl, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const basePadding = isSmall ? 'px-5 py-2.5' : 'px-8 py-4'
  const fontSize = isSmall ? 'text-xs' : 'text-sm'
  const iconSize = isSmall ? 18 : 22

  useEffect(() => {
    const playWave = () => {
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
    }

    // Play once after a short delay, then every 10 seconds
    const initialTimeout = setTimeout(playWave, 2000)
    intervalRef.current = setInterval(playWave, 5000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <a
      href="#contact"
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 ${basePadding} ${fontSize} font-bold uppercase tracking-[0.15em] transition-all duration-200 ${className}`}
      style={{
        color: isLightTheme ? '#5b21b6' : '#c4b5fd',
        border: isLightTheme ? '1.5px solid #7c3aed' : '1.5px solid #8b5cf6',
        background: isLightTheme ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.06)',
        boxShadow: isLightTheme ? '-4px 4px 0 0 #7c3aed' : '-4px 4px 0 0 #8b5cf6',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isLightTheme ? 'rgba(139, 92, 246, 0.18)' : 'rgba(139, 92, 246, 0.15)'
        e.currentTarget.style.boxShadow = isLightTheme ? '-2px 2px 0 0 #7c3aed' : '-2px 2px 0 0 #8b5cf6'
        e.currentTarget.style.transform = 'translate(-2px, 2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isLightTheme ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.06)'
        e.currentTarget.style.boxShadow = isLightTheme ? '-4px 4px 0 0 #7c3aed' : '-4px 4px 0 0 #8b5cf6'
        e.currentTarget.style.transform = 'translate(0, 0)'
      }}
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
