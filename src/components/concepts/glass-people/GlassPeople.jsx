'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { setPageStage } from '@/hooks/usePageTheme'
import { onIntroDone } from '@/lib/intro'
import AnimatedCounter from '@/components/AnimatedCounter'
import GlassSample from './GlassSample'
import Estimator from './Estimator'
import { company, estimate, facts, hero, nav, process, range, spaces, visit } from './content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
 * The Glass People — concept redesign (/work/glass-house).
 *
 * An unsolicited pitch by Cyber Pears for Mahaveer Glass House, Bengaluru.
 * Their products, listed prices and business facts are real; the design,
 * the live CSS glass and the estimator are the upgrade. Only the bar at the
 * top and the outro belong to Cyber Pears. The page is noindex.
 */

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ConceptBar() {
  return (
    <div className="relative z-30 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#0e2a2b] px-5 py-2.5 text-[12px] text-white/75 md:px-8">
      <p>
        <span className="font-semibold text-white">Concept redesign by Cyber Pears</span>
        <span className="hidden sm:inline"> · Not the official website of {company.legal}</span>
      </p>
      <div className="flex gap-5">
        <a href={company.currentSite} target="_blank" rel="noopener noreferrer" className="focus-ring underline-offset-4 hover:underline">
          Their current site ↗
        </a>
        <Link href="/#cases" className="focus-ring underline-offset-4 hover:underline">
          ← Back to work
        </Link>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      {/* Three offset panes */}
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <rect x="3" y="5" width="12" height="20" rx="2" fill="#9fd3cc" fillOpacity="0.7" />
        <rect x="9" y="3" width="12" height="20" rx="2" fill="#5fb3a8" fillOpacity="0.7" />
        <rect x="15" y="7" width="12" height="20" rx="2" fill="#0e2a2b" fillOpacity="0.85" />
      </svg>
      <span className="gp-display text-[22px] leading-none tracking-tight text-[#0e2a2b]">{company.brand}</span>
    </span>
  )
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-4 z-20 px-4 md:top-6 md:px-8">
      <nav className="gp-glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2">
        <a href="#gp-top" className="focus-ring rounded-full">
          <Logo />
        </a>
        <ul className="hidden items-center gap-7 text-[15px] font-medium text-[#0e2a2b] md:flex">
          {nav.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="focus-ring rounded-full px-1 transition-colors hover:text-[#2f7f74]">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={company.phoneHref} className="gp-btn gp-btn-dark px-5 py-2.5 text-[14px]">
          {company.phone}
        </a>
      </nav>
    </header>
  )
}

// Tall frosted panes: [left %, top %, width vw, height vh, depth]
const PANES = [
  [50, 16, 15, 66, 0.6],
  [61, 10, 13, 72, 1],
  [71, 20, 14, 60, 0.75],
  [81, 13, 12, 70, 1.25],
]

