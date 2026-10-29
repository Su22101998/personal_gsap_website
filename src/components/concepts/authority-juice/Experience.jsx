'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BookCallPill, SectionHeading } from './ui'
import { agency, asset, compare } from './content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── "Not your typical agency experience": the video grows to fill the screen ── */
function AgencyVideo() {
  const ref = useRef(null)
  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const playRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const frame = frameRef.current
        // Pinned: the frame scales from its slot to cover the viewport
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=120%', pin: true, scrub: 0.8, invalidateOnRefresh: true } })
          .to('.aj-video-head', { y: -80, opacity: 0, ease: 'power2.in', duration: 0.5 }, 0)
          .to(
            frame,
            {
              scale: () => Math.max(window.innerWidth / frame.offsetWidth, window.innerHeight / frame.offsetHeight),
              y: () => window.innerHeight / 2 - (frame.offsetTop + frame.offsetHeight / 2),
              borderRadius: 0,
              ease: 'power2.inOut',
              duration: 1,
            },
            0
          )

        // "Play" follows the cursor around the frame
        const px = gsap.quickTo(playRef.current, 'x', { duration: 0.5, ease: 'power3.out' })
        const py = gsap.quickTo(playRef.current, 'y', { duration: 0.5, ease: 'power3.out' })
        const move = (e) => {
          const r = frame.getBoundingClientRect()
          const scale = gsap.getProperty(frame, 'scale') || 1
          px((e.clientX - (r.left + r.width / 2)) / scale)
          py((e.clientY - (r.top + r.height / 2)) / scale)
        }
        const leave = () => {
          px(0)
          py(0)
        }
        frame.addEventListener('pointermove', move)
        frame.addEventListener('pointerleave', leave)
        return () => {
          frame.removeEventListener('pointermove', move)
          frame.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: ref }
  )

  const play = () => {
    const video = videoRef.current
    video.muted = false
    video.currentTime = 0
    video.controls = true
    video.play()
    setPlaying(true)
  }

  return (
    <>
      <section ref={ref} className="relative flex flex-col items-center px-5 pt-24 md:px-8 lg:h-screen lg:justify-center lg:pt-0">
        <div className="aj-video-head w-full">
          <SectionHeading title={agency.heading} sub={agency.sub} className="lg:mb-12" />
        </div>
        <div
          ref={frameRef}
          className="relative z-10 aspect-video w-full max-w-[880px] overflow-hidden rounded-[24px] border shadow-[0_40px_120px_-30px_rgb(255_102_18/0.45)] lg:w-[62vw]"
          style={{ borderColor: 'var(--aj-line)' }}
        >
          {/* Muted preview loops until the visitor chooses to play with sound */}
          <video ref={videoRef} src={agency.video} className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" />
          {!playing && (
            <button type="button" onClick={play} className="focus-ring absolute inset-0 flex items-center justify-center bg-black/20" aria-label="Play video with sound">
              <span ref={playRef} className="pointer-events-none relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#ff6612] text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_0_0_12px_rgb(255_102_18/0.25)]">
                <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-[#ff6612]/40" />
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true" className="relative ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="relative">Play</span>
              </span>
            </button>
          )}
        </div>
      </section>
      <div className="px-5 pb-24 pt-12 text-center md:pb-32">
        <BookCallPill />
      </div>
    </>
  )
}

/* ── Before / after: drag the divider ────────────── */
const GROWTH = 'M0 90 C 30 86, 50 60, 80 66 S 120 84, 150 62 S 200 50, 230 52 S 280 20, 320 4'

function FileIcon({ name, className = '' }) {
  return (
    <span className={`flex flex-col items-center gap-1 ${className}`}>
      <span className="relative h-[44px] w-[34px]">
        <Image src={compare.file} alt="" fill sizes="34px" className="object-contain" />
      </span>
      <span className="text-[10px] text-white/70">{name}</span>
    </span>
  )
}

function Avatar({ src, size = 44 }) {
  return (
    <span className="relative block overflow-hidden rounded-full ring-2 ring-[#2a2a2a]" style={{ width: size, height: size }}>
      <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  )
}

