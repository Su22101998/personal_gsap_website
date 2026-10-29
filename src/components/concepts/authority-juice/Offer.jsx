'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import RevealText from '@/components/RevealText'
import { OrangeButton, SectionHeading, Tag } from './ui'
import { faq, plans, services } from './content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const pad = (n) => String(n).padStart(2, '0')

/* ── Services: a sticky index tracks the panels scrolling past ── */
function Services() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        gsap.utils.toArray('.aj-svc').forEach((panel, i) => {
          ScrollTrigger.create({ trigger: panel, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setActive(i) })
        })
      })
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.aj-svc-progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.aj-svc-panels', start: 'top 55%', end: 'bottom 55%', scrub: true } })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.aj-svc').forEach((panel) => {
          const media = panel.querySelector('.aj-svc-media')
          gsap.fromTo(media, { clipPath: 'inset(18% 10% 18% 10% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: panel, start: 'top 95%', end: 'top 35%', scrub: true } })
          gsap.fromTo(panel.querySelector('.aj-svc-img'), { scale: 1.25, rotate: -6 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'center center', scrub: true } })
          gsap.from(panel.querySelectorAll('.aj-svc-copy > *'), { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: panel, start: 'top 65%', once: true } })
        })
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} id="aj-services" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Sticky index (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-32">
            <RevealText as="h2" className="mb-10 font-display text-6xl leading-[1] tracking-[-0.02em]">
              {services.heading}
            </RevealText>
            <div className="relative pl-6">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-white/10" />
              <span aria-hidden="true" className="aj-svc-progress absolute inset-y-0 left-0 w-[2px] origin-top bg-[#ff6612]" />
              <ol className="space-y-1">
                {services.items.map((item, i) => (
                  <li key={item.title}>
                    <a
                      href={`#aj-svc-${i}`}
                      className="focus-ring group flex items-baseline gap-4 py-2 transition-colors duration-300"
                      style={{ color: active === i ? '#fff' : 'var(--aj-subtle)' }}
                      aria-current={active === i ? 'true' : undefined}
                    >
                      <span className="font-aj-tight text-xs font-semibold" style={{ color: active === i ? '#ff6612' : undefined }}>
                        {pad(i + 1)}
                      </span>
                      <span className={`text-lg font-semibold transition-transform duration-500 ${active === i ? 'translate-x-2' : 'group-hover:translate-x-1'}`}>{item.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div>
          <SectionHeading title={services.heading} className="lg:hidden" />
          <ol className="aj-svc-panels space-y-20 lg:space-y-0">
            {services.items.map((item, i) => (
              <li key={item.title} id={`aj-svc-${i}`} className="aj-svc flex flex-col justify-center lg:min-h-[88vh]">
                <div className="aj-svc-media relative aspect-[4/3] overflow-hidden rounded-[28px] border" style={{ borderColor: 'var(--aj-line)', background: 'radial-gradient(70% 70% at 60% 60%, rgb(255 102 18 / 0.6), rgb(255 102 18 / 0.08) 60%, transparent 80%), #232323' }}>
                  <span aria-hidden="true" className="absolute left-6 top-5 font-aj-tight text-[7rem] font-bold leading-none text-white/[0.06]">
                    {pad(i + 1)}
                  </span>
                  <div className="aj-svc-img absolute inset-[10%]">
                    <Image src={item.img} alt="" fill sizes="(min-width: 1024px) 680px, 90vw" className="object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.5)]" />
                  </div>
                </div>
                <div className="aj-svc-copy mt-8 md:grid md:grid-cols-[1fr_1.2fr] md:gap-10">
                  <h3 className="mb-4 text-[1.7rem] font-semibold leading-tight tracking-[-0.01em] md:text-[2rem]">{item.title}</h3>
                  <div>
                    {item.text.map((para) => (
                      <p key={para} className="mb-3 text-[15px] leading-relaxed" style={{ color: 'var(--aj-muted)' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ── Plans: a horizontal accordion (stacked on small screens) ── */
const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
    <circle cx="12" cy="12" r="11" fill="rgb(255 102 18 / 0.15)" />
    <path d="M7 12.5l3.2 3.2L17 9" stroke="#ff6612" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Plans() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo(
        ref.current.querySelectorAll('.aj-plan-open .aj-plan-anim'),
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.04, delay: 0.25 }
      )
    },
    { scope: ref, dependencies: [active] }
  )

  return (
    <section ref={ref} className="px-5 py-24 md:px-8 md:py-32">
      <SectionHeading title={plans.heading} />
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 lg:h-[680px] lg:flex-row">
        {plans.items.map((plan, i) => {
          const isOpen = active === i
          return (
            <article
              key={plan.tab}
              className={`relative overflow-hidden rounded-[28px] border transition-[flex-grow,background-color,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-w-[92px] lg:basis-0 ${isOpen ? 'aj-plan-open' : ''}`}
              style={{
                flexGrow: isOpen ? 6 : 1,
                borderColor: isOpen ? 'rgb(255 102 18 / 0.5)' : 'var(--aj-line)',
                background: isOpen ? 'radial-gradient(60% 70% at 100% 100%, rgb(255 102 18 / 0.2), transparent 70%), var(--aj-card)' : 'var(--aj-card)',
              }}
            >
              {/* Header: a full-width row on small screens, a vertical spine on desktop when closed */}
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={isOpen}
                aria-controls={`aj-plan-${i}`}
                className={`focus-ring group flex w-full items-center gap-4 p-5 text-left lg:absolute lg:inset-0 lg:flex-col lg:justify-between lg:p-6 ${isOpen ? 'lg:pointer-events-none lg:opacity-0' : ''}`}
              >
                <span className="font-aj-tight text-3xl font-bold text-[#ff6612] lg:text-5xl">{pad(i + 1)}</span>
                <span className="flex-1 text-[15px] font-semibold lg:flex-none lg:rotate-180 lg:text-lg lg:[writing-mode:vertical-rl]">
                  {plan.tab}
                  {plan.addOn && <span className="ml-2 text-xs font-normal uppercase tracking-wider text-white/50 lg:ml-0 lg:mt-3">Add On</span>}
                </span>
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-lg transition-colors group-hover:border-[#ff6612] group-hover:bg-[#ff6612]">
                  +
                </span>
              </button>

              <div id={`aj-plan-${i}`} hidden={!isOpen} className="relative px-6 pb-8 lg:absolute lg:inset-y-0 lg:left-0 lg:w-[min(760px,62vw)] lg:p-12">
                <span aria-hidden="true" className="aj-plan-anim pointer-events-none absolute -bottom-8 right-2 hidden font-aj-tight text-[16rem] font-bold leading-none text-white/[0.04] lg:block">
                  {i + 1}
                </span>
                <div className="aj-plan-anim mb-5 hidden gap-2 lg:flex">
                  <span className="rounded-full bg-[#4a1d10] px-3 py-1 text-sm text-[#ffb08a]">{plan.plan}</span>
                  {plan.addOn && <Tag>Add On</Tag>}
                </div>
                <h3 className="aj-plan-anim mb-4 text-3xl font-semibold tracking-[-0.01em] lg:text-4xl">{plan.title}</h3>
                <p className="aj-plan-anim mb-7 max-w-[62ch] leading-relaxed" style={{ color: 'var(--aj-muted)' }}>
                  {plan.text}
                </p>
                <p className="aj-plan-anim mb-4 font-semibold">{plans.includes}</p>
                <ul className="mb-9 grid gap-x-8 gap-y-3 md:grid-cols-2">
                  {plan.features.map((f) => (
                    <li key={f} className="aj-plan-anim flex gap-3 text-[15px] font-medium">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="aj-plan-anim">
                  <OrangeButton>Book a call</OrangeButton>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ── FAQ ─────────────────────────────────────────── */
function Faq() {
  const [open, setOpen] = useState(-1)
  const half = Math.ceil(faq.items.length / 2)
  const columns = [faq.items.slice(0, half), faq.items.slice(half)]

  return (
    <section id="aj-faq" className="px-5 py-24 md:px-8 md:py-32">
      <SectionHeading title={faq.heading} />
      <div className="mx-auto grid max-w-[1080px] items-start gap-4 md:grid-cols-2">
        {columns.map((column, c) => (
          <ul key={c} className="grid gap-4">
            {column.map((item, j) => {
              const i = c * half + j
              const isOpen = open === i
              return (
                <li key={item.q} className="overflow-hidden rounded-2xl border transition-colors duration-300" style={{ borderColor: isOpen ? 'rgb(255 102 18 / 0.5)' : 'var(--aj-line)', background: 'var(--aj-card)' }}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`aj-faq-${i}`}
                    className="focus-ring flex w-full items-center justify-between gap-5 p-5 text-left text-[16px] font-medium leading-snug md:text-[17px]"
                  >
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xl font-light transition-[transform,background-color,color] duration-300"
                      style={{ background: isOpen ? '#ff6612' : '#fff', color: isOpen ? '#fff' : '#ff6612', transform: isOpen ? 'rotate(45deg)' : 'none' }}
                    >
                      +
                    </span>
                  </button>
                  <div id={`aj-faq-${i}`} className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-6 text-[15px] leading-relaxed" style={{ color: 'var(--aj-muted)' }}>
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </section>
  )
}

export default function Offer() {
  return (
    <>
      <Services />
      <Plans />
      <Faq />
    </>
  )
}