function Hero() {
  const ref = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      const panes = gsap.utils.toArray('.gp-hero-pane')
      if (reduceMotion()) return

      // Light blobs drift slowly behind the glass
      gsap.utils.toArray('.gp-blob').forEach((b, i) => {
        gsap.to(b, { xPercent: i % 2 ? -18 : 22, yPercent: i % 2 ? 14 : -16, duration: 9 + i * 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })

      // contextSafe + unsubscribe: if the hero remounts before the intro is
      // done, a stale callback would stack a second entrance on the first
      const stopWaiting = onIntroDone(
        contextSafe(() => {
          gsap.from('.gp-hero-line > span', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.09 })
          gsap.from('.gp-hero-pop', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.3 })
          gsap.from(panes, { yPercent: 30, opacity: 0, rotateY: -25, duration: 1.4, ease: 'expo.out', stagger: 0.1, delay: 0.1 })
        })
      )

      // Panes follow the pointer by depth
      const movers = panes.map((p) => ({
        x: gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3.out' }),
        y: gsap.quickTo(p, 'y', { duration: 0.9, ease: 'power3.out' }),
        depth: Number(p.dataset.depth),
      }))
      const onMove = (e) => {
        const x = e.clientX / window.innerWidth - 0.5
        const y = e.clientY / window.innerHeight - 0.5
        movers.forEach((m) => {
          m.x(x * 40 * m.depth)
          m.y(y * 26 * m.depth)
        })
      }
      window.addEventListener('pointermove', onMove)

      // On scroll the panes slide apart like partition doors (on their
      // inner wrappers, so the pointer parallax keeps working)
      gsap.to('.gp-hero-slide', {
        xPercent: (i) => (i < 2 ? -60 - i * 30 : 60 + (i - 2) * 30),
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.gp-hero-copy', { y: -80, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })

      return () => {
        stopWaiting()
        window.removeEventListener('pointermove', onMove)
      }
    },
    { scope: ref }
  )

  return (
    <section ref={ref} id="gp-top" className="relative h-[100svh] min-h-[680px] overflow-hidden bg-[#eef6f5]">
      {/* Light behind the glass */}
      <div className="absolute inset-0" aria-hidden="true">
        <span className="gp-blob absolute left-[48%] top-[8%] h-[46vw] w-[46vw] rounded-full bg-[#7fd1c5] opacity-70 blur-[80px]" />
        <span className="gp-blob absolute left-[66%] top-[44%] h-[34vw] w-[34vw] rounded-full bg-[#f2c879] opacity-60 blur-[90px]" />
        <span className="gp-blob absolute left-[30%] top-[52%] h-[30vw] w-[30vw] rounded-full bg-[#b9c8f5] opacity-50 blur-[90px]" />
        <div className="gp-grid absolute inset-0 opacity-60" />
      </div>

      {/* Frosted panes */}
      <div className="absolute inset-0 hidden [perspective:1200px] md:block" aria-hidden="true">
        {PANES.map(([l, t, w, h, d], i) => (
          <div
            key={i}
            className="gp-hero-pane absolute"
            data-depth={d}
            style={{ left: `${l}%`, top: `${t}%`, width: `${w}vw`, height: `${h}vh` }}
          >
            <div className="gp-hero-slide gp-glass gp-glass-edge h-full w-full rounded-[14px]" />
          </div>
        ))}
      </div>

      <div className="gp-hero-copy relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 pt-16 md:px-8">
        <p className="gp-hero-pop mb-5 w-fit rounded-full bg-white/70 px-4 py-1.5 text-[13px] font-medium text-[#0e2a2b] backdrop-blur">
          {hero.eyebrow}
        </p>
        <h1 className="gp-display max-w-[13ch] text-[clamp(3rem,7.4vw,6.4rem)] leading-[0.95] tracking-[-0.02em] text-[#0e2a2b]">
          {hero.title.map((line, i) => (
            <span key={line} className="gp-hero-line block overflow-hidden pb-[0.06em]">
              <span className={`inline-block ${i === 1 ? 'italic text-[#2f7f74]' : ''}`}>{line}</span>
            </span>
          ))}
        </h1>
        <p className="gp-hero-pop mt-6 max-w-md text-[17px] leading-relaxed text-[#0e2a2b]/75">{hero.sub}</p>
        <div className="gp-hero-pop mt-8 flex flex-wrap gap-3">
          <a href="#gp-estimate" className="gp-btn gp-btn-dark">
            {hero.primary}
          </a>
          <a href="#gp-range" className="gp-btn gp-btn-glass">
            {hero.secondary}
          </a>
        </div>
      </div>
    </section>
  )
}

