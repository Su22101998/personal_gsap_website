'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import RevealText from '@/components/RevealText'
import { BOOK_CALL, asset, hero } from './content'

/*
 * Shared building blocks for the Authority Juice redesign. The palette is
 * Authority Juice's own (charcoal, white and their signature orange), set as
 * --aj-* custom properties on the page wrapper.
 */
export const PALETTE = {
  '--aj-bg': '#1a1a1a',
  '--aj-card': '#212121',
  '--aj-card-2': '#2a2a2a',
  '--aj-fg': '#ffffff',
  '--aj-muted': 'rgb(255 255 255 / 0.66)',
  '--aj-subtle': 'rgb(255 255 255 / 0.42)',
  '--aj-line': 'rgb(255 255 255 / 0.1)',
  '--aj-orange': '#ff6612',
  '--aj-orange-deep': '#ec5701',
}

export const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

export const ArrowIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/** Small uppercase pill label, as used on every Authority Juice card */
export function Tag({ children, className = '', style }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.08em] ${className}`}
      style={{ borderColor: 'rgb(255 102 18 / 0.35)', background: 'rgb(255 255 255 / 0.04)', color: 'var(--aj-muted)', ...style }}
    >
      {children}
    </span>
  )
}

/** Centred serif section heading with a sans subline */
export function SectionHeading({ title, sub, className = '' }) {
  return (
    <div className={`mx-auto mb-14 max-w-4xl text-center md:mb-20 ${className}`}>
      <RevealText as="h2" className="font-display text-[2.6rem] leading-[1] tracking-[-0.02em] md:text-6xl lg:text-[4.4rem]">
        {title}
      </RevealText>
      {sub && (
        <RevealText as="p" delay={0.15} className="mt-5 text-base md:text-lg" style={{ color: 'var(--aj-muted)' }}>
          {sub}
        </RevealText>
      )}
    </div>
  )
}

/** Their signature "Book a call" pill: founder avatar + label, white on charcoal */
export function BookCallPill({ className = '' }) {
  return (
    <a
      href={BOOK_CALL}
      {...EXTERNAL}
      className={`focus-ring group relative inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-6 text-[15px] font-semibold text-[#1a1a1a] shadow-[0_10px_40px_-10px_rgb(255_102_18/0.6)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-10px_rgb(255_102_18/0.8)] ${className}`}
    >
      <span className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-[#ff6612]">
        <Image src={asset('book-call-avatar.png')} alt="" fill sizes="40px" className="object-cover" />
      </span>
      {hero.cta}
      <span className="flex h-6 w-0 items-center overflow-hidden text-[#ff6612] transition-[width] duration-300 group-hover:w-5">
        <ArrowIcon size={16} />
      </span>
    </a>
  )
}

export function OrangeButton({ children, href = BOOK_CALL, className = '' }) {
  return (
    <a
      href={href}
      {...EXTERNAL}
      className={`focus-ring relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.02em] text-white transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
      style={{ background: 'linear-gradient(180deg, #ff7a2e, var(--aj-orange) 55%, var(--aj-orange-deep))', boxShadow: '0 10px 30px -10px rgb(255 102 18 / 0.8), inset 0 1px 0 rgb(255 255 255 / 0.3)' }}
    >
      {children}
    </a>
  )
}

/**
 * Pointer-tracked spotlight for cards: sets --mx / --my on the element so a
 * radial orange glow follows the cursor (see `.aj-spot` in Card).
 */
export function useSpotlight() {
  return useCallback((e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])
}

/** Dark rounded card with a hairline border and a cursor-following glow */
export function Card({ as: Tag = 'div', className = '', children, glow = true, style, ...rest }) {
  const onPointerMove = useSpotlight()
  return (
    <Tag
      onPointerMove={glow ? onPointerMove : undefined}
      className={`group/card relative overflow-hidden rounded-[24px] border ${className}`}
      style={{ background: 'var(--aj-card)', borderColor: 'var(--aj-line)', ...style }}
      {...rest}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{ background: 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(255 102 18 / 0.16), transparent 60%)' }}
        />
      )}
      {children}
    </Tag>
  )
}
