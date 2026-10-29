'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { EXTERNAL, OrangeButton } from './ui'
import { asset, frame, LIVE_SITE, nav } from './content'

/** Cyber Pears frame: back to the studio site, what this is, and the live original */
export function ConceptBar() {
  return (
    <div
      className="relative z-30 flex items-center justify-between gap-4 border-b px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] md:px-10"
      style={{ borderColor: 'var(--aj-line)', color: 'var(--aj-muted)', background: '#111' }}
    >
      <Link href="/#work" className="focus-ring flex items-center gap-2 transition-colors hover:text-white">
        <span aria-hidden="true">←</span>
        <span className="heading-dot text-sm normal-case tracking-normal text-white">{frame.back}</span>
      </Link>
      <p className="hidden sm:block">
        {frame.label} · <span className="text-white">{frame.client}</span>
      </p>
      <a href={LIVE_SITE} {...EXTERNAL} className="focus-ring flex items-center gap-1.5 transition-colors hover:text-white">
        {frame.live} ↗
      </a>
    </div>
  )
}

/** Authority Juice nav — logo, section links (current one marked), Book a call */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#aj-top')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      // The nav order isn't the page order (Results sits above Services), so
      // pick the section whose top is closest above the threshold
      let current = nav[0].href
      let best = -Infinity
      nav.forEach((link) => {
        const el = document.querySelector(link.href)
        const top = el ? el.getBoundingClientRect().top : Infinity
        if (top < window.innerHeight * 0.4 && top > best) {
          best = top
          current = link.href
        }
      })
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-20 transition-[background-color,border-color] duration-500"
      style={{
        background: scrolled || open ? 'rgb(26 26 26 / 0.78)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'var(--aj-line)' : 'transparent'}`,
        backdropFilter: scrolled || open ? 'blur(18px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled || open ? 'blur(18px) saturate(160%)' : 'none',
      }}
    >
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
        <a href="#aj-top" className="focus-ring relative block h-[42px] w-[104px]" aria-label="Authority Juice">
          <Image src={asset('logo.png')} alt="Authority Juice" fill sizes="104px" className="object-contain object-left" priority />
        </a>

        <nav aria-label="Authority Juice" className="hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full border px-1.5 py-1.5" style={{ borderColor: 'var(--aj-line)', background: 'rgb(255 255 255 / 0.03)' }}>
            {nav.map((link) => {
              const isActive = active === link.href
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className="focus-ring block rounded-full px-4 py-2 text-[14px] transition-colors duration-300"
                    style={{ background: isActive ? 'rgb(255 255 255 / 0.08)' : 'transparent', color: isActive ? '#fff' : 'var(--aj-muted)' }}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <OrangeButton className="hidden sm:inline-flex">Book a call</OrangeButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden"
            style={{ borderColor: 'var(--aj-line)' }}
          >
            <span className="flex flex-col gap-1.5">
              <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
              <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`overflow-hidden transition-[max-height] duration-500 lg:hidden ${open ? 'max-h-[420px]' : 'max-h-0'}`}>
        <ul className="flex flex-col px-5 pb-6">
          {nav.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)} className="block border-b py-3 font-display text-3xl" style={{ borderColor: 'var(--aj-line)' }}>
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-5 sm:hidden">
            <OrangeButton className="w-full">Book a call</OrangeButton>
          </li>
        </ul>
      </div>
    </header>
  )
}
