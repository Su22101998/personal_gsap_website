'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'
import { SectionHeading, Tag } from './ui'
import { asset, founder, process } from './content'

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP)

/* ── Founder note: the statement lights up word by word; the portrait tilts toward the cursor ── */
function Founder() {
  const ref = useRef(null)
  const textRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(textRef.current, { type: 'words' })
        gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: textRef.current, start: 'top 80%', end: 'bottom 45%', scrub: true } })
        gsap.from('.aj-founder-card', { rotate: 8, y: 100, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.aj-founder-card', start: 'top 85%', once: true } })
        gsap.fromTo('.aj-founder-img', { yPercent: 14 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.from('.aj-founder-tag', { x: -40, opacity: 0, duration: 0.9, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.aj-founder-card', start: 'top 60%', once: true } })
        gsap.to('.aj-founder-sun', { rotate: 360, duration: 40, ease: 'none', repeat: -1 })
      })
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tilt = ref.current.querySelector('.aj-founder-tilt')
        const rx = gsap.quickTo(tilt, 'rotateX', { duration: 0.6, ease: 'power3.out' })
        const ry = gsap.quickTo(tilt, 'rotateY', { duration: 0.6, ease: 'power3.out' })
        const shine = ref.current.querySelector('.aj-founder-shine')
        const move = (e) => {
          const r = tilt.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top) / r.height
          ry((px - 0.5) * 16)
          rx(-(py - 0.5) * 12)
          shine.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgb(255 255 255 / 0.28), transparent 45%)`
        }
        const leave = () => {
          rx(0)
          ry(0)
          shine.style.background = 'transparent'
        }
        tilt.addEventListener('pointermove', move)
        tilt.addEventListener('pointerleave', leave)
        return () => {
          tilt.removeEventListener('pointermove', move)
          tilt.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1080px] items-center gap-14 md:grid-cols-[1fr_1.05fr]">
        <p ref={textRef} className="text-[1.65rem] font-medium leading-[1.3] tracking-[-0.01em] md:text-[2.1rem]">
          {founder.text}
        </p>

        <div className="aj-founder-card" style={{ perspective: '1100px' }}>
          <div className="aj-founder-tilt relative aspect-[4/3] overflow-hidden rounded-[28px] [transform-style:preserve-3d]" style={{ background: 'linear-gradient(160deg, #ff7a2e, #ff6612 45%, #d84d00)' }}>
            {/* Slow sunburst behind the portrait */}
            <div
              aria-hidden="true"
              className="aj-founder-sun absolute left-1/2 top-[45%] -ml-[60%] -mt-[60%] h-[120%] w-[120%] opacity-30"
              style={{ background: 'repeating-conic-gradient(from 0deg, rgb(255 255 255 / 0.35) 0deg 6deg, transparent 6deg 18deg)', maskImage: 'radial-gradient(circle, #000 20%, transparent 65%)', WebkitMaskImage: 'radial-gradient(circle, #000 20%, transparent 65%)' }}
            />
            <div className="aj-founder-img absolute inset-x-0 bottom-0 top-[6%]">
              <Image src={founder.img} alt={founder.name} fill sizes="(min-width: 768px) 540px, 90vw" className="object-contain object-bottom" />
            </div>
            <div aria-hidden="true" className="aj-founder-shine pointer-events-none absolute inset-0" />
            <div className="aj-founder-tag absolute bottom-[14%] left-[3%] rounded-xl bg-white px-4 py-3 text-[#1a1a1a] shadow-2xl [transform:translateZ(40px)]">
              <p className="text-sm font-semibold">
                <span className="text-[#ff6612]">{founder.name}</span> <span className="font-display italic text-[#ff6612]/80">{founder.alias}</span>
              </p>
              <p className="text-[11px] text-black/60">{founder.role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 3-step process: a drop of juice travels the path and wakes each step ── */
function StepVisual({ index }) {
  if (index === 0) {
    return (
      <div className="relative h-full w-full">
        <div className="aj-step-tile absolute left-[8%] top-[12%] h-[58%] w-[52%] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
          <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-2 ring-white/60">
            <Image src={asset('book-call-avatar.png')} alt="" fill sizes="56px" className="object-cover" />
          </div>
        </div>
        <div className="aj-step-tile absolute right-[8%] top-[22%] h-[52%] w-[44%] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff6612] text-[11px] font-bold shadow-lg">YOU</span>
        </div>
        <div className="aj-step-icon absolute left-[3%] top-[56%] h-10 w-10">
          <Image src={asset('step-calendly.png')} alt="" fill sizes="40px" className="object-contain" />
        </div>
        <div className="aj-step-icon absolute right-[4%] top-[6%] h-10 w-10">
          <Image src={asset('step-zoom.png')} alt="" fill sizes="40px" className="object-contain" />
        </div>
        <div className="absolute inset-x-[6%] bottom-[8%] h-8">
          <Image src={asset('step-zoom-toolbar.png')} alt="" fill sizes="320px" className="object-contain" />
        </div>
      </div>
    )
  }
  if (index === 1) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-x-[12%] bottom-0 top-[8%]">
          <Image src={asset('step-audit.png')} alt="" fill sizes="300px" className="object-contain object-bottom" />
        </div>
        <div className="aj-magnifier absolute left-[36%] top-[14%] h-20 w-20">
          <Image src={asset('step-magnifier.png')} alt="" fill sizes="80px" className="object-contain" />
        </div>
        <div className="aj-wand absolute right-[6%] top-[4%] h-14 w-14">
          <Image src={asset('step-wand.png')} alt="" fill sizes="56px" className="object-contain" />
        </div>
      </div>
    )
  }
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <span aria-hidden="true" className="aj-rocket-ring absolute h-40 w-40 rounded-full border border-white/30" />
      <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-[0_0_60px_rgb(255_190_120/0.6)]">
        <Image src={asset('step-rocket.gif')} alt="" fill sizes="128px" unoptimized className="object-cover" />
      </div>
    </div>
  )
}

// Wave through the three step nodes (at x = 200, 600, 1000; y = 80) — viewBox 0 0 1200 160
const ROUTE = 'M -40 130 C 60 130 110 80 200 80 C 300 80 330 150 400 150 C 470 150 500 80 600 80 C 700 80 730 10 800 10 C 870 10 900 80 1000 80 C 1090 80 1140 40 1240 40'
const NODE_AT = [0.2, 0.5, 0.8] // where each node sits along the route (fraction)

function Process() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.aj-step-tile', { y: -6, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.5 })
        gsap.to('.aj-step-icon', { y: 8, rotate: 8, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.6 })
        gsap
          .timeline({ repeat: -1, yoyo: true, defaults: { duration: 1.6, ease: 'sine.inOut' } })
          .to('.aj-magnifier', { x: -60, y: 30 })
          .to('.aj-magnifier', { x: 50, y: 60 })
          .to('.aj-magnifier', { x: 0, y: 0 })
        gsap.to('.aj-wand', { rotate: 14, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true })
        gsap.fromTo('.aj-rocket-ring', { scale: 0.8, opacity: 0.8 }, { scale: 1.5, opacity: 0, duration: 2.4, ease: 'power1.out', repeat: -1 })
      })

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const route = ref.current.querySelector('.aj-route')
        const length = route.getTotalLength()
        const cards = gsap.utils.toArray('.aj-step')
        const nodes = gsap.utils.toArray('.aj-node')
        gsap.set(route, { strokeDasharray: length, strokeDashoffset: length })
        gsap.set(cards, { y: 110, opacity: 0, scale: 0.88, rotate: (i) => (i - 1) * 4 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=200%', pin: true, scrub: 0.8 },
        })
        tl.to(route, { strokeDashoffset: 0, duration: 3 }, 0).to(
          '.aj-drop',
          { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5] }, duration: 3 },
          0
        )
        NODE_AT.forEach((at, i) => {
          tl.to(nodes[i], { scale: 1, backgroundColor: '#ff6612', borderColor: '#ff6612', duration: 0.15 }, at * 3)
          tl.to(cards[i], { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.6)' }, at * 3 - 0.1)
        })
      })

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from('.aj-step', { y: 70, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: '.aj-steps', start: 'top 80%', once: true } })
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} id="aj-process" className="relative overflow-hidden px-5 py-24 md:px-8 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="relative mx-auto w-full max-w-[1140px]">
        <SectionHeading title={process.heading} sub={process.sub} className="lg:mb-4" />

        {/* Route (desktop) */}
        <div aria-hidden="true" className="relative hidden h-[120px] lg:block">
          <svg viewBox="0 0 1200 160" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <path d={ROUTE} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="2" strokeDasharray="6 8" />
            <path className="aj-route" d={ROUTE} fill="none" stroke="#ff6612" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {[1 / 6, 1 / 2, 5 / 6].map((x, i) => (
            <span
              key={x}
              className="aj-node absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full border-2 border-white/40 bg-[#1a1a1a]"
              style={{ left: `${x * 100}%` }}
            />
          ))}
          {/* The drop */}
          <span className="aj-drop absolute left-0 top-0 block h-6 w-6 rounded-full border-4 border-[#1a1a1a] bg-[#ff6612] shadow-[0_0_28px_8px_rgb(255_102_18/0.6)]" />
        </div>

        <ol className="aj-steps grid gap-5 lg:-mt-6 lg:grid-cols-3">
          {process.steps.map((step, i) => (
            // GSAP owns the <li> transform (reveal); the hover lift is on the inner card
            <li key={step.title} className="aj-step">
              <div
                className="relative flex h-full flex-col overflow-hidden rounded-[26px] border transition-transform duration-500 hover:-translate-y-2"
                style={{ borderColor: 'var(--aj-line)', background: 'linear-gradient(180deg, #232323 0%, #2a1d15 55%, #b8480b 130%)' }}
              >
                <div className="relative h-[200px] lg:h-[170px]" style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgb(255 102 18 / 0.55), rgb(255 102 18 / 0.08) 60%, transparent)' }}>
                  <StepVisual index={i} />
                </div>
                <div className="flex flex-1 flex-col items-center px-6 pb-7 pt-4 text-center">
                  <Tag>{step.step}</Tag>
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--aj-muted)' }}>
                    {step.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function Story() {
  return (
    <>
      <Founder />
      <Process />
    </>
  )
}
