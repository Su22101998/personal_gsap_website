'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const ENABLE_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const INTERACTIVE = 'a, button, [role="button"], [role="radio"], label, [data-cursor-label]'
const NATIVE = '[data-native-cursor]'
const TEXT_ENTRY = 'input:not([type="radio"]):not([type="checkbox"]), textarea, select, [contenteditable="true"]'

/**
 * Custom cursor — square, like the block-pixel headline type: a small
 * square that tracks the pointer exactly and a square outline that trails
 * it. Over links/buttons the outline grows and the square hides; over an
 * element with `data-cursor-label="…"` the outline becomes a filled accent
 * square showing that label. Inside `[data-native-cursor]` (the navbar) it fades
 * out and the system pointer takes over. Inverts against any background
 * (difference blend).
 *
 * Fine pointers without reduced motion only; the native cursor is hidden
 * via `.has-custom-cursor` (globals.css) and kept for text fields.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const layerRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const query = window.matchMedia(ENABLE_QUERY)
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useGSAP(
    (context, contextSafe) => {
      if (!enabled) return
      const html = document.documentElement
      const dot = dotRef.current
      const ring = ringRef.current
      const label = labelRef.current

      html.classList.add('has-custom-cursor')
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.18, ease: 'power3.out' })
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.18, ease: 'power3.out' })

      let visible = false
      let mode = 'idle' // idle | hover | label | text | native

      // Animates the ring/dot/label to the current mode
      const applyMode = () => {
        ring.dataset.mode = mode
        // Native: step aside for the system pointer
        gsap.to(layerRef.current, { autoAlpha: mode === 'native' ? 0 : 1, duration: 0.15, overwrite: 'auto' })
        if (mode === 'native') return
        gsap.to(ring, {
          scale: { idle: 1, hover: 1.8, label: 2.6, text: 0.4 }[mode],
          duration: 0.45,
          ease: 'expo.out',
          overwrite: 'auto',
        })
        gsap.to(dot, { scale: mode === 'idle' ? 1 : 0, duration: 0.3, overwrite: 'auto' })
        gsap.to(label, { autoAlpha: mode === 'label' ? 1 : 0, duration: 0.25, overwrite: 'auto' })
      }

      const setMode = (next, text = '') => {
        if (next === mode && text === label.textContent) return
        mode = next
        label.textContent = text
        applyMode()
      }

      const onMove = contextSafe((e) => {
        dotX(e.clientX)
        dotY(e.clientY)
        ringX(e.clientX)
        ringY(e.clientY)
        if (!visible) {
          visible = true
          // First appearance: jump to the pointer instead of flying in from 0,0
          gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
        }
      })

      const onOver = contextSafe((e) => {
        const target = e.target instanceof Element ? e.target : null
        if (!target) return
        if (target.closest(NATIVE)) return setMode('native')
        if (target.closest(TEXT_ENTRY)) return setMode('text')
        const labelled = target.closest('[data-cursor-label]')
        if (labelled) return setMode('label', labelled.dataset.cursorLabel)
        if (target.closest(INTERACTIVE)) return setMode('hover')
        setMode('idle')
      })

      const onLeaveWindow = contextSafe(() => {
        visible = false
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 })
      })
      // Press: ring tightens; release: back to the current mode's size
      const onDown = contextSafe(() => gsap.to(ring, { scale: '-=0.25', duration: 0.15, overwrite: 'auto' }))
      const onUp = contextSafe(applyMode)

      window.addEventListener('pointermove', onMove)
      document.addEventListener('pointerover', onOver)
      document.documentElement.addEventListener('pointerleave', onLeaveWindow)
      window.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)

      return () => {
        html.classList.remove('has-custom-cursor')
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
      }
    },
    { dependencies: [enabled] }
  )

  if (!enabled) return null

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[10002]">
      <div
        ref={ringRef}
        data-mode="idle"
        className="custom-cursor-ring absolute left-0 top-0 flex h-8 w-8 items-center justify-center"
      >
        <span
          ref={labelRef}
          className="text-[5px] font-semibold uppercase tracking-[0.14em]"
          style={{ visibility: 'hidden', color: 'rgb(var(--c-ink))' }}
        />
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 bg-white"
        style={{ mixBlendMode: 'difference' }}
      />
    </div>
  )
}