function Compare() {
  const ref = useRef(null)
  const stageRef = useRef(null)
  const afterRef = useRef(null)
  const handleRef = useRef(null)
  const pos = useRef(0.5)

  // Divider position 0–1 → clip the "after" layer and move the handle
  const apply = useCallback((p) => {
    pos.current = Math.min(0.97, Math.max(0.03, p))
    afterRef.current.style.clipPath = `inset(0 0 0 ${pos.current * 100}%)`
    handleRef.current.style.left = `${pos.current * 100}%`
    // Set directly — this runs every frame while dragging or during the intro sweep
    handleRef.current.setAttribute('aria-valuenow', Math.round(pos.current * 100))
  }, [])

  const fromPointer = (e) => {
    const r = stageRef.current.getBoundingClientRect()
    apply((e.clientX - r.left) / r.width)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Show both sides once on arrival: sweep to "before", then "after", then settle
        const proxy = { p: 0.5 }
        gsap
          .timeline({ scrollTrigger: { trigger: stageRef.current, start: 'top 70%', once: true }, onUpdate: () => apply(proxy.p) })
          .to(proxy, { p: 0.9, duration: 0.9, ease: 'power2.inOut' })
          .to(proxy, { p: 0.12, duration: 1.3, ease: 'power2.inOut' })
          .to(proxy, { p: 0.5, duration: 0.9, ease: 'power2.inOut' })
        gsap.to('.aj-chaos', { rotate: 360, duration: 26, ease: 'none', repeat: -1 })
        gsap.to('.aj-chaos-item', { rotate: -360, duration: 26, ease: 'none', repeat: -1 })
        gsap.to('.aj-ripple', { scale: 1.06, opacity: 0.6, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.4 })
        const line = ref.current.querySelector('.aj-growth-line')
        const length = line.getTotalLength()
        gsap.fromTo(line, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 2 })
      })
    },
    { scope: ref }
  )

  const { before, after, team } = compare

  return (
    <section ref={ref} className="px-5 pb-24 md:px-8 md:pb-32">
      <SectionHeading title={compare.heading} sub={compare.sub} />
      <div
        ref={stageRef}
        className="relative mx-auto aspect-[4/5] max-w-[1080px] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] border sm:aspect-[16/10] md:aspect-[16/8.5]"
        style={{ borderColor: 'var(--aj-line)' }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          fromPointer(e)
        }}
        onPointerMove={(e) => e.buttons === 1 && fromPointer(e)}
      >
        {/* Before — chaos */}
        <div className="absolute inset-0 bg-[#1d1d1d]">
          <div className="absolute left-5 top-5 max-w-[46%] md:left-8 md:top-8 md:max-w-[38%]">
            <span className="inline-block rounded-full bg-[#e5372b] px-4 py-1 text-sm font-semibold">{before.label}</span>
            <p className="mt-3 text-base font-semibold leading-snug md:text-xl">{before.text}</p>
          </div>
          <div className="absolute bottom-[4%] left-[2%] aspect-square w-[64%] grayscale md:left-[4%] md:w-[44%]">
            {[1, 0.72, 0.46].map((s, i) => (
              <span key={s} aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                <span className="aj-ripple rounded-full" style={{ width: `${s * 100}%`, height: `${s * 100}%`, background: `rgb(255 255 255 / ${0.03 + i * 0.03})` }} />
              </span>
            ))}
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {team.map((src) => (
                <Avatar key={src} src={src} size={42} />
              ))}
            </div>
            <div className="aj-chaos absolute inset-[6%]">
              {before.files.map((name, i) => {
                const angle = (i / before.files.length) * Math.PI * 2 - Math.PI / 2
                return (
                  <span key={name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + Math.cos(angle) * 44}%`, top: `${50 + Math.sin(angle) * 44}%` }}>
                    <FileIcon name={name} className="aj-chaos-item" />
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {/* After — order (clipped by the divider) */}
        <div
          ref={afterRef}
          className="absolute inset-0"
          style={{ clipPath: 'inset(0 0 0 50%)', background: 'radial-gradient(70% 80% at 80% 90%, rgb(255 102 18 / 0.35), transparent 70%), #242424' }}
        >
          <div className="absolute right-5 top-5 max-w-[46%] text-right md:right-8 md:top-8 md:max-w-[38%]">
            <span className="inline-block rounded-full bg-[#2fb24c] px-4 py-1 text-sm font-semibold">{after.label}</span>
            <p className="mt-3 text-base font-semibold leading-snug md:text-xl">{after.text}</p>
          </div>
          <div className="absolute bottom-[5%] right-[3%] grid w-[66%] grid-cols-[auto_1fr] gap-2.5 md:right-[4%] md:w-[46%] md:gap-3">
            <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-white/5 p-2.5">
              {team.map((src) => (
                <Avatar key={src} src={src} size={38} />
              ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 p-3">
              <div className="flex gap-3">
                {after.files.map((name) => (
                  <FileIcon key={name} name={name} />
                ))}
              </div>
              <div className="relative h-8 w-[84px]">
                <Image src={asset('logo.png')} alt="Authority Juice" fill sizes="84px" className="object-contain" />
              </div>
            </div>
            <div className="relative col-span-2 h-[110px] overflow-hidden rounded-2xl bg-white/5 p-3 md:h-[130px]">
              <p className="relative z-10 text-sm font-semibold">{after.chart}</p>
              <svg aria-hidden="true" viewBox="0 0 320 96" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[75%] w-full">
                <defs>
                  <linearGradient id="aj-growth-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ff6612" stopOpacity="0.7" />
                    <stop offset="1" stopColor="#ff6612" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path d={`${GROWTH} L 320 96 L 0 96 Z`} fill="url(#aj-growth-fill)" />
                <path className="aj-growth-line" d={GROWTH} fill="none" stroke="#ff6612" strokeWidth="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          ref={handleRef}
          role="slider"
          tabIndex={0}
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') apply(pos.current - 0.05)
            if (e.key === 'ArrowRight') apply(pos.current + 0.05)
          }}
          className="focus-ring absolute inset-y-0 left-1/2 w-0"
        >
          <span className="absolute inset-y-0 -left-px w-[2px] bg-white/80 shadow-[0_0_20px_rgb(255_255_255/0.5)]" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full bg-white text-[#1a1a1a] shadow-[0_0_0_6px_rgb(255_102_18/0.45)]">
            <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
              <path d="M8 1L2 7l6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
              <path d="M2 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      <p className="mt-4 text-center text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--aj-subtle)' }}>
        Drag to compare
      </p>
    </section>
  )
}

export default function Experience() {
  return (
    <>
      <AgencyVideo />
      <Compare />
    </>
  )
}
