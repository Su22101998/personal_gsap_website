'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import BookCallButton from '@/components/BookCallButton'
import BrandSwitch from '@/components/BrandSwitch'
import { BRAND_SWITCH_ENABLED } from '@/lib/brand'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Don't hide the bar until the visitor is past the top of the page
const HIDE_AFTER_PX = 400

/**
 * Minimal full-width navbar in the site's dot-matrix language: a dotted
 * wordmark, small uppercase links with a dot marking the active section,
 * the theme switch and the "Get in touch" CTA. Transparent over the top
 * of the page; once scrolled, clear "liquid glass" (blur only, no tint). Slides away while scrolling down and
 * returns on any scroll up (or when keyboard focus enters it). All colours
 * come from the stage/brand tokens. In-page links are plain anchors —
 * Lenis (SmoothScroll) handles the scroll.
 *
 * `data-native-cursor`: the custom cursor steps aside here for the
 * system pointer (see Cursor.jsx / globals.css).
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const navRef = useRef(null)
  const menuOpenRef = useRef(false)
  const showRef = useRef(() => {})

  const { t } = useTranslation()

  const NAV_LINKS = [
    { label: t('nav.manifesto'), href: '#manifesto' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.work'), href: '#work' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.studio'), href: '#studio' },
  ]

  useEffect(() => {
    menuOpenRef.current = isMobileMenuOpen
    if (isMobileMenuOpen) showRef.current()
  }, [isMobileMenuOpen])

  // Hide on scroll down, reveal on scroll up
  useGSAP(
    (context, contextSafe) => {
      const nav = navRef.current
      let hidden = false

      const setHidden = contextSafe((hide) => {
        if (hide === hidden) return
        hidden = hide
        gsap.to(nav, {
          yPercent: hide ? -110 : 0,
          duration: hide ? 0.45 : 0.7,
          ease: hide ? 'power3.in' : 'expo.out',
          overwrite: true,
        })
      })
      showRef.current = () => setHidden(false)

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (menuOpenRef.current) return
          setHidden(self.direction === 1 && self.scroll() > HIDE_AFTER_PX)
        },
      })
    },
    { scope: navRef }
  )

  // Track scroll position for the frosted state + active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Find the current section based on scroll position
      const navSections = NAV_LINKS.map((link) => link.href.slice(1))
      let currentSection = ''
      for (let i = navSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(navSections[i])
        if (el && el.getBoundingClientRect().top <= 200) {
          currentSection = navSections[i]
          break
        }
      }

      // If the matched section's bottom has scrolled above the
      // threshold, the user is past it — clear the highlight
      if (currentSection) {
        const el = document.getElementById(currentSection)
        if (el && el.getBoundingClientRect().bottom < 200) {
          currentSection = ''
        }
      }

      setActiveSection(currentSection)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setIsMobileMenuOpen(false)
  const frosted = isScrolled || isMobileMenuOpen

  return (
    <nav
      ref={navRef}
      data-native-cursor
      onFocusCapture={() => showRef.current()}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        // Liquid glass: no tint and no border — just the page behind it,
        // blurred and slightly saturated, so it never takes on a section colour
        background: 'transparent',
        backdropFilter: frosted ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: frosted ? 'blur(20px) saturate(180%)' : 'none',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 md:h-[72px] md:px-10">
        {/* Wordmark */}
        <a
          href="#home"
          onClick={closeMenu}
          className="focus-ring flex items-center gap-2.5"
          style={{ color: 'var(--fg)' }}
        >
          {/* Monogram — decorative, the wordmark beside it names the link */}
          <Image src="/brand/cyber-pears-logo.png" alt="" width={368} height={265} priority className="h-[26px] w-auto shrink-0 md:h-8" />
          <span className="heading-dot text-lg md:text-xl">{t('nav.brand')}</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="focus-ring group flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300"
                  style={{ color: isActive ? 'var(--fg)' : 'var(--fg-muted)' }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {/* Active marker: a single dot */}
                  <span
                    aria-hidden="true"
                    className={`h-1 w-1 rounded-full transition-[opacity,transform] duration-300 ${
                      isActive ? 'opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-60'
                    }`}
                    style={{ background: 'var(--accent)' }}
                  />
                  <span className="transition-colors duration-300 group-hover:[color:var(--fg)]">{link.label}</span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          {BRAND_SWITCH_ENABLED && <BrandSwitch />}
          <BookCallButton size="sm" />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus-ring flex h-9 w-9 items-center justify-center md:hidden"
          aria-label={t('nav.toggleMenu')}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="flex flex-col gap-1.5">
            <span
              className={`h-px w-5 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}
              style={{ background: 'var(--fg)' }}
            />
            <span
              className={`h-px w-5 transition-transform duration-300 ${isMobileMenuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`}
              style={{ background: 'var(--fg)' }}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-[max-height] duration-500 md:hidden ${
          isMobileMenuOpen ? 'max-h-[520px]' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1)
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="heading-dot flex items-center gap-3 py-2 text-3xl"
                style={{ color: isActive ? 'var(--fg)' : 'var(--fg-muted)' }}
              >
                {link.label}
              </a>
            )
          })}

          <div className="mt-5 flex flex-wrap items-center gap-4">
            {BRAND_SWITCH_ENABLED && <BrandSwitch />}
            <BookCallButton size="sm" onClick={closeMenu} />
          </div>
        </div>
      </div>
    </nav>
  )
}
