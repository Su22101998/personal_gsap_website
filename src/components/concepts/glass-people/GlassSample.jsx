'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

/*
 * A live glass sample, drawn in CSS: each kind shows what makes it different
 * (the green edge of toughened glass, the interlayer in laminated, a tint, a
 * mirror, half-silvered one-way, lacquer, blocks, a printed pattern). A soft
 * pattern sits behind every pane so transparency and blur actually read.
 * Tilts toward the pointer; a sheen sweeps across on hover.
 */

const PANE = 'absolute inset-[14%] rounded-[10px]'

function Pane({ kind }) {
  switch (kind) {
    case 'toughened':
      return <div className={`${PANE} gp-pane gp-pane-clear`} />
    case 'laminated':
      return (
        <>
          <div className={`${PANE} gp-pane gp-pane-clear translate-x-[-5%] translate-y-[-5%]`} />
          <div className={`${PANE} gp-pane gp-pane-clear translate-x-[5%] translate-y-[5%]`} style={{ boxShadow: 'inset 0 0 0 3px rgb(240 236 214 / 0.55)' }} />
        </>
      )
    case 'tinted':
      return <div className={`${PANE} gp-pane`} style={{ background: 'linear-gradient(140deg, rgb(150 110 70 / 0.55), rgb(90 70 50 / 0.65))' }} />
    case 'mirror':
      return <div className={`${PANE} gp-mirror`} />
    case 'oneway':
      return (
        <div className={`${PANE} overflow-hidden`}>
          <div className="gp-mirror absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <div className="gp-pane gp-pane-clear absolute inset-0 rounded-none" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
        </div>
      )
    case 'lacquered':
      return <div className={`${PANE} gp-lacquer`} />
    case 'blocks':
      return (
        <div className={`${PANE} grid grid-cols-3 gap-[6%]`}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="gp-block rounded-[6px]" />
          ))}
        </div>
      )
    case 'print':
      return (
        <div className={`${PANE} gp-pane overflow-hidden`}>
          <div className="gp-print absolute inset-0" />
        </div>
      )
    default:
      return null
  }
}

export default function GlassSample({ kind, className = '' }) {
  const ref = useRef(null)

  const { contextSafe } = useGSAP({ scope: ref })

  const onMove = contextSafe((e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(ref.current.firstElementChild, { rotateY: x * 16, rotateX: -y * 16, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  })
  const onEnter = contextSafe(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(ref.current.querySelector('.gp-sheen'), { xPercent: -160 }, { xPercent: 160, duration: 0.9, ease: 'power2.inOut' })
  })
  const onLeave = contextSafe(() => {
    gsap.to(ref.current.firstElementChild, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
  })

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={`gp-sample-bg relative overflow-hidden rounded-[18px] [perspective:700px] ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        <Pane kind={kind} />
        <span className="gp-sheen pointer-events-none absolute inset-y-0 left-1/2 -ml-[30%] w-[60%]" />
      </div>
    </div>
  )
}
