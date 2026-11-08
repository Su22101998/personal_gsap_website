'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import { Count, Endorsers, Logo, Newsletter, SplitHeading, reduce, useRise } from './shared'
import { consulting as c } from './data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const QUESTION = 'Which agency should a B2B SaaS brand hire to win in AI search?'
const ANSWER = 'Based on recent coverage and citations, the strongest option for your category is '

/* Hero: an AI answer types itself out and names "your brand" */
function Hero() {
  const ref = useRef(null)
  useGSAP(
    () => {
      const q = ref.current.querySelector('.rs-ai-q')
      const a = ref.current.querySelector('.rs-ai-a')
      if (reduce()) return
      const typed = { q: 0, a: 0 }
      gsap
        .timeline({ delay: 0.6 })
        .to(typed, { q: QUESTION.length, duration: 1.4, ease: 'none', onUpdate: () => (q.textContent = QUESTION.slice(0, Math.round(typed.q))) })
        .from('.rs-ai-answer', { opacity: 0, y: 12, duration: 0.4 }, '+=0.3')
        .to(typed, { a: ANSWER.length, duration: 1.8, ease: 'none', onUpdate: () => (a.textContent = ANSWER.slice(0, Math.round(typed.a))) })
        .from('.rs-ai-brand', { opacity: 0, scale: 0.6, duration: 0.5, ease: 'back.out(2.4)' })
        .from('.rs-ai-cite', { opacity: 0, y: 8, duration: 0.4, stagger: 0.12 })
      gsap.from('.rs-c-fade', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.5 })
    },
    { scope: ref }
  )
  return (
    <section ref={ref} className="px-5 pb-20 pt-16 md:px-8 md:pt-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="rs-label rs-c-fade mb-8">Private advisory · AI search</p>
          {/* Preserves the live page's H1 */}
          <SplitHeading as="h1" immediate className="rs-display text-[clamp(2.6rem,6.4vw,6.2rem)] leading-[0.92]">
            Advisory for marketing leaders who need to win in <span className="rs-serif text-rs-accent">AI search.</span>
          </SplitHeading>
          <p className="rs-c-fade mt-8 max-w-lg text-[18px] leading-relaxed text-white/70">
            Your buyers ask an AI assistant before they ever visit your site. Ross works with CMOs to make sure the answer names your brand, with a strategy your team can start on Monday.
          </p>
          <div className="rs-c-fade mt-10 flex flex-wrap gap-3">
            <RLink path="/contact-ross/" className="rs-btn rs-btn-orange">
              Request availability ↗
            </RLink>
            <a href="#offers" className="rs-btn rs-btn-ghost">
              Three ways to work together
            </a>
          </div>
        </div>

        {/* The AI answer */}
        <div className="rs-c-fade rounded-[16px] border border-white/10 bg-[#111] p-6 shadow-[0_40px_80px_-40px_rgb(var(--rs-accent-rgb)/0.35)] md:p-8" aria-hidden="true">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="rs-mono ml-3 text-[11px] uppercase tracking-[0.14em] text-white/40">AI assistant</span>
          </div>
          <p className="mt-6 rounded-[10px] bg-white/5 px-4 py-3 text-[15px] text-white/85">
            <span className="rs-ai-q">{QUESTION}</span>
            <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] animate-pulse bg-rs-accent" />
          </p>
          <div className="rs-ai-answer mt-5 text-[16px] leading-relaxed text-white/75">
            <span className="rs-ai-a">{ANSWER}</span>
            <span className="rs-ai-brand inline-block rounded-md bg-rs-accent px-2 py-0.5 font-semibold text-[#0a0a0a]">your brand</span>.
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {['G2 review', 'Reddit thread', 'Industry report'].map((s, i) => (
              <span key={s} className="rs-ai-cite rs-mono rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-white/55">
                [{i + 1}] {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-[1400px] border-t border-white/10 pt-8">
        <p className="rs-label mb-5">Advised teams at</p>
        <ul className="flex flex-wrap items-center gap-x-14 gap-y-8">
          {c.clients.map((cl) => (
            <li key={cl}>
              <Logo id={cl} size={32} className="opacity-60 transition-opacity duration-300 hover:opacity-100" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Shift() {
  const ref = useRef(null)
  useRise(ref, '.rs-cred', { y: 24 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SplitHeading className="rs-display text-[clamp(2.2rem,4.8vw,4.4rem)] leading-[0.98]">{c.shift.title}</SplitHeading>
          <p className="mt-8 max-w-xl text-[18px] leading-relaxed text-white/65">{c.shift.body}</p>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-[10px]">
          <Image src="/work/ross-simmonds/keynote-data-chart.jpg" alt="Ross Simmonds presenting data on stage" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
        </div>
      </div>
      <ul className="mx-auto mt-12 grid max-w-[1400px] gap-px overflow-hidden rounded-[10px] border border-white/10 bg-white/10 sm:grid-cols-3">
        {c.shift.creds.map((cr) => (
          <li key={cr} className="rs-cred bg-[#0a0a0a] p-6 text-[15px] text-white/75">
            {cr}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Results() {
  const ref = useRef(null)
  useRise(ref, '.rs-result', { y: 40 })
  return (
    <section ref={ref} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">Results</p>
        <SplitHeading className="rs-display mb-14 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Numbers from engines Ross and his team built.</SplitHeading>
        <dl className="grid gap-px overflow-hidden rounded-[14px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {c.results.map((r) => (
            <div key={r.label + r.who} className="rs-result flex flex-col-reverse items-center justify-end bg-[#0a0a0a] p-8 text-center md:p-10">
              <dt className="mt-3">
                <span className="block text-[16px] text-white/80">{r.label}</span>
                <span className="rs-label">{r.who}</span>
              </dt>
              <dd className="rs-display text-[clamp(3rem,5vw,4.6rem)] leading-none text-rs-accent">
                <Count value={r.value} prefix={r.prefix} suffix={r.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <a href="https://foundationinc.co" target="_blank" rel="noopener noreferrer" className="rs-mono mt-6 inline-block text-[12px] uppercase tracking-[0.14em] text-white/55 hover:text-rs-accent">
          Browse every case study on foundationinc.co ↗
        </a>
      </div>
    </section>
  )
}

function Fit() {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reduce()) return
      gsap.from('.rs-fit-yes', { x: -80, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } })
      gsap.from('.rs-fit-no', { x: 80, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } })
    },
    { scope: ref }
  )
  const Col = ({ cls, title, items, mark, tone }) => (
    <div className={`${cls} rounded-[14px] border p-8 md:p-10 ${tone}`}>
      <h3 className="rs-display text-[1.8rem]">{title}</h3>
      <ul className="mt-6 space-y-4">
        {items.map((it) => (
          <li key={it} className="flex gap-4 text-[16px]">
            <span className="rs-mono shrink-0" aria-hidden="true">{mark}</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <section ref={ref} className="overflow-hidden border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <SplitHeading className="rs-display mb-14 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">This works best when…</SplitHeading>
        <div className="grid gap-5 md:grid-cols-2">
          <Col cls="rs-fit-yes" title="You're a good fit if" items={c.fit.yes} mark="✓" tone="border-rs-accent/40 bg-rs-accent/[0.06] text-white/85" />
          <Col cls="rs-fit-no" title="Probably not a fit if" items={c.fit.no} mark="✕" tone="border-white/10 bg-[#111] text-white/55" />
        </div>
      </div>
    </section>
  )
}

function Offers() {
  const ref = useRef(null)
  // Cards land with a small bounce
  useRise(ref, '.rs-offer', { y: 70, duration: 1.1, ease: 'back.out(1.8)' })
  return (
    <section ref={ref} id="offers" className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">Engagements</p>
        <SplitHeading className="rs-display mb-4 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95]">Pick the depth you need.</SplitHeading>
        <p className="mb-14 text-white/60">Every engagement starts with a 30-minute discovery call.</p>
        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {c.offers.map((o) => (
            // Outer wrapper rises in (GSAP); the article carries the springy hover lift (CSS).
            // All three sit on one line at one height.
            <div key={o.name} className="rs-offer flex">
            <article
              className={`rs-offer-card relative flex flex-1 flex-col rounded-[16px] border p-8 md:p-10 ${o.popular ? 'border-rs-accent bg-rs-accent text-[#0a0a0a]' : 'border-white/10 bg-[#111]'}`}
            >
              {o.popular && <span className="rs-mono absolute right-6 top-6 rounded-full bg-[#0a0a0a] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-rs-accent">Most popular</span>}
              <h3 className={`rs-display max-w-[14ch] text-[1.9rem] leading-[1.05] ${o.popular ? 'pr-20' : ''}`}>{o.name}</h3>
              <p className={`rs-mono mt-4 text-[13px] uppercase tracking-[0.12em] ${o.popular ? 'text-black/70' : 'text-rs-accent'}`}>{o.price}</p>
              <ul className={`mb-10 mt-8 space-y-3 border-t pt-6 text-[15px] ${o.popular ? 'border-black/20 text-black/80' : 'border-white/10 text-white/70'}`}>
                {o.points.map((p) => (
                  <li key={p}>— {p}</li>
                ))}
              </ul>
              <RLink
                path={o.path}
                label="Keynotes"
                className={`rs-btn mt-auto w-fit ${o.popular ? 'bg-[#0a0a0a] text-[#f2f0eb] hover:bg-[#f2f0eb] hover:text-[#0a0a0a]' : 'rs-btn-ghost'}`}
              >
                {o.cta} →
              </RLink>
            </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reduce()) return
      gsap.from('.rs-proc-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: { trigger: ref.current.querySelector('ol'), start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
      })
      gsap.utils.toArray('.rs-proc-step').forEach((s) =>
        gsap.from(s, { opacity: 0.2, x: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 75%', toggleActions: 'play none none reverse' } })
      )
    },
    { scope: ref }
  )
  return (
    // overflow-x: clip (not hidden) hides the steps' slide-in offset without
    // breaking the sticky heading beside them
    <section ref={ref} className="overflow-x-clip border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="rs-label mb-6">Process</p>
          <SplitHeading className="rs-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">Four steps from first call to kickoff.</SplitHeading>
          <RLink path="/contact-ross/" className="rs-btn rs-btn-orange mt-10">
            Start with the discovery call ↗
          </RLink>
        </div>
        <ol className="relative pl-10">
          <span className="absolute bottom-0 left-[7px] top-0 w-px bg-white/10" aria-hidden="true">
            <span className="rs-proc-line absolute inset-0 bg-rs-accent" />
          </span>
          {c.process.map((p, i) => (
            <li key={p.title} className="rs-proc-step relative pb-16 last:pb-0">
              <span className="absolute -left-10 top-1 h-[15px] w-[15px] rounded-full border-2 border-rs-accent bg-[#0a0a0a]" aria-hidden="true" />
              <span className="rs-mono text-[12px] text-white/40">Step 0{i + 1}</span>
              <h3 className="rs-display mt-2 text-[2rem]">{p.title}</h3>
              <p className="mt-2 max-w-md text-[16px] text-white/65">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_1.5fr]">
        <SplitHeading className="rs-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">Before you reach out</SplitHeading>
        {/* Native <details>: every answer is in the HTML for search engines */}
        <div className="border-t border-white/15">
          {c.faq.map((f) => (
            <details key={f.q} className="rs-faq group border-b border-white/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[19px] text-white/90 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="rs-mono text-rs-accent transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-xl pb-6 text-[16px] leading-relaxed text-white/60">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-rs-accent px-5 py-28 text-[#0a0a0a] md:px-8 md:py-40">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-10">
        <SplitHeading className="rs-display rs-to-baseline max-w-3xl text-[clamp(3rem,7vw,7rem)] leading-[0.9] [--rs-lh:0.9]">Ready to talk?</SplitHeading>
        <div className="max-w-sm">
          <p className="text-[18px] text-black/75">One 30-minute call to decide whether this is the right move.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <RLink path="/contact-ross/" className="rs-btn bg-[#0a0a0a] text-[#f2f0eb] hover:bg-[#f2f0eb] hover:text-[#0a0a0a]">
              Request availability ↗
            </RLink>
            <RLink path="/keynotes/" label="Keynotes" className="rs-btn border border-black/30 hover:bg-black/10">
              Book a keynote instead
            </RLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Consulting() {
  return (
    <>
      <Hero />
      <Shift />
      <Results />
      <Fit />
      <Offers />
      <Process />
      <Faq />
      <Cta />
      <Endorsers />
      <Newsletter />
    </>
  )
}