function Heading({ eyebrow, title, body, light = false, center = false }) {
  return (
    <div className={`mb-12 md:mb-16 ${center ? 'mx-auto text-center' : ''} max-w-2xl`}>
      <p className={`mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] ${light ? 'text-[#9fd3cc]' : 'text-[#2f7f74]'}`}>{eyebrow}</p>
      <h2 className={`gp-display text-[clamp(2.4rem,5vw,4rem)] leading-[1] tracking-[-0.02em] ${light ? 'text-white' : 'text-[#0e2a2b]'}`}>{title}</h2>
      {body && <p className={`mt-5 text-[17px] leading-relaxed ${light ? 'text-white/70' : 'text-[#0e2a2b]/70'}`}>{body}</p>}
    </div>
  )
}

const rise = (targets, trigger, extra = {}) =>
  gsap.from(targets, {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger, start: 'top 80%', once: true },
    ...extra,
  })

function Range() {
  const ref = useRef(null)
  useGSAP(() => !reduceMotion() && rise('.gp-range-card', ref.current), { scope: ref })
  return (
    <section ref={ref} id="gp-range" className="bg-[#eef6f5] px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Heading eyebrow={range.eyebrow} title={range.title} body={range.body} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {range.items.map((item) => (
            <li key={item.kind} className="gp-range-card">
              <article className="group flex h-full flex-col rounded-[22px] bg-white p-3 shadow-[0_20px_40px_-28px_rgb(14_42_43/0.35)]">
                <GlassSample kind={item.kind} className="aspect-[4/3]" />
                <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                  <h3 className="text-[17px] font-semibold text-[#0e2a2b]">{item.name}</h3>
                  <p className="mt-1 text-[14px] text-[#0e2a2b]/60">{item.note}</p>
                  <p className="mt-auto pt-4 text-[14px] text-[#0e2a2b]">
                    {item.price ? (
                      <>
                        From <span className="font-semibold">₹{item.price}</span>
                        <span className="text-[#0e2a2b]/60"> / {item.unit}</span>
                      </>
                    ) : (
                      <span className="text-[#0e2a2b]/60">Price on request</span>
                    )}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Spaces() {
  const ref = useRef(null)
  useGSAP(() => !reduceMotion() && rise('.gp-space', ref.current, { y: 80 }), { scope: ref })
  return (
    <section ref={ref} id="gp-spaces" className="relative overflow-hidden bg-[#0e2a2b] px-5 py-28 md:px-8 md:py-36">
      <div className="absolute inset-0" aria-hidden="true">
        <span className="absolute -left-[10%] top-[10%] h-[40vw] w-[40vw] rounded-full bg-[#2f7f74] opacity-50 blur-[100px]" />
        <span className="absolute right-[-5%] bottom-[0%] h-[34vw] w-[34vw] rounded-full bg-[#c9963e] opacity-30 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <Heading eyebrow={spaces.eyebrow} title={spaces.title} light />
        <ul className="grid gap-5 md:grid-cols-2">
          {spaces.items.map((s, i) => (
            <li key={s.title} className="gp-space">
              <div className="gp-glass-dark h-full rounded-[24px] p-8 transition-transform duration-500 hover:-translate-y-1 md:p-10">
                <p className="gp-display text-5xl text-[#9fd3cc]/40">0{i + 1}</p>
                <h3 className="gp-display mt-6 text-3xl text-white">{s.title}</h3>
                <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-white/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Process() {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reduceMotion()) return
      gsap.from('.gp-beam', {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
      })
      rise('.gp-step', ref.current)
    },
    { scope: ref }
  )
  return (
    <section ref={ref} className="bg-[#eef6f5] px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Heading eyebrow={process.eyebrow} title={process.title} />
        <div className="relative">
          <div className="absolute left-0 right-0 top-[18px] hidden h-[2px] bg-[#0e2a2b]/10 md:block" aria-hidden="true">
            <div className="gp-beam h-full w-full bg-gradient-to-r from-[#9fd3cc] via-[#2f7f74] to-[#f2c879]" />
          </div>
          <ol className="grid gap-10 md:grid-cols-3">
            {process.steps.map((s, i) => (
              <li key={s.title} className="gp-step relative">
                <span className="gp-glass gp-glass-edge relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-[#0e2a2b]">
                  {i + 1}
                </span>
                <h3 className="gp-display mt-6 text-3xl text-[#0e2a2b]">{s.title}</h3>
                <p className="mt-2 max-w-xs text-[16px] leading-relaxed text-[#0e2a2b]/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <dl className="mt-20 grid gap-6 border-t border-[#0e2a2b]/10 pt-10 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-[13px] uppercase tracking-[0.14em] text-[#0e2a2b]/60">{f.label}</dt>
              <dd className="gp-display text-5xl text-[#0e2a2b]">
                {f.value > 1000 ? f.value : <AnimatedCounter value={f.value} suffix={f.suffix} />}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Estimate() {
  return (
    <section id="gp-estimate" className="relative overflow-hidden bg-[#dcefec] px-5 py-28 md:px-8 md:py-36">
      <div className="absolute inset-0" aria-hidden="true">
        <span className="absolute left-[55%] top-[5%] h-[36vw] w-[36vw] rounded-full bg-[#9fd3cc] opacity-70 blur-[90px]" />
        <span className="absolute left-[5%] bottom-[0%] h-[30vw] w-[30vw] rounded-full bg-[#f2c879] opacity-40 blur-[90px]" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <Heading eyebrow={estimate.eyebrow} title={estimate.title} body={estimate.body} />
        <Estimator />
      </div>
    </section>
  )
}

function Visit() {
  return (
    <section id="gp-visit" className="bg-[#eef6f5] px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-6xl items-end gap-10 md:grid-cols-2">
        <Heading eyebrow={visit.eyebrow} title={visit.title} />
        <div className="gp-glass gp-glass-edge rounded-[28px] p-8 md:mb-16 md:p-10">
          <address className="not-italic">
            <p className="gp-display text-3xl text-[#0e2a2b]">{company.legal}</p>
            {company.address.map((l) => (
              <p key={l} className="mt-1 text-[16px] text-[#0e2a2b]/75">
                {l}
              </p>
            ))}
            <p className="mt-4 text-[14px] text-[#0e2a2b]/60">{visit.hours}</p>
          </address>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={company.phoneHref} className="gp-btn gp-btn-dark">
              {visit.call} · {company.phone}
            </a>
            <a href={company.mapsHref} target="_blank" rel="noopener noreferrer" className="gp-btn gp-btn-glass">
              {visit.directions} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0e2a2b] px-5 pb-10 pt-20 text-white md:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8">
        <div>
          <p className="gp-display text-[clamp(3rem,9vw,7rem)] leading-none tracking-[-0.02em]">{company.brand}</p>
          <p className="mt-4 text-white/60">
            {company.legal} · GST {company.gst}
          </p>
        </div>
        <ul className="flex flex-wrap gap-6 text-[15px] text-white/75">
          {nav.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="focus-ring rounded hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

function Outro() {
  return (
    <div className="bg-black px-5 py-10 text-center text-[13px] text-white/60 md:px-8">
      <p>
        A concept redesign by <span className="text-white">Cyber Pears</span>, shared as a proposal. Products, prices and business details are from{' '}
        {company.legal}&rsquo;s current listing.
      </p>
      <Link href="/#cases" className="focus-ring mt-3 inline-block text-white underline-offset-4 hover:underline">
        ← Back to Cyber Pears
      </Link>
    </div>
  )
}

export default function GlassPeople({ className = '' }) {
  useEffect(() => setPageStage('paper'), [])
  useEffect(() => onIntroDone(() => ScrollTrigger.refresh()), [])

  return (
    <main className={`min-h-screen bg-[#eef6f5] font-gp text-[#0e2a2b] ${className}`}>
      <ConceptBar />
      <div className="relative">
        <Nav />
        <Hero />
      </div>
      <Range />
      <Spaces />
      <Process />
      <Estimate />
      <Visit />
      <Footer />
      <Outro />
    </main>
  )
}
