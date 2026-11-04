'use client'

import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setPageStage } from '@/hooks/usePageTheme'
import { BASE, LIVE, href, isBuilt, nav } from './data'

gsap.registerPlugin(ScrollTrigger)

/* =====================================================
   Page transitions: a black curtain (orange leading edge) drops with the
   destination's title, the route changes behind it, then it lifts away.
   ===================================================== */

const TransitionContext = createContext({ go: null })

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Curtain({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const curtainRef = useRef(null)
  const labelRef = useRef(null)
  const covering = useRef(false)

  const go = useCallback(
    (to, label) => {
      if (reduce() || covering.current) return router.push(to)
      covering.current = true
      labelRef.current.textContent = label || ''
      gsap
        .timeline()
        .set(curtainRef.current, { yPercent: 100, visibility: 'visible' })
        .to(curtainRef.current, { yPercent: 0, duration: 0.6, ease: 'power4.inOut' })
        .fromTo(labelRef.current, { yPercent: 120 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, '-=0.25')
        .add(() => {
          // Hidden behind the curtain; Lenis syncs to native scroll jumps
          window.scrollTo(0, 0)
          router.push(to)
        })
    },
    [router]
  )

  // New route rendered behind the curtain: lift it
  useEffect(() => {
    if (!covering.current) return
    const tl = gsap
      .timeline({
        delay: 0.15,
        onComplete: () => {
          covering.current = false
          gsap.set(curtainRef.current, { visibility: 'hidden' })
          ScrollTrigger.refresh()
        },
      })
      .to(labelRef.current, { yPercent: -120, duration: 0.4, ease: 'power3.in' })
      .to(curtainRef.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '-=0.1')
    return () => tl.kill()
  }, [pathname])

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[#0a0a0a]"
        style={{ visibility: 'hidden', borderTop: '6px solid rgb(var(--rs-accent-rgb))' }}
      >
        <span className="overflow-hidden">
          <span ref={labelRef} className="rs-display block text-[clamp(2.5rem,7vw,6rem)] text-[#f2f0eb]" />
        </span>
      </div>
    </TransitionContext.Provider>
  )
}

/**
 * A link that respects the concept's folder structure: built pages navigate
 * inside the concept (with the curtain), everything else opens the live site.
 */
export function RLink({ path, to, label, className = '', children, ...rest }) {
  const { go } = useContext(TransitionContext)
  const target = to ?? href(path)
  const internal = to ? to.startsWith('/') : isBuilt(path)

  if (!internal) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link
      href={target}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !go) return
        e.preventDefault()
        go(target, label ?? (typeof children === 'string' ? children : ''))
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

/* ---------- Frame ---------- */

function ConceptBar() {
  return (
    <div className="relative z-40 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/10 bg-black px-5 py-2 text-[12px] text-white/60 md:px-8">
      <p>
        <span className="text-white">Concept makeover by Cyber Pears</span>
        <span className="hidden sm:inline"> · Not affiliated with Ross Simmonds</span>
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <RLink to={`${BASE}/url-map`} label="URL map" className="focus-ring hover:text-white">
          URL map
        </RLink>
        <a href={LIVE} target="_blank" rel="noopener noreferrer" className="focus-ring hover:text-white">
          Live site ↗
        </a>
      </div>
    </div>
  )
}

function Nav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 md:px-8">
        <RLink path="/" label="Ross Simmonds" className="focus-ring flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[#f2f0eb]">
          <span className="h-2 w-2 rounded-full bg-rs-accent" aria-hidden="true" />
          Ross Simmonds
        </RLink>
        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((n) => {
            const active = isBuilt(n.path) && pathname?.startsWith(href(n.path))
            return (
              <li key={n.path}>
                <RLink
                  path={n.path}
                  label={n.label}
                  className={`rs-mono focus-ring text-[11px] uppercase tracking-[0.12em] transition-colors hover:text-[#f2f0eb] ${active ? 'text-rs-accent' : 'text-white/55'}`}
                >
                  {n.label}
                  {!isBuilt(n.path) && <span aria-hidden="true"> ↗</span>}
                </RLink>
              </li>
            )
          })}
        </ul>
        <RLink path="/consulting/" label="Consulting" className="rs-btn rs-btn-orange">
          Work with me
        </RLink>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-5 pb-10 pt-20 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-display text-[15vw] leading-[0.85] tracking-[-0.04em] text-[#f2f0eb] md:text-[12vw]">
          Ross Simmonds<span className="text-rs-accent">.</span>
        </p>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-6 text-[13px] text-white/50">
          <ul className="flex flex-wrap gap-6">
            {[
              ['X', 'https://twitter.com/TheCoolestCool'],
              ['LinkedIn', 'https://www.linkedin.com/in/rosssimmonds/'],
              ['Instagram', 'https://www.instagram.com/thecoolestcool'],
            ].map(([l, u]) => (
              <li key={l}>
                <a href={u} target="_blank" rel="noopener noreferrer" className="focus-ring hover:text-white">
                  {l} ↗
                </a>
              </li>
            ))}
          </ul>
          <p>A concept by Cyber Pears. Content, photos and trademarks belong to Ross Simmonds.</p>
        </div>
      </div>
    </footer>
  )
}

export default function Shell({ className = '', children }) {
  useEffect(() => setPageStage('ink'), [])

  return (
    <div className={`rs min-h-screen bg-[#0a0a0a] text-[#f2f0eb] ${className}`}>
      <Curtain>
        <ConceptBar />
        <Nav />
        <main>{children}</main>
        <Footer />
      </Curtain>
    </div>
  )
}
