import gsap from 'gsap'

/**
 * Pointer-proximity effect for split characters: each one lifts and "heats"
 * (a 0–1 --heat custom property the markup turns into colour) as the cursor
 * nears it. Call inside a GSAP context/matchMedia callback; returns cleanup.
 */
export function proximityChars(chars, { radius = 150, lift = 16 } = {}) {
  gsap.set(chars, { '--heat': 0 })
  const items = chars.map((el) => ({
    el,
    y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }),
    heat: gsap.quickTo(el, '--heat', { duration: 0.4, ease: 'power2.out' }),
  }))

  const onMove = (e) => {
    items.forEach((item) => {
      const r = item.el.getBoundingClientRect()
      const distance = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
      const force = Math.max(0, 1 - distance / radius)
      item.y(-lift * force)
      item.heat(force)
    })
  }
  const onLeave = () =>
    items.forEach((item) => {
      item.y(0)
      item.heat(0)
    })

  window.addEventListener('pointermove', onMove)
  document.documentElement.addEventListener('pointerleave', onLeave)
  return () => {
    window.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('pointerleave', onLeave)
  }
}

/** Splits text into per-character spans (keeps spaces), for proximity effects */
export const toChars = (text) => Array.from(text)
