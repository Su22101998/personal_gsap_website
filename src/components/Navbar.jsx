'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import BookCallButton from '@/components/BookCallButton'
import { useTranslation } from '@/i18n'

/**
 * Fixed navbar with frosted-glass effect and "Book a Call" CTA.
 * Adapts colors when the page enters the white-active theme.
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isLightTheme, setIsLightTheme] = useState(false)
  const navRef = useRef(null)

  const { t } = useTranslation()

  const NAV_LINKS = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.systems'), href: '#systems' },
    { label: t('nav.work'), href: '#work' },
    { label: t('nav.caseStudies'), href: '#cases' },
    { label: t('nav.skills'), href: '#skills' },
    { label: t('nav.about'), href: '#about' },
  ]

  // Observe theme class changes on <html> to adapt navbar colors
  useEffect(() => {
    const htmlEl = document.documentElement
    const checkTheme = () => setIsLightTheme(htmlEl.classList.contains('white-active'))
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(htmlEl, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Track scroll position for shrink effect + active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Detect active section, but clear highlight when scrolled
      // past all nav sections into contact/footer territory
      const navSections = NAV_LINKS.map((link) => link.href.slice(1))

      // Find the current section based on scroll position
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
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <nav
      ref={navRef}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-2xl ${
        isScrolled ? 'py-3.5 px-6' : 'py-4 px-6'
      }`}
      style={{
        background: isLightTheme
          ? 'rgba(248, 250, 252, 0.75)'
          : 'rgba(3, 7, 18, 0.55)',
        border: isLightTheme
          ? '1px solid rgba(0, 0, 0, 0.06)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: isLightTheme
          ? '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          : '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        width: 'max-content',
        maxWidth: '96vw',
      }}
    >
      <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-2 font-bold text-lg tracking-tight transition-colors duration-500"
          style={{ color: isLightTheme ? '#0f172a' : '#f8fafc', marginRight: 40 }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
          >
            {t('nav.logo')}
          </div>
          <span className="hidden sm:inline">{t('nav.brand')}</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                activeSection === link.href.slice(1)
                  ? 'font-medium'
                  : 'hover:opacity-80'
              }`}
              style={{
                color:
                  activeSection === link.href.slice(1)
                    ? (isLightTheme ? '#7c3aed' : '#a78bfa')
                    : (isLightTheme ? '#475569' : '#94a3b8'),
                background:
                  activeSection === link.href.slice(1)
                    ? (isLightTheme ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.1)')
                    : 'transparent',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Book a Call CTA */}
        <BookCallButton
          size="sm"
          className="hidden md:inline-flex"
          style={{ marginLeft: 40, position: 'relative', top: -2 }}
          onClick={(e) => handleNavClick(e, '#contact')}
        />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center ml-2"
          style={{
            background: isLightTheme ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)',
            border: isLightTheme ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.08)',
          }}
          aria-label={t('nav.toggleMenu')}
        >
          <div className="flex flex-col gap-1">
            <span
              className={`w-4 h-0.5 transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''
              }`}
              style={{ background: isLightTheme ? '#0f172a' : '#f8fafc' }}
            />
            <span
              className={`w-4 h-0.5 transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''
              }`}
              style={{ background: isLightTheme ? '#0f172a' : '#f8fafc' }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          isMobileMenuOpen
            ? `max-h-[500px] mt-3 pt-3 border-t ${isLightTheme ? 'border-black/[0.06]' : 'border-white/[0.06]'}`
            : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-2.5 rounded-lg text-sm transition-all duration-300"
              style={{
                color:
                  activeSection === link.href.slice(1)
                    ? (isLightTheme ? '#7c3aed' : '#a78bfa')
                    : (isLightTheme ? '#475569' : '#94a3b8'),
                background:
                  activeSection === link.href.slice(1)
                    ? (isLightTheme ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.1)')
                    : 'transparent',
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="mx-2 mt-2 mb-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)',
            }}
          >
            {t('nav.bookCall')}
          </a>
        </div>
      </div>
    </nav>
  )
}
