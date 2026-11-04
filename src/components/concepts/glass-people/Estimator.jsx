'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { company, estimate as copy, range } from './content'

const priced = range.items.filter((i) => i.price)
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

function NumberField({ id, label, value, onChange, min = 1, step = 0.5 }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#0e2a2b]/60">{label}</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="gp-input"
      />
    </label>
  )
}

/**
 * Ballpark price from the listed "from" prices: area × rate for sheet glass,
 * pieces × rate for blocks. The total counts up to each new figure.
 */
export default function Estimator() {
  const [kind, setKind] = useState(priced[0].kind)
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('7')
  const [qty, setQty] = useState('2')
  const totalRef = useRef(null)
  const shown = useRef({ value: 0 })

  const item = priced.find((i) => i.kind === kind)
  const perPiece = item.unit === 'piece'
  const n = (v) => Math.max(0, parseFloat(v) || 0)
  const area = perPiece ? 0 : n(width) * n(height) * n(qty)
  const total = useMemo(() => (perPiece ? n(qty) * item.price : area * item.price), [perPiece, qty, area, item.price])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.to(shown.current, {
      value: total,
      duration: reduce ? 0 : 0.6,
      ease: 'power3.out',
      onUpdate: () => {
        if (totalRef.current) totalRef.current.textContent = inr(shown.current.value)
      },
    })
    return () => tween.kill()
  }, [total])

  return (
    <div className="gp-glass grid gap-8 rounded-[28px] p-6 md:grid-cols-[1.2fr_1fr] md:p-10">
      <div className="flex flex-col gap-6">
        <fieldset>
          <legend className="mb-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[#0e2a2b]/60">{copy.glassLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {priced.map((i) => (
              <label
                key={i.kind}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                  kind === i.kind ? 'border-[#0e2a2b] bg-[#0e2a2b] text-white' : 'border-[#0e2a2b]/20 bg-white/60 text-[#0e2a2b] hover:border-[#0e2a2b]/50'
                }`}
              >
                <input type="radio" name="gp-kind" value={i.kind} checked={kind === i.kind} onChange={() => setKind(i.kind)} className="sr-only" />
                {i.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-3 gap-4">
          {!perPiece && <NumberField id="gp-w" label={copy.widthLabel} value={width} onChange={setWidth} />}
          {!perPiece && <NumberField id="gp-h" label={copy.heightLabel} value={height} onChange={setHeight} />}
          <NumberField id="gp-q" label={perPiece ? 'Pieces' : copy.qtyLabel} value={qty} onChange={setQty} step={1} />
        </div>

        <p className="text-[13px] leading-relaxed text-[#0e2a2b]/60">{copy.disclaimer}</p>
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-[20px] bg-[#0e2a2b] p-6 text-white md:p-8">
        <div>
          <p className="text-[12px] uppercase tracking-[0.16em] text-white/60">{copy.total}</p>
          <p ref={totalRef} className="gp-display mt-2 text-5xl md:text-6xl" aria-live="polite">
            {inr(0)}
          </p>
          <p className="mt-3 text-sm text-white/70">
            {perPiece
              ? `${n(qty)} pieces × ${inr(item.price)} per piece`
              : `${copy.area}: ${area.toLocaleString('en-IN', { maximumFractionDigits: 1 })} sq ft × ${inr(item.price)} per sq ft`}
          </p>
        </div>
        <a href={company.phoneHref} className="gp-btn gp-btn-light self-start">
          {copy.cta} →
        </a>
      </div>
    </div>
  )
}
